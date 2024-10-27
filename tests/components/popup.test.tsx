import '@testing-library/jest-dom';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Popup } from "../../src/components/popup/popup";
import mainStore from "../../src/stores";

describe('Work of inputs in Popup', () => {
  beforeAll(() => {
    const portalElement = document.createElement('div');
    portalElement.id = 'popup';
    portalElement.setAttribute('data-testid', 'popup');
    document.body.appendChild(portalElement);
  });

  afterEach(cleanup);

  it('should correctly render popup with prefilled inputs', () => {
    mainStore.popup.openedTask.name = 'Тестовая задача';
    mainStore.popup.openedTask.description = 'Описание тестовой задачи';
    mainStore.popup.openedTask.isDone = false;
    mainStore.popup.openedTask.isImportant = true;

    render(<Popup/>)

    const taskNameInput = screen.getByPlaceholderText('Задача');
    const taskDescriptionInput = screen.getByPlaceholderText('Описание (опционально)');
    const isDoneCheckbox = screen.getByLabelText('Задача выполнена') as HTMLInputElement;
    const importanceCheckbox = screen.getByLabelText('Важная') as HTMLInputElement;

    expect(screen.getByTestId('popup')).toBeInTheDocument();
    expect(taskNameInput).toHaveValue('Тестовая задача');
    expect(taskDescriptionInput).toHaveValue('Описание тестовой задачи');
    expect(isDoneCheckbox.checked).toBe(false);
    expect(importanceCheckbox.checked).toBe(true);
  });

  it('should send form after fields change and submit Save', () => {
    // arrange
    const editTaskMock = vi.spyOn(mainStore.tasks, 'editTask');

    mainStore.popup.openedTask.id = '1';
    mainStore.popup.openedTask.name = 'Тестовая задача';
    mainStore.popup.openedTask.description = 'Описание тестовой задачи';
    mainStore.popup.openedTask.isDone = false;
    mainStore.popup.openedTask.isImportant = true;

    render(<Popup/>)

    const taskNameInput = screen.getByPlaceholderText('Задача');
    const taskDescriptionInput = screen.getByPlaceholderText('Описание (опционально)');
    const isDoneCheckbox = screen.getByLabelText('Важная') as HTMLInputElement;
    const importanceCheckbox = screen.getByLabelText('Задача выполнена') as HTMLInputElement;
    const saveTaskButton = screen.getByRole('button', {name: 'Сохранить'});

    // act
    fireEvent.change(taskNameInput, {target: {value: 'Вторая тестовая задача'}});
    fireEvent.change(taskDescriptionInput, {target: {value: 'Описание второй тестовой задачи'}});
    fireEvent.click(isDoneCheckbox);
    fireEvent.click(importanceCheckbox);
    fireEvent.click(saveTaskButton);

    // assert
    expect(editTaskMock).toHaveBeenCalledTimes(1);
    expect(editTaskMock).toHaveBeenCalledWith(
      '1',
      'Вторая тестовая задача',
      'Описание второй тестовой задачи',
      true,
      false
    );

    editTaskMock.mockRestore();
  });

  it('should do nothing after submit Cancel', () => {
    // arrange
    const editTaskMock = vi.spyOn(mainStore.tasks, 'editTask');

    mainStore.popup.openedTask.id = '1';
    mainStore.popup.openedTask.name = 'Тестовая задача';
    mainStore.popup.openedTask.description = 'Описание тестовой задачи';
    mainStore.popup.openedTask.isDone = false;
    mainStore.popup.openedTask.isImportant = true;

    render(<Popup/>)

    const taskNameInput = screen.getByPlaceholderText('Задача');
    const taskDescriptionInput = screen.getByPlaceholderText('Описание (опционально)');
    const isDoneCheckbox = screen.getByLabelText('Важная') as HTMLInputElement;
    const importanceCheckbox = screen.getByLabelText('Задача выполнена') as HTMLInputElement;
    const cancelTaskButton = screen.getByRole('button', {name: 'Отменить'});

    // act
    fireEvent.change(taskNameInput, {target: {value: 'Вторая тестовая задача'}});
    fireEvent.change(taskDescriptionInput, {target: {value: 'Описание второй тестовой задачи'}});
    fireEvent.click(isDoneCheckbox);
    fireEvent.click(importanceCheckbox);
    fireEvent.click(cancelTaskButton);

    // assert
    expect(editTaskMock).toHaveBeenCalledTimes(0);

    editTaskMock.mockRestore();
  });
})