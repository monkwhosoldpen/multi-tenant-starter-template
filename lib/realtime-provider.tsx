'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { MessageType, UserType, ChannelType, ReactionType } from './models/schema';

// Define base types for realtime events
interface RealtimeEventHandlers {
  onMessageReceived: (callback: (message: MessageType) => void) => () => void;
  onMessageUpdated: (callback: (message: MessageType) => void) => () => void;
  onMessageDeleted: (callback: (messageId: string) => void) => () => void;
  onUserStatusChanged: (callback: (user: UserType) => void) => () => void;
  onUserTyping: (callback: (channelId: string, user: UserType) => void) => () => void;
  onChannelUpdated: (callback: (channel: ChannelType) => void) => () => void;
  onReactionAdded: (callback: (reaction: ReactionType) => void) => () => void;
  onReactionRemoved: (callback: (reaction: ReactionType) => void) => () => void;
}

interface RealtimeContextType extends RealtimeEventHandlers {
  messages: MessageType[];
  wsStatus: 'connecting' | 'connected' | 'disconnected';
  subscribeToChannel: (channelId: string, callback: (message: MessageType | MessageType[]) => void) => void;
  unsubscribeFromChannel: (channelId: string) => void;
  subscribeToAllChannels: (channelIds: string[]) => void;
  setSelectedChannelId: (channelId: string | null) => void;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export const useRealtimeContext = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtimeContext must be used within a RealtimeProvider');
  }
  return context;
};

export const RealtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  // Event listener refs
  const messageListeners = useRef(new Set<(message: MessageType) => void>());
  const messageUpdateListeners = useRef(new Set<(message: MessageType) => void>());
  const messageDeleteListeners = useRef(new Set<(messageId: string) => void>());
  const userStatusListeners = useRef(new Set<(user: UserType) => void>());
  const userTypingListeners = useRef(new Set<(channelId: string, user: UserType) => void>());
  const channelUpdateListeners = useRef(new Set<(channel: ChannelType) => void>());
  const reactionAddListeners = useRef(new Set<(reaction: ReactionType) => void>());
  const reactionRemoveListeners = useRef(new Set<(reaction: ReactionType) => void>());

  // Event handlers
  const handleNewMessage = useCallback((payload: MessageType) => {
    messageListeners.current.forEach(listener => listener(payload));
  }, []);

  const handleMessageUpdate = useCallback((payload: MessageType) => {
    messageUpdateListeners.current.forEach(listener => listener(payload));
  }, []);

  const handleUserStatus = useCallback((payload: { user: UserType }) => {
    userStatusListeners.current.forEach(listener => listener(payload.user));
  }, []);

  const handleReactionAdd = useCallback((payload: ReactionType) => {
    reactionAddListeners.current.forEach(listener => listener(payload));
  }, []);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'message.new':
        handleNewMessage(data.payload);
        break;
      case 'message.update':
        handleMessageUpdate(data.payload);
        break;
      case 'user.status':
        handleUserStatus(data.payload);
        break;
      case 'reaction.add':
        handleReactionAdd(data.payload);
        break;
    }
  }, [handleNewMessage, handleMessageUpdate, handleUserStatus, handleReactionAdd]);

  // Event registration functions
  const onMessageReceived = useCallback((callback: (message: MessageType) => void) => {
    messageListeners.current.add(callback);
    return () => messageListeners.current.delete(callback);
  }, []);

  const onMessageUpdated = useCallback((callback: (message: MessageType) => void) => {
    messageUpdateListeners.current.add(callback);
    return () => messageUpdateListeners.current.delete(callback);
  }, []);

  const onMessageDeleted = useCallback((callback: (messageId: string) => void) => {
    messageDeleteListeners.current.add(callback);
    return () => messageDeleteListeners.current.delete(callback);
  }, []);

  const onUserStatusChanged = useCallback((callback: (user: UserType) => void) => {
    userStatusListeners.current.add(callback);
    return () => userStatusListeners.current.delete(callback);
  }, []);

  const onUserTyping = useCallback((callback: (channelId: string, user: UserType) => void) => {
    userTypingListeners.current.add(callback);
    return () => userTypingListeners.current.delete(callback);
  }, []);

  const onChannelUpdated = useCallback((callback: (channel: ChannelType) => void) => {
    channelUpdateListeners.current.add(callback);
    return () => channelUpdateListeners.current.delete(callback);
  }, []);

  const onReactionAdded = useCallback((callback: (reaction: ReactionType) => void) => {
    reactionAddListeners.current.add(callback);
    return () => reactionAddListeners.current.delete(callback);
  }, []);

  const onReactionRemoved = useCallback((callback: (reaction: ReactionType) => void) => {
    reactionRemoveListeners.current.add(callback);
    return () => reactionRemoveListeners.current.delete(callback);
  }, []);

  // Existing WebSocket functions
  const subscribeToChannel = useCallback((channelId: string, callback: (message: MessageType | MessageType[]) => void) => {
    // Implementation
  }, []);

  const unsubscribeFromChannel = useCallback((channelId: string) => {
    // Implementation
  }, []);

  const subscribeToAllChannels = useCallback((channelIds: string[]) => {
    // Implementation
  }, []);

  const contextValue: RealtimeContextType = {
    messages,
    wsStatus,
    subscribeToChannel,
    unsubscribeFromChannel,
    subscribeToAllChannels,
    setSelectedChannelId,
    setMessages,
    onMessageReceived,
    onMessageUpdated,
    onMessageDeleted,
    onUserStatusChanged,
    onUserTyping,
    onChannelUpdated,
    onReactionAdded,
    onReactionRemoved,
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
};
