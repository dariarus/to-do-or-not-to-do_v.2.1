import '@testing-library/jest-dom';
import { vi, describe, it, expect } from "vitest";
import { runInAction } from "mobx";

import mainStore from "../../src/stores";
import { getAllMethods } from "../../src/utils/functions";
import { TTask } from "../../src/services/types/props";
import { TaskCompletion } from "../../src/services/types/state";

export const spyAllFunctions = (obj: any) => {
  getAllMethods(obj).forEach((key) => {
    if (key != "constructor") {
      vi.spyOn(obj, key);
    }
  });
};

describe("Work of tasks store", () => {
  beforeAll(() => {
    spyAllFunctions(mainStore.tasks)
  });

  beforeEach(() => {
    runInAction(() => {
      mainStore.tasks.clearAll();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  })

  it("should refresh full tasks array", () => {
    // arrange
    const taskCreationDate = new Date();
    const refreshedTasksArray = [
      {
        id: '1',
        name: 'Тестовая задача',
        description: 'Описание тестовой задачи',
        isImportant: true,
        isDone: false,
        createDate: taskCreationDate,
        closeDate: null,
      },
    ];

    // act
    mainStore.tasks.setFullTasksArray(refreshedTasksArray);

    // assert
    expect(mainStore.tasks.setFullTasksArray).toBeCalledTimes(1);
    expect(mainStore.tasks.fullTasksArray).toHaveLength(1);
    expect(mainStore.tasks.fullTasksArray).toStrictEqual(refreshedTasksArray);
  });

  it("should add new task to the array", () => {
    // arrange
    const taskCreationDate = new Date();
    runInAction(() => {
      mainStore.tasks.fullTasksArray = [
        {
          id: '1',
          name: 'Тестовая задача-1',
          description: 'Описание тестовой задачи-1',
          isImportant: true,
          isDone: false,
          createDate: taskCreationDate,
          closeDate: null,
        },
      ];
    })

    const newTask = {
      id: '2',
      name: 'Тестовая задача-2',
      description: 'Описание тестовой задачи-2',
      isImportant: true,
      isDone: false,
      createDate: taskCreationDate,
      closeDate: null,
    }

    // act
    mainStore.tasks.addNewTask(newTask);

    // assert
    expect(mainStore.tasks.addNewTask).toBeCalledTimes(1);
    expect(mainStore.tasks.fullTasksArray).toHaveLength(2);
    expect(mainStore.tasks.fullTasksArray.some((task: TTask) => task.id === '2'
      && task.name === 'Тестовая задача-2'
      && task.description === 'Описание тестовой задачи-2'
      && task.isImportant === true)).toBe(true);
    expect(mainStore.tasks.fullTasksArray[0]).toStrictEqual(newTask);
  });

  it('should set task completion filter value', () => {
    // arrange
    const completionFilterValue = TaskCompletion.DONE;

    // act
    mainStore.tasks.setTaskCompletionFilterValue(completionFilterValue);

    // assert
    expect(mainStore.tasks.setTaskCompletionFilterValue).toBeCalledTimes(1);
    expect(mainStore.tasks.taskCompletionFilterValue).toBe(completionFilterValue);
  });

  it('should set task name filter value', () => {
    // arrange
    const value = 'Задача';

    // act
    mainStore.tasks.setTaskNameFilterValue(value);

    // assert
    expect(mainStore.tasks.setTaskNameFilterValue).toBeCalledTimes(1);
    expect(mainStore.tasks.taskNameFilterValue).toBe(value);
  });

  it('should set showing tasks array', () => {
    // arrange
    const taskCreationDate = new Date();
    const taskCloseDate = new Date();
    runInAction(() => {
      mainStore.tasks.fullTasksArray = [
        {
          id: '1',
          name: 'Тестовая задача-1',
          description: 'Описание тестовой задачи-1',
          isImportant: false,
          isDone: true,
          createDate: taskCreationDate,
          closeDate: taskCloseDate,
        },
        {
          id: '2',
          name: 'Тестовая задача-2',
          description: 'Описание тестовой задачи-2',
          isImportant: true,
          isDone: false,
          createDate: taskCreationDate,
          closeDate: null,
        }
      ];
      mainStore.tasks.taskCompletionFilterValue = TaskCompletion.DONE;
      mainStore.tasks.taskNameFilterValue = 'задача-1';
    });

    // act
    mainStore.tasks.setShowingTasksArray();

    // assert
    expect(mainStore.tasks.setShowingTasksArray).toBeCalledTimes(1);
    expect(mainStore.tasks.showingTasksArray.length).toBe(1);
    expect(mainStore.tasks.showingTasksArray.some((task: TTask) => task.id === '1'
      && task.name === 'Тестовая задача-1'
      && task.description === 'Описание тестовой задачи-1'
      && task.isDone === true)).toBe(true);
  });

  it('should change task importance status', () => {
    // arrange
    const taskCreationDate = new Date();
    const taskCloseDate = new Date();
    runInAction(() => {
      mainStore.tasks.fullTasksArray = [
        {
          id: '1',
          name: 'Тестовая задача-1',
          description: 'Описание тестовой задачи-1',
          isImportant: false,
          isDone: true,
          createDate: taskCreationDate,
          closeDate: taskCloseDate,
        },
        {
          id: '2',
          name: 'Тестовая задача-2',
          description: 'Описание тестовой задачи-2',
          isImportant: true,
          isDone: false,
          createDate: taskCreationDate,
          closeDate: null,
        }
      ];
    });

    // act
    mainStore.tasks.changeTaskStatus('1');

    // assert
    expect(mainStore.tasks.showingTasksArray.some((task: TTask) => task.id === '1'
      && task.name === 'Тестовая задача-1'
      && task.description === 'Описание тестовой задачи-1'
      && task.isImportant === true)).toBe(true);
  });

  it('should change task completion status', () => {
    // arragnge
    const taskCreationDate = new Date();
    const taskCloseDate = new Date();
    runInAction(() => {
      mainStore.tasks.fullTasksArray = [
        {
          id: '1',
          name: 'Тестовая задача-1',
          description: 'Описание тестовой задачи-1',
          isImportant: false,
          isDone: true,
          createDate: taskCreationDate,
          closeDate: taskCloseDate,
        },
        {
          id: '2',
          name: 'Тестовая задача-2',
          description: 'Описание тестовой задачи-2',
          isImportant: true,
          isDone: false,
          createDate: taskCreationDate,
          closeDate: null,
        }
      ];
    });

    // act
    mainStore.tasks.changeTaskIsDone('1');

    // assert
    expect(mainStore.tasks.changeTaskIsDone).toBeCalledTimes(1);
    expect(mainStore.tasks.showingTasksArray.some((task: TTask) => task.id === '1'
      && task.name === 'Тестовая задача-1'
      && task.description === 'Описание тестовой задачи-1'
      && task.isDone === false
      && task.closeDate === null)).toBe(true);
  });

  it('should edit task', () => {
    // arrange
    const taskCreationDate = new Date();
    const taskCloseDate = new Date();
    runInAction(() => {
      mainStore.tasks.fullTasksArray = [
        {
          id: '1',
          name: 'Тестовая задача-1',
          description: 'Описание тестовой задачи-1',
          isImportant: false,
          isDone: true,
          createDate: taskCreationDate,
          closeDate: taskCloseDate,
        },
        {
          id: '2',
          name: 'Тестовая задача-2',
          description: 'Описание тестовой задачи-2',
          isImportant: true,
          isDone: false,
          createDate: taskCreationDate,
          closeDate: null,
        }
      ];
    });

    // act
    mainStore.tasks.editTask('1', 'Другая тестовая задача', undefined, false, true);

    // assert
    expect(mainStore.tasks.editTask).toBeCalledTimes(1);
    expect(mainStore.tasks.showingTasksArray.some((task: TTask) => task.id === '1'
      && task.name === 'Другая тестовая задача'
      && task.description === undefined
      && task.isDone === false
      && task.closeDate === null
      && task.isImportant === true)).toBe(true);
  });

  it('should delete task from the array', () => {
    // arrange
    const taskCreationDate = new Date();
    const taskCloseDate = new Date();
    runInAction(() => {
      mainStore.tasks.fullTasksArray = [
        {
          id: '1',
          name: 'Тестовая задача-1',
          description: 'Описание тестовой задачи-1',
          isImportant: false,
          isDone: true,
          createDate: taskCreationDate,
          closeDate: taskCloseDate,
        },
        {
          id: '2',
          name: 'Тестовая задача-2',
          description: 'Описание тестовой задачи-2',
          isImportant: true,
          isDone: false,
          createDate: taskCreationDate,
          closeDate: null,
        }
      ];
    });

    // act
    mainStore.tasks.deleteTask('2');

    // assert
    expect(mainStore.tasks.deleteTask).toBeCalledTimes(1);
    expect(mainStore.tasks.fullTasksArray.length).toBe(1);
    expect(mainStore.tasks.showingTasksArray.some((task: TTask) => task.id === '2'
      && task.name === 'Тестовая задача-2'
      && task.description === 'Описание тестовой задачи-2')).toBe(false);
  });
});