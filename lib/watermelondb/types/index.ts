import { Model } from '@nozbe/watermelondb';
import ToDo from '../models/ToDo';

export type { ToDo };

export interface ToDoModel extends Model {
  title: string;
  description: string;
  done: boolean;
  createdAt: number;
  updatedAt: number;
  titleValue: string;
  descriptionValue: string;
  doneValue: boolean;
}

export * from './database'; 