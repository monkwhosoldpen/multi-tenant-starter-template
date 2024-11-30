import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const todoSchema = tableSchema({
  name: 'todos',
  columns: [
    { name: 'title', type: 'string' as const },
    { name: 'description', type: 'string' as const },
    { name: 'done', type: 'boolean' as const },
    { name: 'created_at', type: 'number' as const },
    { name: 'updated_at', type: 'number' as const },
  ],
});

export default appSchema({
  version: 1,
  tables: [todoSchema],
}); 