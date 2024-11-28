import { Model } from '@nozbe/watermelondb';
import type { SyncStatus, Associations } from '@nozbe/watermelondb/Model';

// Define the shape of the raw record
interface ChannelRaw {
  id: string;
  _status: SyncStatus;
  _changed: string;
  _id: string;
  name: string;
  type: string;
  username: string;
  description?: string;
  created_at: number;
  updated_at: number;
}

export class Channel extends Model {
  static table = 'channels';
  
  // Fix the associations type
  static associations: Associations = {
    messages: { type: 'has_many' as const, foreignKey: 'channel_id' }
  };

  // Define fields
  static fields = {
    _id: 'string',
    name: 'string',
    type: 'string',
    username: 'string',
    description: 'string?',
    created_at: 'number',
    updated_at: 'number'
  };

  // Declare _raw property with correct type
  declare _raw: {
    id: string;
    _status: SyncStatus;
    _changed: string;
    _id: string;
    name: string;
    type: string;
    username: string;
    description?: string;
    created_at: number;
    updated_at: number;
  }

  // Getters
  get _id() {
    return this._raw._id;
  }

  get name() {
    return this._raw.name;
  }

  get type() {
    return this._raw.type;
  }

  get username() {
    return this._raw.username;
  }

  get description() {
    return this._raw.description;
  }

  get createdAt() {
    return this._raw.created_at;
  }

  get updatedAt() {
    return this._raw.updated_at;
  }

  // Update method
  async updateChannel(changes: {
    name?: string;
    type?: string;
    username?: string;
    description?: string;
  }) {
    return this.update(record => {
      if (changes.name) record._raw.name = changes.name;
      if (changes.type) record._raw.type = changes.type;
      if (changes.username) record._raw.username = changes.username;
      if (changes.description) record._raw.description = changes.description;
      record._raw.updated_at = Date.now();
    });
  }

  // Prepare create method
  static prepareCreate(record: Partial<Omit<ChannelRaw, 'id' | '_status' | '_changed'>>) {
    return {
      _id: record._id || crypto.randomUUID(),
      name: record.name,
      type: record.type,
      username: record.username,
      description: record.description,
      created_at: Date.now(),
      updated_at: Date.now()
    };
  }
} 