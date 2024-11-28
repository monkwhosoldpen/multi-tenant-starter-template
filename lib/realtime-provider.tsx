'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Database, Q } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { Message } from './models/Message';
import schema from './models/schema';
import { createTable, addColumns } from '@nozbe/watermelondb/Schema/migrations'

// Initialize database with LokiJS adapter
const adapter = new LokiJSAdapter({
  schema,
  // For now, we'll skip migrations since we're just starting
  migrations: undefined,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  dbName: 'messagesDB',
  experimentalUseIncrementalIndexedDB: true,
});

const database = new Database({
  adapter,
  modelClasses: [Message],
});

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
  subscribeToChannel: (channelId: string, callback: (message: RocketMessage | RocketMessage[]) => void) => () => void;
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

export const RealtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<RocketMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [messageCallbacks] = useState<{ [channelId: string]: (message: RocketMessage | RocketMessage[]) => void }>({});

  // Add function to save message to WatermelonDB
  const saveMessageToDb = useCallback(async (message: RocketMessage) => {
    try {
      await database.write(async () => {
        const messageCollection = database.get<Message>('messages');
        await messageCollection.create(record => ({
          _id: message._id,
          msg: message.msg,
          rid: message.rid,
          user_id: message.u._id,
          username: message.u.username,
          user_name: message.u.name,
          created_at: new Date(message.ts).getTime(),
          updated_at: new Date(message._updatedAt).getTime()
        }));
      });
    } catch (error) {
      console.error('Error saving message to local DB:', error);
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    if (ws) return;

    console.log('Connecting to Rocket.Chat WebSocket...');
    const socket = new WebSocket(ROCKET_CONFIG.WS_URL);
    setWsStatus('connecting');

    socket.onopen = () => {
      console.log('WebSocket connected');
      setWsStatus('connected');

      // Connect
      socket.send(JSON.stringify({
        msg: 'connect',
        version: '1',
        support: ['1']
      }));

      // Login
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
      
      if (data.msg === 'changed' && data.collection === 'stream-room-messages') {
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

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setWsStatus('disconnected');
      setWs(null);
      setTimeout(connectWebSocket, 5000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(socket);
  }, [ws, saveMessageToDb, messageCallbacks]);

  // Add function to load messages from WatermelonDB
  const loadMessagesFromDb = useCallback(async (channelId: string) => {
    try {
      const messageCollection = database.get<Message>('messages');
      const messages = await messageCollection
        .query(Q.where('rid', channelId))
        .fetch();

      return messages.map(msg => ({
        _id: msg._id,
        msg: msg.msg,
        ts: new Date(msg.createdAt).toISOString(),
        u: {
          _id: msg.userId,
          username: msg.username,
          name: msg.userName
        },
        rid: msg.rid,
        _updatedAt: new Date(msg.updatedAt).toISOString(),
        attachments: [],
        reactions: {}
      }));
    } catch (error) {
      console.error('Error loading messages from DB:', error);
      return null;
    }
  }, []);

  const subscribeToChannel = useCallback(async (channelId: string, callback: (message: RocketMessage | RocketMessage[]) => void) => {
    console.log(`Subscribing to Rocket.Chat channel: ${channelId}`);
    messageCallbacks[channelId] = callback;

    // First try to load from local DB
    const cachedMessages = await loadMessagesFromDb(channelId);
    if (cachedMessages && cachedMessages.length > 0) {
      console.log('Using cached messages from DB');
      setMessages(cachedMessages);
      callback(cachedMessages);
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      // Subscribe to new messages
      ws.send(JSON.stringify({
        msg: 'sub',
        id: `room-messages-${channelId}`,
        name: 'stream-room-messages',
        params: [
          channelId,
          {
            useCollection: false,
            args: [{ 'visitorToken': false }]
          }
        ]
      }));

      // Only fetch from API if we don't have cached data
      if (!cachedMessages || cachedMessages.length === 0) {
        try {
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
          
          // Save messages to WatermelonDB
          await Promise.all(messages.map(msg => saveMessageToDb(msg)));
          
          setMessages(messages);
          callback(messages);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
          callback([]);
        }
      }
    }
  }, [ws, messageCallbacks, saveMessageToDb, loadMessagesFromDb]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket, ws]);

  const unsubscribeFromChannel = useCallback((channelId: string) => {
    delete messageCallbacks[channelId];
    setMessages([]); // Clear messages when unsubscribing
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        msg: 'unsub',
        id: `room-messages-${channelId}`
      }));
    }
  }, [ws, messageCallbacks]);

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
