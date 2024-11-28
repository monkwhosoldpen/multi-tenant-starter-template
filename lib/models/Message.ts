import { Model } from '@nozbe/watermelondb';

export class Message extends Model {
  static table = 'messages';
  static associations = {};

  // Define getters for each field
  get _id() {
    return this.getField('_id');
  }

  get msg() {
    return this.getField('msg');
  }

  get rid() {
    return this.getField('rid');
  }

  get userId() {
    return this.getField('user_id');
  }

  get username() {
    return this.getField('username');
  }

  get userName() {
    return this.getField('user_name');
  }

  get createdAt() {
    return this.getField('created_at');
  }

  get updatedAt() {
    return this.getField('updated_at');
  }

  // Helper method to get field value
  private getField(fieldName: string) {
    return this.valueOf(fieldName);
  }
} 