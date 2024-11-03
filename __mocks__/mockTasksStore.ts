import { TTask } from "../src/services/types/props";
import { TaskCompletion } from "../src/services/types/state";
import { vi } from 'vitest';
import { Tasks } from "../src/stores/tasks";

export const mockTasksStore: any & { reset: () => void } = {
  fullTasksArray: [],
  showingTasksArray: [],
  taskNameFilterValue: '',
  taskCompletionFilterValue: TaskCompletion.ALL,
  _setCompletionTaskFilterCondition: (task: TTask) => {
    switch (mockTasksStore.taskCompletionFilterValue) {
      case TaskCompletion.ALL:
        return true;
      case TaskCompletion.UNDONE:
        return !task.isDone;
      case TaskCompletion.DONE:
        return task.isDone;
    }
  },
  _setSearchTaskCondition: (task: TTask) => {
    if (!mockTasksStore.taskNameFilterValue) {
      return true;
    }
    return task.name.toLowerCase().includes(mockTasksStore.taskNameFilterValue)
      || task.description?.toLowerCase().includes(mockTasksStore.taskNameFilterValue)
  },
  setFullTasksArrayMock: vi.fn((refreshedTasksArray: TTask[]) => mockTasksStore.fullTasksArray = refreshedTasksArray),
  addNewTaskMock: vi.fn((newTask: TTask) => mockTasksStore.fullTasksArray.unshift(newTask)),
  setTaskCompletionFilterValueMock: vi.fn((value: TaskCompletion) => mockTasksStore.taskCompletionFilterValue = value),
  setTaskNameFilterValueMock: vi.fn((value: string) => mockTasksStore.taskNameFilterValue = value),
  setShowingTasksArrayMock: vi.fn(() => mockTasksStore.showingTasksArray = mockTasksStore.fullTasksArray
    .filter((task: TTask) => mockTasksStore._setCompletionTaskFilterCondition(task) && mockTasksStore._setSearchTaskCondition(task))),
  changeTaskStatusMock: vi.fn((taskId: string) => {
    if (taskId) {
      const task = mockTasksStore.fullTasksArray.find((task: TTask) => task.id === taskId);
      if (task) {
        task.isImportant = !task.isImportant;
      }
    }
    mockTasksStore.setShowingTasksArrayMock();
  }),
  changeTaskIsDoneMock: vi.fn((taskId: string) => {
    if (taskId) {
      const task = mockTasksStore.fullTasksArray.find((task: TTask) => task.id === taskId);
      if (task) {
        task.isDone = !task.isDone;
        if (task.isDone) {
          task.closeDate = new Date();
        } else {
          task.closeDate = null;
        }
      }
    }
    mockTasksStore.setShowingTasksArrayMock();
  }),
  editTaskMock: vi.fn((taskId: string, taskName: string, taskDescription: string | undefined, isDone: boolean, isImportant: boolean) => {
    if (taskId) {
      const task = mockTasksStore.fullTasksArray.find((task: TTask) => task.id === taskId);
      if (task) {
        task.name = taskName;
        task.description = taskDescription;
        task.isDone = isDone;
        task.isImportant = isImportant;

        if (task.isDone) {
          task.closeDate = new Date();
        } else {
          task.closeDate = null;
        }
      }
    }
    mockTasksStore.setShowingTasksArrayMock();
  }),
  deleteTaskMock: vi.fn((taskId: string) => {
    if (taskId) {
      const task = mockTasksStore.fullTasksArray.find((task: TTask) => task.id === taskId);
      let taskIndex = -1;
      if (task) {
        taskIndex = mockTasksStore.fullTasksArray.indexOf(task);
      }
      if (taskIndex > -1) {
        mockTasksStore.fullTasksArray.splice(taskIndex, 1);
      }
    }
    mockTasksStore.setShowingTasksArrayMock();
  }),
  reset: () => {
    mockTasksStore.fullTasksArray = [];
    mockTasksStore.showingTasksArray = [];
    mockTasksStore.taskNameFilterValue = '';
    mockTasksStore.taskCompletionFilterValue = TaskCompletion.ALL;
    mockTasksStore.setFullTasksArrayMock.mockClear();
    mockTasksStore.addNewTaskMock.mockClear();
    mockTasksStore.setTaskCompletionFilterValueMock.mockClear();
    mockTasksStore.setTaskNameFilterValueMock.mockClear();
    mockTasksStore.setShowingTasksArrayMock.mockClear();
    mockTasksStore.changeTaskStatusMock.mockClear();
    mockTasksStore.changeTaskIsDoneMock.mockClear();
    mockTasksStore.editTaskMock.mockClear();
    mockTasksStore.deleteTaskMock.mockClear();
  },
}