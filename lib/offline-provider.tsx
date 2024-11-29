'use client';

import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from "react";
import { Database, Q } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { Message } from './models/Message';
import { Channel } from './models/Channel';
import schema from './models/schema';
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

// Initialize database with LokiJS adapter
const adapter = new LokiJSAdapter({
  schema,
  migrations: schemaMigrations({
    migrations: []
  }),
  useWebWorker: false,
  useIncrementalIndexedDB: false,
  dbName: 'messagesDB',
  onSetUpError: error => {
    console.error('[🍉] Database setup error:', error);
  },
  onQuotaExceededError: (error) => {
    console.error('[🍉] Storage quota exceeded:', error);
  }
});

let database: Database | null = null;

// Helper function to ensure database is initialized
const ensureDatabase = () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database;
};

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
}

type OfflineContextType = {
  saveMessageToDb: (message: RocketMessage) => Promise<void>;
  loadMessagesFromDb: (channelId: string) => Promise<RocketMessage[] | null>;
  saveChannelToDb: (channel: any) => Promise<void>;
  loadChannelsFromDb: (username: string) => Promise<any[]>;
  clearChannelsFromDb: (username: string) => Promise<void>;
  isOfflineDisabled: boolean;
};

export const OfflineContext = createContext<OfflineContextType | null>(null);

export const useOfflineContext = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOfflineContext must be used within an OfflineProvider');
  }
  return context;
};

interface OfflineProviderProps {
  children: ReactNode;
  disableOffline?: boolean;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ 
  children, 
  disableOffline = true
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        if (!database) {
          database = new Database({
            adapter,
            modelClasses: [Message, Channel]
          });

          await database.write(async () => {
            console.log('[🍉] Testing database write...');
          });

          console.log('[🍉] Database initialized successfully');
          setIsReady(true);
        }
      } catch (error) {
        console.error('[🍉] Database initialization error:', error);
        setIsReady(false);
        database = null;
      }
    };

    initDB();

    return () => {
      if (database) {
        try {
          if (adapter && typeof (adapter as any).close === 'function') {
            (adapter as any).close();
          }
          database = null;
          console.log('[🍉] Database connections closed');
        } catch (error) {
          console.error('[🍉] Error closing database connections:', error);
        }
      }
    };
  }, []);

  const saveMessageToDb = useCallback(async (message: RocketMessage) => {
    if (disableOffline) return;
    try {
      const db = ensureDatabase();
      await db.write(async () => {
        const messageCollection = db.get<Message>('messages');
        await messageCollection.create(record => {
          Object.assign(record._raw, {
            _id: message._id,
            msg: message.msg,
            rid: message.rid,
            user_id: message.u._id,
            username: message.u.username,
            user_name: message.u.name,
            created_at: new Date(message.ts).getTime(),
            updated_at: new Date(message._updatedAt).getTime()
          });
        });
      });
    } catch (error) {
      console.error('Error saving message to local DB:', error);
    }
  }, [disableOffline]);

  const loadMessagesFromDb = useCallback(async (channelId: string) => {
    if (disableOffline) return null;
    try {
      const db = ensureDatabase();
      const messageCollection = db.get<Message>('messages');
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
        _updatedAt: new Date(msg.updatedAt).toISOString()
      }));
    } catch (error) {
      console.error('Error loading messages from DB:', error);
      return null;
    }
  }, [disableOffline]);

  const saveChannelToDb = useCallback(async (channel: any) => {
    if (disableOffline) return;
    try {
      const db = ensureDatabase();
      const channelsCollection = db.get<Channel>('channels');
      await db.write(async () => {
        await channelsCollection.create(record => {
          Object.assign(record._raw, {
            _id: channel._id || crypto.randomUUID(),
            name: channel.name,
            type: channel.type,
            username: channel.username,
            description: channel.description,
            created_at: Date.now(),
            updated_at: Date.now()
          });
        });
      });
    } catch (error) {
      console.error('Error saving channel to DB:', error);
      throw error;
    }
  }, [disableOffline]);

  const loadChannelsFromDb = useCallback(async (username: string) => {
    if (disableOffline) return [];
    try {
      const db = ensureDatabase();
      const channelsCollection = db.get<Channel>('channels');
      const channels = await channelsCollection
        .query(Q.where('username', username))
        .fetch();

      return channels.map(channel => ({
        _id: channel._id,
        name: channel.name,
        type: channel.type,
        username: channel.username,
        description: channel.description,
        created_at: channel.createdAt,
        updated_at: channel.updatedAt
      }));
    } catch (error) {
      console.error('Error loading channels from DB:', error);
      return [];
    }
  }, [disableOffline]);

  const clearChannelsFromDb = useCallback(async (username: string) => {
    try {
      const db = ensureDatabase();
      await db.write(async () => {
        const channelsCollection = db.get<Channel>('channels');
        const channels = await channelsCollection
          .query(Q.where('username', username))
          .fetch();
        
        await db.batch(
          ...channels.map(channel => channel.prepareDestroyPermanently())
        );
      });
    } catch (error) {
      console.error('Error clearing channels from DB:', error);
      throw error;
    }
  }, []);

  const value = {
    saveMessageToDb,
    loadMessagesFromDb,
    saveChannelToDb,
    loadChannelsFromDb,
    clearChannelsFromDb,
    isOfflineDisabled: disableOffline
  };

  return (
    <OfflineContext.Provider value={value}>
      {isReady ? children : null}
    </OfflineContext.Provider>
  );
}; 