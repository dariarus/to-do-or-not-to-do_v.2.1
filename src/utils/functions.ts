import {TTask} from '../services/types/props';

export const generateUniqueId = (): string => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const loadTasksFromLocalStorage = (): TTask[] => {
  const savedArray: TTask[] = JSON.parse(localStorage.getItem('tasksArray') || '[]');
  savedArray.forEach((task) => {
    if (task.createDate) {
      // (task.createDate as any) as string - сначала as any, т.к. компилятор считает task.createDate датой и не может прочитать из этого
      // свойства строку, которой оно на самом деле является после извлечение из localStorage
      const createDateString = (task.createDate as any) as string;
      task.createDate = new Date(createDateString);
    }
    if (task.closeDate) {
      const closeDateString = (task.closeDate as any) as string;
      task.closeDate = new Date(closeDateString);
    }
  })
  return savedArray;
}

