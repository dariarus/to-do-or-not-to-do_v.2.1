import '@testing-library/jest-dom';
import { describe, expect, it, vi } from "vitest";
import { runInAction } from "mobx";

import mainStore from "../../src/stores";
import { getAllMethods } from "../../src/utils/functions";
import { SortingParameters, SortingTasksFieldParameter } from "../../src/services/types/state";

export const spyAllFunctions = (obj: any) => {
  getAllMethods(obj).forEach((key) => {
    if (key != "constructor") {
      vi.spyOn(obj, key);
    }
  });
};

describe("Work of sorting options store", () => {
  beforeAll(() => {
    spyAllFunctions(mainStore.sortOptions)
  });

  beforeEach(() => {
    runInAction(() => {
      mainStore.sortOptions.reset();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  })

  it("should sort array by names", () => {
    // arrange
    const taskCreationDate = new Date();
    const tasksArray = [
      {
        id: '1',
        name: 'Первая тестовая задача',
        description: 'Описание тестовой задачи',
        isImportant: false,
        isDone: false,
        createDate: taskCreationDate,
        closeDate: null,
      },
      {
        id: '2',
        name: 'Вторая тестовая задача',
        description: 'Описание тестовой задачи',
        isImportant: true,
        isDone: false,
        createDate: taskCreationDate,
        closeDate: null,
      },
      {
        id: '3',
        name: 'Важная тестовая задача',
        description: 'Описание тестовой задачи',
        isImportant: true,
        isDone: false,
        createDate: taskCreationDate,
        closeDate: null,
      },
    ];

    // act
    mainStore.sortOptions.sortByNames(tasksArray, SortingParameters.ASCENDING);

    // assert
    expect(mainStore.sortOptions.sortByNames).toBeCalledTimes(1);
    expect(mainStore.sortOptions.sortByField).toBe(SortingTasksFieldParameter.NAME);
    expect(mainStore.sortOptions.sortOrder).toBe(SortingParameters.ASCENDING);
    expect(tasksArray[0].name).toBe('Важная тестовая задача');
    expect(tasksArray[1].name).toBe('Вторая тестовая задача');
    expect(tasksArray[2].name).toBe('Первая тестовая задача');
  });

  it("should sort array by importance", () => {
    // arrange
    const taskCreationDate = new Date();
    const tasksArray = [
      {
        id: '1',
        name: 'Первая тестовая задача',
        description: 'Описание тестовой задачи',
        isImportant: false,
        isDone: false,
        createDate: taskCreationDate,
        closeDate: null,
      },
      {
        id: '2',
        name: 'Вторая тестовая задача',
        description: 'Описание тестовой задачи',
        isImportant: true,
        isDone: false,
        createDate: taskCreationDate,
        closeDate: null,
      },
      {
        id: '3',
        name: 'Третья тестовая задача',
        description: 'Описание тестовой задачи',
        isImportant: false,
        isDone: false,
        createDate: taskCreationDate,
        closeDate: null,
      },
    ];

    // act
    mainStore.sortOptions.sortByImportance(tasksArray, SortingParameters.DESCENDING);

    // assert
    expect(mainStore.sortOptions.sortByImportance).toBeCalledTimes(1);
    expect(mainStore.sortOptions.sortByField).toBe(SortingTasksFieldParameter.IMPORTANCE);
    expect(mainStore.sortOptions.sortOrder).toBe(SortingParameters.DESCENDING);
    expect(tasksArray[0].isImportant).toBe(false);
    expect(tasksArray[0].name).toBe('Первая тестовая задача');
    expect(tasksArray[1].isImportant).toBe(false);
    expect(tasksArray[1].name).toBe('Третья тестовая задача');
    expect(tasksArray[2].isImportant).toBe(true);
    expect(tasksArray[2].name).toBe('Вторая тестовая задача');
  });

  it("should sort array by date", () => {
    // arrange
    const firstTaskCreationDate = new Date('2024-11-04T19:21:41.111Z');
    const firstTaskCloseDate = new Date('2024-11-04T19:38:05.111Z');
    const secondTaskCreationDate = new Date('2024-11-04T19:35:03.111Z');
    const thirdTaskCreationDate = new Date('2024-11-04T19:45:55.111Z');
    const thirdTaskCloseDate = new Date('2024-11-04T19:51:08.111Z');
    const tasksArray = [
      {
        id: '1',
        name: 'Первая тестовая задача',
        description: 'Описание тестовой задачи',
        isImportant: true,
        isDone: true,
        createDate: firstTaskCreationDate,
        closeDate: firstTaskCloseDate,
      },
      {
        id: '2',
        name: 'Вторая тестовая задача',
        description: 'Описание тестовой задачи',
        isImportant: true,
        isDone: false,
        createDate: secondTaskCreationDate,
        closeDate: null,
      },
      {
        id: '3',
        name: 'Третья тестовая задача',
        description: 'Описание тестовой задачи',
        isImportant: false,
        isDone: true,
        createDate: thirdTaskCreationDate,
        closeDate: thirdTaskCloseDate,
      },
    ];

    // act
    mainStore.sortOptions.sortByDate(tasksArray, SortingParameters.ASCENDING);

    // assert
    expect(mainStore.sortOptions.sortByDate).toBeCalledTimes(1);
    expect(mainStore.sortOptions.sortByField).toBe(SortingTasksFieldParameter.DATE);
    expect(mainStore.sortOptions.sortOrder).toBe(SortingParameters.ASCENDING);
    expect(tasksArray[0].id).toBe('3');
    expect(tasksArray[0].closeDate).toBe(thirdTaskCloseDate);
    expect(tasksArray[1].id).toBe('2');
    expect(tasksArray[1].createDate).toBe(secondTaskCreationDate);
    expect(tasksArray[2].id).toBe('1');
    expect(tasksArray[2].closeDate).toBe(firstTaskCloseDate);
  });
});