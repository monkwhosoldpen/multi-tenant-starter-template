import { Database, Model, Collection } from '@nozbe/watermelondb';
import ToDo from '../models/ToDo';

export interface CollectionMap {
  'todos': ToDo;
}

export interface DatabaseCollections {
  get(tableName: 'todos'): Collection<ToDo>;
  map: { [tableName: string]: Collection<Model> };
}

export type TodoAppDatabase = Database & {
  collections: DatabaseCollections;
};

export type TableName = keyof CollectionMap;

export interface Schema {
  tables: {
    todos: {
      name: 'todos';
      columns: {
        title: string;
        description: string;
        done: boolean;
        created_at: number;
        updated_at: number;
      };
    };
  };
} 