import { Model } from '@nozbe/watermelondb';

export class Message extends Model {
  static table = 'messages';
  static associations = {
    channels: { type: 'belongs_to', key: 'channel_id' }
  };

  getValue(key: string): any {
    return (this as any)[key];
  }

  setValue(key: string, value: any): void {
    (this as any)[key] = value;
  }

  get msg(): string {
    return this.getValue('msg');
  }

  get rid(): string {
    return this.getValue('rid');
  }

  get userId(): string {
    return this.getValue('user_id');
  }

  get username(): string {
    return this.getValue('username');
  }

  get userName(): string {
    return this.getValue('user_name');
  }

  get channelId(): string {
    return this.getValue('channel_id');
  }

  get createdAt(): number {
    return this.getValue('created_at');
  }

  get updatedAt(): number {
    return this.getValue('updated_at');
  }

  prepareUpdate(changes: Partial<{
    msg: string;
    rid: string;
    user_id: string;
    username: string;
    user_name: string;
    channel_id: string;
    created_at: number;
    updated_at: number;
  }>): void {
    Object.entries(changes).forEach(([key, value]) => {
      this.setValue(key, value);
    });
  }
} 