'use client';

import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from "react";
import { Database, Q } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { Message } from './models/Message';
import { Channel } from './models/Channel';
import schema from './models/schema';
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
import Loki from 'lokijs';

// Define migrations
const migrations = schemaMigrations({
  migrations: [
    // We'll add migrations here when needed
  ]
});

// Initialize database with LokiJS adapter
const adapter = new LokiJSAdapter({
  schema,
  migrations,
  useWebWorker: false,
  useIncrementalIndexedDB: false,
  dbName: 'messagesDB',
  onSetUpError: error => {
    console.error('[🍉] Database setup error:', error);
  },
  onQuotaExceededError: (error) => {
    console.error('[🍉] Storage quota exceeded:', error);
  },
  lokiOptions: {
    autosave: true,
    autosaveInterval: 5000,
    verbose: true
  }
});

let database: Database | null = null;

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

type OfflineContextType = {
  saveMessageToDb: (message: RocketMessage) => Promise<void>;
  loadMessagesFromDb: (channelId: string) => Promise<RocketMessage[] | null>;
  saveChannelToDb: (channel: any) => Promise<void>;
  loadChannelsFromDb: (username: string) => Promise<any[]>;
  clearChannelsFromDb: (username: string) => Promise<void>;
};

export const OfflineContext = createContext<OfflineContextType | null>(null);

export const useOfflineContext = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOfflineContext must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  // Initialize database
  useEffect(() => {
    const initDB = async () => {
      try {
        if (!database) {
          // Initialize the database first
          database = new Database({
            adapter,
            modelClasses: [Message, Channel]
          });

          // Test database connection with a simple write operation
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
          // Close adapter connections if they exist
          if (adapter && typeof (adapter as any).close === 'function') {
            (adapter as any).close();
          }
          
          // Reset database reference
          database = null;
          
          console.log('[🍉] Database connections closed');
        } catch (error) {
          console.error('[🍉] Error closing database connections:', error);
        }
      }
    };
  }, []);

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

  const loadMessagesFromDb = useCallback(async (channelId: string) => {
    console.log('🔍 Loading messages for channel ID:', channelId);
    try {
      const messageCollection = database.get<Message>('messages');
      const messages = await messageCollection
        .query(Q.where('rid', channelId))
        .fetch();

      console.log('📦 Messages loaded:', messages);
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

  const saveChannelToDb = async (channel: any) => {
    console.log('💾 Saving channel to local DB:', channel.name);
    
    try {
      const channelsCollection = database!.get<Channel>('channels');
      
      // Check if the channel already exists
      const existingChannels = await channelsCollection
        .query(Q.where('name', channel.name))
        .fetch();
      
      const existingChannel = existingChannels[0];
      
      await database.write(async () => {
        if (existingChannel) {
          console.log('📝 Channel already exists, updating...');
          await existingChannel.updateChannel({
            name: channel.name,
            type: channel.type,
            username: channel.username,
            description: channel.description
          });
        } else {
          console.log('📝 Creating new channel...');
          await channelsCollection.create(record => {
            Object.assign(record._raw, {
              name: channel.name,
              type: channel.type,
              username: channel.username,
              description: channel.description,
              created_at: Date.now(),
              updated_at: Date.now()
            });
          });
        }
      });
      
      console.log('✅ Channel saved successfully');
    } catch (error) {
      console.error('❌ Error saving channel to local DB:', error);
      throw error;
    }
  };

  const loadChannelsFromDb = async (username: string) => {
    try {
      if (!isReady || !database) {
        console.log('💤 Database not ready yet');
        return [];
      }

      const channelsCollection = database.get<Channel>('channels');
      
      // Add debug logging
      console.log('🔍 Querying channels for username:', username);
      
      const channels = await channelsCollection
        .query(Q.where('username', Q.eq(username)))
        .fetch();

      console.log('📦 Found channels:', channels.length);
      
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
      console.error('❌ Error loading channels from local DB:', error);
      return [];
    }
  };

  const clearChannelsFromDb = async (username: string) => {
    try {
      await database.write(async () => {
        const channelsCollection = database.get<Channel>('channels');
        const channels = await channelsCollection
          .query()
          .where('username', username)
          .fetch();
        
        await database.batch(
          ...channels.map(channel => channel.prepareDestroyPermanently())
        );
      });
      console.log('✅ Channels cleared from local DB for user:', username);
    } catch (error) {
      console.error('❌ Error clearing channels from local DB:', error);
    }
  };

  if (!isReady) {
    return <div>Loading database...</div>;
  }

  return (
    <OfflineContext.Provider value={{
      saveMessageToDb,
      loadMessagesFromDb,
      saveChannelToDb,
      loadChannelsFromDb,
      clearChannelsFromDb
    }}>
      {children}
    </OfflineContext.Provider>
  );
}; 