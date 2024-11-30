import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import schema from '../models/schema';
import models from '../models';
import { TodoAppDatabase } from '../types/database';

console.log('🔧 [Database] Initializing with schema:', schema);
console.log('📚 [Database] Loading models:', models.map(m => m.table));

const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  dbName: 'todoAppDb',
});

console.log('🔌 [Database] Created adapter');

const database = new Database({
  adapter,
  modelClasses: models,
}) as TodoAppDatabase;

console.log('✅ [Database] Database initialized');

export default database; 