'use client';

import { createContext, useContext, ReactNode, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useRealtimeContext } from './realtime-provider';
import { useOfflineContext, OfflineContextType } from './offline-provider';
import { Q, Model, Database, Collection, ColumnName } from '@nozbe/watermelondb';
import { MessageType, UserType, ChannelType, AttachmentType, ReactionType } from './models/schema';
import { $ReadOnlyArray } from '@nozbe/watermelondb/types';
import { BehaviorSubject, Observable } from '@nozbe/watermelondb/utils/rx';
import { Unsubscribe } from '@nozbe/watermelondb/utils/subscriptions';

export interface ExtendedChannel extends ChannelType {
  msgs: number;
  _updatedAt: string;
}

interface DataContextType {
  messages: MessageType[];
  channels: ExtendedChannel[];
  selectedChannel: ExtendedChannel | null;
  selectedGoat: string;
  isLoadingChannels: boolean;
  isLoadingMessages: boolean;
  isOnlineMode: boolean;
  handleOnlineToggle: (enabled: boolean) => Promise<void>;
  setOnlineMode: (enabled: boolean) => void;
  wsStatus: 'connecting' | 'connected' | 'disconnected';
  handleChannelSelect: (channel: ExtendedChannel) => Promise<void>;
  handleOfflineToggle: (enabled: boolean) => Promise<void>;
  setSelectedGoat: (goat: string) => void;
  initializeChannels: (goatId: string) => Promise<void>;
  setOfflineDisabled: (disabled: boolean) => void;
  loadMessagesFromDb: (channelId: string) => Promise<MessageType[]>;
  saveMessageToDb: (message: MessageType) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

// Add type guards and mappers
const mapMessageFromModel = (msg: any): MessageType => ({
  _id: msg._id,
  msg: msg.msg,
  ts: msg.ts,
  u: {
    _id: msg.userId,
    username: msg.username || '',
    name: msg.name || ''
  },
  rid: msg.channelId,
  _updatedAt: msg._updatedAt
});

const mapChannelFromModel = (channel: any): ExtendedChannel => ({
  _id: channel._id,
  name: channel.name,
  rid: channel.rid || '',
  type: channel.type as ChannelType['type'],
  msgs: channel.msgs || 0,
  _updatedAt: channel._updatedAt || new Date().toISOString()
});

// Define WatermelonDB model interfaces
interface BaseModel extends Model {
  _id: string;
  _updatedAt: string;
}

interface MessageModel extends BaseModel {
  msg: string;
  ts: string;
  userId: string;
  username: string;
  name: string;
  channelId: string;
}

interface ChannelModel extends BaseModel {
  name: string;
  rid: string;
  type: string;
  msgs: number;
}

interface UserModel extends Model {
  _id: string;
  username: string;
  name: string;
  status?: string;
}

interface AttachmentModel extends Model {
  _id: string;
  type: string;
  url: string;
  name?: string;
  size?: number;
  messageId: string;
}

interface ReactionModel extends Model {
  _id: string;
  emoji: string;
  userIds: string;
  messageId: string;
}

// Add type for cached data
interface CachedData<T> {
  data: T[];
  timestamp: number;
}

interface Cache {
  messages: Map<string, CachedData<MessageType>>;
  channels: Map<string, CachedData<ExtendedChannel>>;
}

// Add database operations type
interface DatabaseOps {
  fetchFromApi: (endpoint: string, params?: Record<string, string>) => Promise<any>;
}

interface DatabaseRecord {
  _id: string;
  _updatedAt: string;
  [key: string]: any;
}

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { database } = useOfflineContext();
  const { wsStatus } = useRealtimeContext();

  // Constants
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // State declarations first
  const [state, setState] = useState({
    messages: [] as MessageType[],
    channels: [] as ExtendedChannel[],
    selectedChannel: null as ExtendedChannel | null,
    selectedGoat: "ElonMusk",
    isLoadingChannels: false,
    isLoadingMessages: false,
    isOnlineMode: true
  });

  // Cache ref
  const cache = useRef<Cache>({
    messages: new Map(),
    channels: new Map()
  });

