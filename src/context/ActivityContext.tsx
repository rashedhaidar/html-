import React, { createContext } from 'react';
    import { Activity } from '../types/activity';

    interface ActivityContextType {
      activities: Activity[];
      addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
      toggleTodo: (id: string) => void;
      deleteTodo: (id: string) => void;
      updateTodo: (id: string, updates: Partial<Activity>) => void;
    }

    export const ActivityContext = createContext<ActivityContextType | undefined>(undefined);
