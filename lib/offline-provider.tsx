'use client';

import { createContext, useContext, ReactNode, useCallback } from "react";
import { Database, Q } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { Message } from './models/Message';
import schema from './models/schema';

// Initialize database with LokiJS adapter
const adapter = new LokiJSAdapter({
  schema,
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

type OfflineContextType = {
  saveMessageToDb: (message: RocketMessage) => Promise<void>;
  loadMessagesFromDb: (channelId: string) => Promise<RocketMessage[] | null>;
};

const OfflineContext = createContext<OfflineContextType | null>(null);

export const useOfflineContext = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOfflineContext must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  return (
    <OfflineContext.Provider value={{
      saveMessageToDb,
      loadMessagesFromDb,
    }}>
      {children}
    </OfflineContext.Provider>
  );
}; 