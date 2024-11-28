import { Model } from '@nozbe/watermelondb';

export class Channel extends Model {
  static table = 'channels';
  static associations = {
    messages: { type: 'has_many', foreignKey: 'channel_id' }
  };

  // Define fields
  static fields = {
    name: 'string',
    type: 'string',
    username: 'string',
    description: 'string?',
    created_at: 'number',
    updated_at: 'number'
  };

  // Getters
  get name() {
    return this.getField('name');
  }

  get type() {
    return this.getField('type');
  }

  get username() {
    return this.getField('username');
  }

  get description() {
    return this.getField('description');
  }

  get createdAt() {
    return this.getField('created_at');
  }

  get updatedAt() {
    return this.getField('updated_at');
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
} 