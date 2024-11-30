"use client";

import React, { useEffect, useState } from 'react';
import { ToDo, WatermelonDBProvider } from '@/lib/watermelondb';
import { database } from '@/lib/watermelondb';
// import { ToDo } from '@/lib/watermelondb/models';
import ToDoModel from '@/lib/watermelondb/models/ToDo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

function TodoList() {
  const [todos, setTodos] = useState<ToDo[]>([]);

  useEffect(() => {
    const loadTodos = async () => {
      console.log('🔍 [Page] Starting to fetch todos...');
      const todosCollection = database.collections.get('todos');
      const allTodos = await todosCollection.query().fetch();
      console.log('📥 [Page] Fetched todos from DB:', {
        count: allTodos.length,
        todos: allTodos.map(todo => ({
          id: todo.id,
          title: todo.titleValue,
          description: todo.descriptionValue,
          done: todo.doneValue
        }))
      });
      setTodos(allTodos);
    };

    loadTodos();

    console.log('👀 [Page] Setting up DB subscription...');
    const subscription = database.collections
      .get('todos')
      .query()
      .observe()
      .subscribe({
        next: updatedTodos => {
          console.log('🔄 [Page] DB Subscription Update:', {
            count: updatedTodos.length,
            todos: updatedTodos.map(todo => ({
              id: todo.id,
              title: todo.titleValue,
              description: todo.descriptionValue,
              done: todo.doneValue
            }))
          });
          // Use a state updater function to ensure we're working with the latest state
          setTodos(currentTodos => {
            const hasChanges = updatedTodos.some((todo, i) => 
              currentTodos[i]?.id !== todo.id || 
              currentTodos[i]?.doneValue !== todo.doneValue
            );
            return hasChanges ? updatedTodos : currentTodos;
          });
        },
        error: error => {
          console.error('❌ [Page] Subscription error:', error);
        }
      });

    return () => {
      console.log('🔌 [Page] Unsubscribing from DB changes...');
      subscription.unsubscribe();
    };
  }, []);

  const addTodo = async () => {
    try {
      console.log('➕ [Page] Starting to create new todo...');
      await database.write(async () => {
        const todosCollection = database.collections.get('todos');
        const title = 'Test Todo ' + Date.now();
        const description = 'This is a test todo';
        
        console.log('📝 [Page] Creating todo with:', {
          title,
          description,
          collection: todosCollection.table
        });

        const newTodo = await ToDoModel.createTodo(todosCollection, title, description);

        console.log('💾 [Page] Created new todo:', {
          id: newTodo.id,
          title: newTodo.titleValue,
          description: newTodo.descriptionValue,
          done: newTodo.doneValue
        });
      });
    } catch (error) {
      console.error('❌ [Page] Error creating todo:', error);
    }
  };

  const toggleTodo = async (todo: ToDo) => {
    try {
      console.log('🔄 [Page] Starting to toggle todo:', {
        id: todo.id,
        currentDone: todo.doneValue
      });

      const todosCollection = database.collections.get<ToDo>('todos');
      const todoToUpdate = await todosCollection.find(todo.id);

      await database.write(async () => {
        await todoToUpdate.toggleCheck(database);
        
        console.log('✏️ [Page] Updated todo:', {
          id: todoToUpdate.id,
          title: todoToUpdate.titleValue,
          done: todoToUpdate.doneValue
        });
      });
    } catch (error) {
      console.error('❌ [Page] Error updating todo:', error);
    }
  };

  const deleteTodo = async (todo: ToDo) => {
    try {
      console.log('🗑️ [Page] Starting to delete todo:', {
        id: todo.id,
        title: todo.titleValue
      });

      await database.write(async () => {
        await todo.markAsDeleted();
        console.log('🏷️ [Page] Marked todo as deleted');
        await todo.destroyPermanently();
        console.log('♻️ [Page] Permanently destroyed todo');
      });
    } catch (error) {
      console.error('❌ [Page] Error deleting todo:', error);
    }
  };

  console.log('🎨 [Page] Rendering TodoList with:', {
    todoCount: todos.length,
    todos: todos.map(todo => ({
      id: todo.id,
      title: todo.titleValue,
      done: todo.doneValue
    }))
  });

  return (
    <div className="space-y-4">
      <Button 
        onClick={addTodo}
        className="mb-6"
      >
        Add Test Todo
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todos.map(todo => (
          <Card key={todo.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={todo.doneValue ? "line-through text-gray-500" : ""}>
                  {todo.titleValue}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={todo.doneValue}
                    onCheckedChange={() => toggleTodo(todo)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                    onClick={() => deleteTodo(todo)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {todo.descriptionValue}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function TestRoute() {
  return (
    <div className="h-[calc(100vh-5rem)] mt-20 p-4">
      <WatermelonDBProvider>
        <TodoList />
      </WatermelonDBProvider>
    </div>
  );
}
