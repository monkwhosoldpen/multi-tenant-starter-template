import { Model } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';
import { Collection } from '@nozbe/watermelondb';
import { ToDo as ToDoType } from '../types';
import { TodoAppDatabase } from '../types/database';

interface RawToDo {
  id: string;
  title: string;
  description: string;
  done: boolean;
  created_at: number;
  updated_at: number;
  _status: 'created' | 'updated' | 'deleted';
  _changed: string;
}

export default class ToDo extends Model implements ToDoType {
  static table = 'todos';
  static modelName = 'ToDo';

  @field('title') title!: string;
  @field('description') description!: string;
  @field('done') done!: boolean;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;

  declare _raw: RawToDo;

  get titleValue(): string {
    const value = this._raw.title;
    console.log('📖 [ToDo] Getting title:', {
      id: this.id,
      value,
      _raw: this._raw
    });
    return value || '';
  }

  get descriptionValue(): string {
    const value = this._raw.description;
    console.log('📖 [ToDo] Getting description:', {
      id: this.id,
      value,
      _raw: this._raw
    });
    return value || '';
  }

  get doneValue(): boolean {
    const value = this._raw.done;
    console.log('📖 [ToDo] Getting done status:', {
      id: this.id,
      value,
      _raw: this._raw
    });
    return value || false;
  }

  async toggleCheck(database: TodoAppDatabase): Promise<void> {
    console.log('🔄 [ToDo] Toggling check:', {
      id: this.id,
      currentDone: this.doneValue,
      _raw: this._raw
    });

    await this.update(() => {
      this._raw.done = !this._raw.done;
      console.log('✏️ [ToDo] Updated done value:', {
        id: this.id,
        newDone: this._raw.done,
        _raw: this._raw
      });
    });
  }

  static async createTodo(
    collection: Collection<ToDo>,
    title: string,
    description: string
  ): Promise<ToDo> {
    console.log('📝 [ToDo] Creating todo:', {
      title,
      description,
      collection: collection.table
    });

    const todo = await collection.create((todo: ToDo) => {
      todo._raw.title = title;
      todo._raw.description = description;
      todo._raw.done = false;
      console.log('🏗️ [ToDo] Setting initial values:', {
        title: todo._raw.title,
        description: todo._raw.description,
        done: todo._raw.done,
        _raw: todo._raw
      });
    });

    console.log('✨ [ToDo] Created todo:', {
      id: todo.id,
      title: todo.titleValue,
      description: todo.descriptionValue,
      done: todo.doneValue,
      _raw: todo._raw
    });
    return todo;
  }
} 