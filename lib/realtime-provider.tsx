'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { useOfflineContext } from './offline-provider';

interface RocketMessage {
  _id: string;
  msg: string;
  ts: string;
  u: {
    _id: string;
    username: string;
    name: string;
  };
  rid: string;
  _updatedAt: string;
  attachments?: any[];
  reactions?: any;
}

type RealtimeContextType = {
  messages: RocketMessage[];
  subscribeToChannel: (channelId: string, callback: (message: RocketMessage | RocketMessage[]) => void) => void;
  unsubscribeFromChannel: (channelId: string) => void;
  wsStatus: 'connecting' | 'connected' | 'disconnected';
};

const ROCKET_CONFIG = {
  BASE_URL: "https://amigurumi-gaur.pikapod.net/api/v1",
  WS_URL: "wss://amigurumi-gaur.pikapod.net/websocket",
  AUTH: {
    userId: 'qrzRQGpEiGxsSG6M2',
    authToken: 'TkZDG5qK3T1FJiw9N2joUBtNaD8VGQqP3P8jJlHS4rH'
  }
};

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export const useRealtimeContext = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtimeContext must be used within a RealtimeProvider');
  }
  return context;
};

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 5000;

// Modify WebSocket manager to handle active instance better
const WebSocketManager = {
  currentInstanceId: 0,
  activeInstanceId: null as number | null,
  getNewInstanceId() {
    this.currentInstanceId += 1;
    if (this.activeInstanceId === null) {
      this.activeInstanceId = this.currentInstanceId;
    }
    return this.currentInstanceId;
  },
  setActiveInstance(id: number) {
    this.activeInstanceId = id;
    console.log('🔄 Setting active WebSocket instance:', id);
  },
  isActiveInstance(id: number) {
    return id === this.activeInstanceId;
  }
};