  // Create dbOps instance
  const dbOps = useMemo<DatabaseOps>(() => ({
    fetchFromApi: async (endpoint: string, params?: Record<string, string>) => {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const url = `/api/rocket/${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      return response.json();
    }
  }), []);

  // Add message mapping utility first
  const mapMessage = useCallback((msg: any): MessageType | null => {
    if (!msg) return null;
    try {
      return {
        _id: msg._id || msg.id || '',
        msg: msg.msg || msg.content || '',
        ts: msg.ts || msg.created_at || new Date().toISOString(),
        u: {
          _id: msg.u?._id || msg.user?.id || '',
          username: msg.u?.username || msg.user?.username || '',
          name: msg.u?.name || msg.user?.name || 'Unknown User'
        },
        rid: msg.rid || msg.channel_id || '',
        _updatedAt: msg._updatedAt || msg.updated_at || new Date().toISOString()
      };
    } catch (error) {
      return null;
    }
  }, []);

  // Database functions
  const loadFromDb = useCallback(async <T extends DatabaseRecord>(
    collection: string,
    query?: any
  ): Promise<T[]> => {
    if (!database) return [];
    try {
      const dbCollection = database.get(collection);
      const dbQuery = query 
        ? dbCollection.query(query)
        : dbCollection.query();
      const results = await dbQuery.fetch();
      return results as unknown as T[];
    } catch (error) {
      return [];
    }
  }, [database]);

  const saveToDb = useCallback(async <T extends DatabaseRecord>(
    collection: string,
    data: T
  ): Promise<void> => {
    if (!database) return;
    try {
      await database.write(async () => {
        const dbCollection = database.get(collection);
        await dbCollection.create((record: any) => {
          Object.assign(record, data);
        });
      });
    } catch (error) {
    }
  }, [database]);

  // Cache operations
  const getCachedData = useCallback(<T extends MessageType | ExtendedChannel>(
    type: keyof Cache,
    key: string
  ): T[] | null => {
    const cached = cache.current[type].get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T[];
    }
    return null;
  }, []);

  const setCachedData = useCallback(<T extends MessageType | ExtendedChannel>(
    type: keyof Cache,
    key: string,
    data: T[]
  ) => {
    cache.current[type].set(key, {
      data: data as any, // Type assertion needed due to TypeScript limitation
      timestamp: Date.now()
    });
  }, []);

  // Message operations
  const saveMessageToDb = useCallback(async (message: MessageType): Promise<void> => {
    await saveToDb<DatabaseRecord>('messages', {
      _id: message._id,
      msg: message.msg,
      ts: message.ts,
      userId: message.u._id,
      username: message.u.username,
      name: message.u.name,
      channelId: message.rid,
      _updatedAt: message._updatedAt
    });
  }, [saveToDb]);

  const loadMessagesFromDb = useCallback(async (channelId: string): Promise<MessageType[]> => {
    const messages = await loadFromDb<DatabaseRecord>('messages', Q.where('channelId', channelId));
    return messages.map(msg => ({
      _id: msg._id,
      msg: msg.msg,
      ts: msg.ts,
      u: {
        _id: msg.userId,
        username: msg.username,
        name: msg.name
      },
      rid: msg.channelId,
      _updatedAt: msg._updatedAt
    }));
  }, [loadFromDb]);

  // Channel operations
  const saveChannelToDb = useCallback(async (channel: ExtendedChannel): Promise<void> => {
    await saveToDb<DatabaseRecord>('channels', {
      _id: channel._id,
      name: channel.name,
      rid: channel.rid,
      type: channel.type,
      msgs: channel.msgs,
      _updatedAt: channel._updatedAt
    });
  }, [saveToDb]);

  // Initialize channels
  const initializeChannels = useCallback(async (goatId: string) => {
    setState(prev => ({ ...prev, isLoadingChannels: true }));

    try {
      // Try cache first
      const cachedChannels = getCachedData<ExtendedChannel>('channels', goatId);
      if (cachedChannels) {
        setState(prev => ({
          ...prev,
          channels: cachedChannels,
          isLoadingChannels: false
        }));
        return;
      }

      // Try database
      const dbChannels = await loadFromDb<ExtendedChannel>('channels');
      if (dbChannels.length && state.isOnlineMode) {
        setState(prev => ({
          ...prev,
          channels: dbChannels,
          isLoadingChannels: false
        }));
        return;
      }

      // Fetch from API
      const data = await dbOps.fetchFromApi('channels', { username: goatId });
      const channels = data.channels.map((channel: ExtendedChannel) => ({
        _id: channel._id,
        name: channel.name,
        rid: channel.rid || '',
        type: channel.type || 'group',
        msgs: channel.msgs || 0,
        _updatedAt: channel._updatedAt || new Date().toISOString()
      }));

      setCachedData('channels', goatId, channels);

      // Save to database in background
      if (channels.length) {
        Promise.all(channels.map((channel: ExtendedChannel) => saveToDb('channels', channel)))
          .catch(error => console.error('Failed to cache channels:', error));
      }

      setState(prev => ({
        ...prev,
        channels,
        isLoadingChannels: false
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        channels: [],
        isLoadingChannels: false
      }));
    }
  }, [state.isOnlineMode, dbOps, getCachedData, setCachedData, loadFromDb, saveToDb]);

  // Channel selection
  const handleChannelSelect = useCallback(async (channel: ExtendedChannel) => {
    if (state.selectedChannel?._id === channel._id) {
      return;
    }

    setState(prev => ({
      ...prev,
      selectedChannel: channel,
      isLoadingMessages: true
    }));

    try {
      // Try cache first
      const cachedMessages = getCachedData<MessageType>('messages', channel._id);
      if (cachedMessages) {
        setState(prev => ({
          ...prev,
          messages: cachedMessages,
          isLoadingMessages: false
        }));
        return;
      }

      // Try database
      const dbMessages = await loadMessagesFromDb(channel._id);
      if (dbMessages.length && state.isOnlineMode) {
        setState(prev => ({
          ...prev,
          messages: dbMessages,
          isLoadingMessages: false
        }));
        return;
      }

      // Fetch from API
      const data = await dbOps.fetchFromApi('messages', { channelId: channel._id });
      const messages = data.messages
        .map((msg: any) => mapMessage(msg))
        .filter((msg: MessageType | null): msg is MessageType => msg !== null);
      
      setCachedData('messages', channel._id, messages);
      
      // Save to database in background
      if (messages.length) {
        Promise.all(messages.map((msg: MessageType) => saveMessageToDb(msg)))
          .catch(error => console.error('Failed to cache messages:', error));
      }

      setState(prev => ({
        ...prev,
        messages,
        isLoadingMessages: false
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        messages: [],
        isLoadingMessages: false
      }));
    }
  }, [
    state.selectedChannel,
    state.isOnlineMode,
    dbOps,
    mapMessage,
    getCachedData,
    setCachedData,
    loadMessagesFromDb,
    saveMessageToDb
  ]);

  // Offline mode toggle
  const debouncedOfflineToggle = useCallback(
    debounce(async (enabled: boolean) => {
      
      try {
        if (enabled) {
          await Promise.all([
            ...state.messages.map(msg => saveMessageToDb(msg)),
            ...state.channels.map(channel => saveChannelToDb(channel))
          ]);
        }

        setState(prev => ({
          ...prev,
          isOnlineMode: !enabled
        }));

        if (state.selectedChannel) {
          await handleChannelSelect(state.selectedChannel);
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          isOnlineMode: enabled
        }));
      }
    }, 300),
    [state, saveMessageToDb, saveChannelToDb]
  );

  // Online/Offline mode toggle
  const debouncedOnlineToggle = useCallback(
    debounce(async (enabled: boolean) => {
      
      try {
        if (!enabled) {
          await Promise.all([
            ...state.messages.map(msg => saveMessageToDb(msg)),
            ...state.channels.map(channel => saveChannelToDb(channel))
          ]);
        }

        setState(prev => ({
          ...prev,
          isOnlineMode: enabled
        }));

        if (state.selectedChannel) {
          await handleChannelSelect(state.selectedChannel);
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          isOnlineMode: !enabled
        }));
      }
    }, 300),
    [state, saveMessageToDb, saveChannelToDb]
  );

  // Add cleanup for debounced function
  useEffect(() => {
    return () => {
      debouncedOfflineToggle.cancel();
      debouncedOnlineToggle.cancel();
    };
  }, [debouncedOfflineToggle, debouncedOnlineToggle]);

  // Context value with all required properties
  const contextValue = useMemo<DataContextType>(() => ({
    ...state,
    handleOfflineToggle: debouncedOfflineToggle,
    setOfflineDisabled: (disabled: boolean) => 
      setState(prev => ({ ...prev, isOnlineMode: disabled })),
    handleOnlineToggle: debouncedOnlineToggle,
    setOnlineMode: (enabled: boolean) => 
      setState(prev => ({ ...prev, isOnlineMode: enabled })),
    wsStatus,
    loadMessagesFromDb,
    saveMessageToDb,
    handleChannelSelect,
    setSelectedGoat: (goat: string) => setState(prev => ({ ...prev, selectedGoat: goat })),
    initializeChannels,
    setMessages: (messages: MessageType[]) => setState(prev => ({ ...prev, messages })),
    setSelectedChannel: (channel: ExtendedChannel | null) => 
      setState(prev => ({ ...prev, selectedChannel: channel }))
  }), [
    state,
    debouncedOfflineToggle,
    debouncedOnlineToggle,
    wsStatus,
    loadMessagesFromDb,
    saveMessageToDb,
    handleChannelSelect,
    initializeChannels
  ]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Add debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout;

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    clearTimeout(timeout);
  };

  return debounced as T & { cancel: () => void };
}