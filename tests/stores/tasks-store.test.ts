import '@testing-library/jest-dom';
import { vi, describe, it, expect } from "vitest";

import { mockTasksStore } from "../../__mocks__/mockTasksStore";
import { TTask } from "../../src/services/types/props";
import { TaskCompletion } from "../../src/services/types/state";

describe("Work of tasks store", () => {
  beforeEach(() => {
    mockTasksStore.reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

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
    mockTasksStore.setFullTasksArrayMock(refreshedTasksArray);

    // assert
    expect(mockTasksStore.fullTasksArray).toHaveLength(1);
    expect(mockTasksStore.fullTasksArray).toBe(refreshedTasksArray);
  });

  it("should add new task to the array", () => {
    // arrange
    const taskCreationDate = new Date();
    mockTasksStore.fullTasksArray = [
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
    mockTasksStore.addNewTaskMock(newTask);

    // assert
    expect(mockTasksStore.fullTasksArray).toHaveLength(2);
    expect(mockTasksStore.fullTasksArray.some((task: TTask) => task.id === '2'
      && task.name === 'Тестовая задача-2'
      && task.description === 'Описание тестовой задачи-2'
      && task.isImportant === true)).toBe(true);
    expect(mockTasksStore.fullTasksArray[0]).toBe(newTask);
  });

  it('should set task completion filter value', () => {
    // arrange
    const completionFilterValue = TaskCompletion.DONE;

    // act
    mockTasksStore.setTaskCompletionFilterValueMock(completionFilterValue);

    // assert
    expect(mockTasksStore.taskCompletionFilterValue).toBe(completionFilterValue);
  });

  it('should set task name filter value', () => {
    // arrange
    const value = 'Задача';

    // act
    mockTasksStore.setTaskNameFilterValueMock(value);

    // assert
    expect(mockTasksStore.taskNameFilterValue).toBe(value);
  });

  it('should set showing tasks array', () => {
    // arrange
    const taskCreationDate = new Date();
    const taskClosingDate = new Date();
    mockTasksStore.fullTasksArray = [
      {
        id: '1',
        name: 'Тестовая задача-1',
        description: 'Описание тестовой задачи-1',
        isImportant: false,
        isDone: true,
        createDate: taskCreationDate,
        closeDate: taskClosingDate,
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
    mockTasksStore.taskCompletionFilterValue = TaskCompletion.DONE;
    mockTasksStore.taskNameFilterValue = 'задача-1';

    // act
    mockTasksStore.setShowingTasksArrayMock();

    // assert
    expect(mockTasksStore.showingTasksArray.length).toBe(1);
    expect(mockTasksStore.showingTasksArray.some((task: TTask) => task.id === '1'
      && task.name === 'Тестовая задача-1'
      && task.description === 'Описание тестовой задачи-1'
      && task.isDone === true)).toBe(true);
  });

  it('should change task importance status', () => {
    // arrange
    const taskCreationDate = new Date();
    const taskClosingDate = new Date();
    mockTasksStore.fullTasksArray = [
      {
        id: '1',
        name: 'Тестовая задача-1',
        description: 'Описание тестовой задачи-1',
        isImportant: false,
        isDone: true,
        createDate: taskCreationDate,
        closeDate: taskClosingDate,
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

    // act
    mockTasksStore.changeTaskStatusMock('1');

    // assert
    expect(mockTasksStore.showingTasksArray.some((task: TTask) => task.id === '1'
      && task.name === 'Тестовая задача-1'
      && task.description === 'Описание тестовой задачи-1'
      && task.isImportant === true)).toBe(true);
  });

  it('should change task completion status', () => {
    // arragnge
    const taskCreationDate = new Date();
    const taskClosingDate = new Date();
    mockTasksStore.fullTasksArray = [
      {
        id: '1',
        name: 'Тестовая задача-1',
        description: 'Описание тестовой задачи-1',
        isImportant: false,
        isDone: true,
        createDate: taskCreationDate,
        closeDate: taskClosingDate,
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

    // act
    mockTasksStore.changeTaskIsDoneMock('1');

    // assert
    expect(mockTasksStore.showingTasksArray.some((task: TTask) => task.id === '1'
      && task.name === 'Тестовая задача-1'
      && task.description === 'Описание тестовой задачи-1'
      && task.isDone === false
      && task.closeDate === null)).toBe(true);
  });

  it('should edit task', () => {
    // arrange
    const taskCreationDate = new Date();
    const taskClosingDate = new Date();
    mockTasksStore.fullTasksArray = [
      {
        id: '1',
        name: 'Тестовая задача-1',
        description: 'Описание тестовой задачи-1',
        isImportant: false,
        isDone: true,
        createDate: taskCreationDate,
        closeDate: taskClosingDate,
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

    // act
    mockTasksStore.editTaskMock('1', 'Другая тестовая задача', undefined, false, true);

    // assert
    expect(mockTasksStore.showingTasksArray.some((task: TTask) => task.id === '1'
      && task.name === 'Другая тестовая задача'
      && task.description === undefined
      && task.isDone === false
      && task.closeDate === null
      && task.isImportant === true)).toBe(true);
  });

  it('should delete task from the array', () => {
    // arrange
    const taskCreationDate = new Date();
    const taskClosingDate = new Date();
    mockTasksStore.fullTasksArray = [
      {
        id: '1',
        name: 'Тестовая задача-1',
        description: 'Описание тестовой задачи-1',
        isImportant: false,
        isDone: true,
        createDate: taskCreationDate,
        closeDate: taskClosingDate,
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

    // act
    mockTasksStore.deleteTaskMock('2');

    // assert
    expect(mockTasksStore.fullTasksArray.length).toBe(1);
    expect(mockTasksStore.showingTasksArray.some((task: TTask) => task.id === '2'
      && task.name === 'Тестовая задача-2'
      && task.description === 'Описание тестовой задачи-2')).toBe(false);
  });
});