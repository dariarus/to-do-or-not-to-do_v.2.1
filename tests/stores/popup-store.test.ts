import '@testing-library/jest-dom';
import { vi, describe, it, expect } from "vitest";
import { runInAction } from "mobx";

import mainStore from "../../src/stores";
import { getAllMethods } from "../../src/utils/functions";

export const spyAllFunctions = (obj: any) => {
  getAllMethods(obj).forEach((key) => {
    if (key != "constructor") {
      vi.spyOn(obj, key);
    }
  });
};

describe("Work of tasks store", () => {
  beforeAll(() => {
    spyAllFunctions(mainStore.popup)
  });

  beforeEach(() => {
    runInAction(() => {
      mainStore.popup.setPopupIsClosed();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  })

  it("should trigger open popup with given task", () => {
    // arrange
    const openedTask = {
      id: '1',
      name: 'Тестовая задача',
      description: 'Описание тестовой задачи',
      isImportant: true,
      isDone: false,
    };

    // act
    mainStore.popup.setPopupIsOpened(openedTask.id, openedTask.name, openedTask.description, openedTask.isDone, openedTask.isImportant);

    // assert
    expect(mainStore.popup.setPopupIsOpened).toBeCalledTimes(1);
    expect(mainStore.popup.isOpened).toBe(true);
    expect(mainStore.popup.openedTask).toStrictEqual(openedTask);
  });

  it("should trigger close popup", () => {
    // arrange
    runInAction(() => {
      mainStore.popup.isOpened = true;
      mainStore.popup.openedTask = {
        id: '1',
        name: 'Тестовая задача',
        description: 'Описание тестовой задачи',
        isImportant: true,
        isDone: false,
      };
    });

    // act
    mainStore.popup.setPopupIsClosed();

    // assert
    expect(mainStore.popup.setPopupIsClosed).toBeCalledTimes(2); // setPopupIsClosed используется в т.ч. 1 раз для очистки состояния в beforeEach
    expect(mainStore.popup.isOpened).toBe(false);
    expect(mainStore.popup.openedTask.id).toBe('');
    expect(mainStore.popup.openedTask.name).toBe('');
    expect(mainStore.popup.openedTask.description).toBe(undefined);
    expect(mainStore.popup.openedTask.isDone).toBe(false);
    expect(mainStore.popup.openedTask.isImportant).toBe(false);
  });
});