import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'messages',
      columns: [
        { name: '_id', type: 'string' },
        { name: 'msg', type: 'string' },
        { name: 'rid', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'username', type: 'string' },
        { name: 'user_name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' }
      ]
    })
  ]
}); 