export const RealtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<RocketMessage[]>([]);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [messageCallbacks] = useState<{ [channelId: string]: (message: RocketMessage | RocketMessage[]) => void }>({});
  const { saveMessageToDb, loadMessagesFromDb } = useOfflineContext();
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const isConnecting = useRef(false);
  const isMounted = useRef(false);
  const instanceId = useRef(WebSocketManager.getNewInstanceId());

  // Add activeSubscriptions tracking
  const activeSubscriptions = useRef<Set<string>>(new Set());
  const pendingSubscriptions = useRef<Set<string>>(new Set());

  const connectWebSocket = useCallback(() => {
    if (!isMounted.current) {
      console.log('🚫 Component not mounted, skipping connection');
      return;
    }

    if (isConnecting.current) {
      console.log('🔄 Connection attempt already in progress');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('🟢 WebSocket already connected');
      return;
    }

    try {
      isConnecting.current = true;
      console.log('🔌 Initiating WebSocket connection...', {
        instanceId: instanceId.current,
        activeInstanceId: WebSocketManager.activeInstanceId
      });

      const socket = new WebSocket(ROCKET_CONFIG.WS_URL);
      wsRef.current = socket;
      setWsStatus('connecting');

      socket.onopen = () => {
        console.log('✅ WebSocket connected successfully', {
          readyState: socket.readyState,
          wsRef: !!wsRef.current
        });
        
        setWsStatus('connected');
        reconnectAttempts.current = 0;
        isConnecting.current = false;

        console.log('🔑 Sending connect message...');
        socket.send(JSON.stringify({
          msg: 'connect',
          version: '1',
          support: ['1']
        }));

        console.log('🔐 Sending login message...');
        socket.send(JSON.stringify({
          msg: 'method',
          method: 'login',
          id: 'login-' + Date.now(),
          params: [{
            resume: ROCKET_CONFIG.AUTH.authToken
          }]
        }));
      };

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('📨 Received WebSocket message:', data);
        
        if (data.msg === 'changed' && data.collection === 'stream-room-messages') {
          console.log('📝 Processing new message...');
          if (data.fields?.args?.[0]) {
            const rawMessage = data.fields.args[0];
            const roomId = rawMessage.rid;
            
            // Format the message with proper date handling
            const formattedMessage = {
              _id: rawMessage._id,
              msg: rawMessage.msg,
              ts: rawMessage.ts.$date ? new Date(rawMessage.ts.$date).toISOString() : rawMessage.ts,
              u: {
                _id: rawMessage.u._id,
                username: rawMessage.u.username,
                name: rawMessage.u.name
              },
              rid: rawMessage.rid,
              _updatedAt: rawMessage._updatedAt.$date ? 
                new Date(rawMessage._updatedAt.$date).toISOString() : 
                rawMessage._updatedAt,
              attachments: rawMessage.attachments || [],
              reactions: rawMessage.reactions || {}
            };
            
            if (messageCallbacks[roomId]) {
              await saveMessageToDb(formattedMessage);
              setMessages(prev => [...prev, formattedMessage]);
              messageCallbacks[roomId](formattedMessage);
            }
          }
        }
      };

      socket.onclose = (event) => {
        console.log('🔌 WebSocket disconnected', {
          instanceId: instanceId.current,
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          wsRef: !!wsRef.current
        });
        
        if (wsRef.current === socket) {
          wsRef.current = null;
          setWsStatus('disconnected');
        }
        isConnecting.current = false;

        // Only attempt reconnect if this is the latest instance
        if (WebSocketManager.activeInstanceId === instanceId.current && 
            isMounted.current && 
            !event.wasClean && 
            reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current++;
          console.log(`⏳ Scheduling reconnect attempt ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS} in ${RECONNECT_DELAY}ms`);
          
          if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
          }
          reconnectTimeout.current = setTimeout(connectWebSocket, RECONNECT_DELAY);
        }
      };

      socket.onerror = (error) => {
        console.log('❌ WebSocket error:', error);
        isConnecting.current = false;
      };

    } catch (error) {
      console.log('❌ Error creating WebSocket:', error);
      wsRef.current = null;
      setWsStatus('disconnected');
      isConnecting.current = false;
    }
  }, []);

  // Single useEffect for WebSocket lifecycle
  useEffect(() => {
    console.log('🔄 Initial WebSocket setup', { 
      instanceId: instanceId.current,
      activeInstanceId: WebSocketManager.activeInstanceId
    });
    
    isMounted.current = true;
    reconnectAttempts.current = 0;
    WebSocketManager.setActiveInstance(instanceId.current);
    connectWebSocket();

    return () => {
      console.log('🧹 Cleaning up WebSocket resources', { 
        instanceId: instanceId.current,
        activeInstanceId: WebSocketManager.activeInstanceId
      });
      
      isMounted.current = false;
      isConnecting.current = false;
      
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = undefined;
      }
      
      if (wsRef.current) {
        console.log('🔴 Closing WebSocket connection', { 
          instanceId: instanceId.current,
          activeInstanceId: WebSocketManager.activeInstanceId
        });
        const socket = wsRef.current;
        wsRef.current = null;
        socket.close(1000, 'Component unmounting');
      }
      
      reconnectAttempts.current = MAX_RECONNECT_ATTEMPTS;
    };
  }, [connectWebSocket]);

  const subscribeToChannel = useCallback(async (channelId: string, callback: (message: RocketMessage | RocketMessage[]) => void) => {
    // Check if already subscribed or pending
    if (activeSubscriptions.current.has(channelId)) {
      console.log('📌 Already subscribed to channel:', channelId);
      return;
    }

    if (pendingSubscriptions.current.has(channelId)) {
      console.log('⏳ Subscription already pending for channel:', channelId);
      return;
    }

    console.log('📡 Subscribing to channel:', channelId, {
      wsStatus,
      wsExists: !!wsRef.current,
      readyState: wsRef.current?.readyState,
      isConnecting: isConnecting.current
    });

    pendingSubscriptions.current.add(channelId);
    messageCallbacks[channelId] = callback;

    try {
      console.log('🔍 Checking local cache for messages...');
      const cachedMessages = await loadMessagesFromDb(channelId);
      if (cachedMessages && cachedMessages.length > 0) {
        console.log('📦 Using cached messages:', cachedMessages.length);
        setMessages(cachedMessages);
        callback(cachedMessages);
      }

      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.log('🔄 WebSocket not ready, attempting to connect...');
        connectWebSocket();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log('🔔 Sending subscription message to WebSocket');
        wsRef.current.send(JSON.stringify({
          msg: 'sub',
          id: `room-messages-${channelId}`,
          name: 'stream-room-messages',
          params: [channelId, { useCollection: false, args: [{ 'visitorToken': false }] }]
        }));

        // Mark as actively subscribed
        activeSubscriptions.current.add(channelId);

        if (!cachedMessages || cachedMessages.length === 0) {
          console.log('🌐 Fetching messages from API...');
          const response = await fetch(`${ROCKET_CONFIG.BASE_URL}/channels.messages?roomId=${channelId}`, {
            headers: {
              "X-Auth-Token": ROCKET_CONFIG.AUTH.authToken,
              "X-User-Id": ROCKET_CONFIG.AUTH.userId,
              "Content-Type": "application/json"
            }
          });
          const data = await response.json();
          const messages = data.messages || [];
          console.log('Fetched initial messages from API:', messages);
          
          await Promise.all(messages.map((msg: any) => saveMessageToDb(msg)));
          setMessages(messages);
          callback(messages);
        }
      } else {
        console.log('⚠️ WebSocket not ready for subscription:', {
          wsExists: !!wsRef.current,
          readyState: wsRef.current?.readyState,
          wsStatus,
          isConnecting: isConnecting.current
        });
      }
    } catch (error) {
      console.log('❌ Error in subscription process:', error);
    } finally {
      pendingSubscriptions.current.delete(channelId);
    }
  }, [messageCallbacks, saveMessageToDb, loadMessagesFromDb, wsStatus, connectWebSocket]);

  const unsubscribeFromChannel = useCallback((channelId: string) => {
    console.log('🔕 Unsubscribing from channel:', channelId, {
      wsStatus,
      wsExists: !!wsRef.current,
      readyState: wsRef.current?.readyState
    });
    
    // Only clear messages if we're actually changing channels
    if (activeSubscriptions.current.has(channelId)) {
      delete messageCallbacks[channelId];
      activeSubscriptions.current.delete(channelId);
      pendingSubscriptions.current.delete(channelId);
      setMessages([]);

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          msg: 'unsub',
          id: `room-messages-${channelId}`
        }));
      }
    }
  }, [messageCallbacks, wsStatus]);

  // Modify the cleanup effect to only run on full unmount
  useEffect(() => {
    const cleanup = () => {
      console.log('🧹 Cleaning up all subscriptions and WebSocket');
      
      // Clear all subscriptions first
      activeSubscriptions.current.forEach(channelId => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            msg: 'unsub',
            id: `room-messages-${channelId}`
          }));
        }
      });
      
      activeSubscriptions.current.clear();
      pendingSubscriptions.current.clear();
      
      // Only close WebSocket if we're actually unmounting
      if (wsRef.current && !isMounted.current) {
        console.log('🔴 Closing WebSocket connection (final cleanup)');
        wsRef.current.close(1000, 'Provider unmounting');
        wsRef.current = null;
      }
    };

    // Set up beforeunload handler for page close
    window.addEventListener('beforeunload', cleanup);

    return () => {
      isMounted.current = false;
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, []);

  // Add ping/pong handling to keep connection alive
  useEffect(() => {
    let pingInterval: NodeJS.Timeout;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      pingInterval = setInterval(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ msg: 'ping' }));
        }
      }, 25000); // Send ping every 25 seconds
    }

    return () => {
      if (pingInterval) {
        clearInterval(pingInterval);
      }
    };
  }, [wsStatus]);

  return (
    <RealtimeContext.Provider value={{
      messages,
      subscribeToChannel,
      unsubscribeFromChannel,
      wsStatus
    }}>
      {children}
    </RealtimeContext.Provider>
  );
};
