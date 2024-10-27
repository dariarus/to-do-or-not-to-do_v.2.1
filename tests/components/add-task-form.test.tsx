import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { AddTaskForm } from "../../src/components/add-task-form/add-task-form";
import mainStore from "../../src/stores";

describe('Work of AddTaskForm Component', () => {
  it('should render AddTaskForm correctly', () => {
    render(<AddTaskForm/>);

    const taskNameInput = screen.getByPlaceholderText('Задача');
    const taskDescriptionInput = screen.getByPlaceholderText('Описание (опционально)');
    const importanceCheckbox = screen.getByRole('checkbox');
    const addTaskButton = screen.getByRole('button', {name: 'Добавить задачу'});

    expect(taskNameInput).toBeInTheDocument();
    expect(taskDescriptionInput).toBeInTheDocument();
    expect(importanceCheckbox).toBeInTheDocument();
    expect(addTaskButton).toBeInTheDocument();
  });

  it('should submit form after clicking button', () => {
    const submitFormMock = vi.spyOn(mainStore.tasks, 'addNewTask');
    const initialTasksLength = mainStore.tasks.fullTasksArray.length;

    render(<AddTaskForm/>);

    // arrange
    const taskNameInput = screen.getByPlaceholderText('Задача');
    const taskDescriptionInput = screen.getByPlaceholderText('Описание (опционально)');
    const importanceCheckbox = screen.getByRole('checkbox');
    const addTaskButton = screen.getByRole('button', {name: 'Добавить задачу'});

    // act
    fireEvent.change(taskNameInput, {target: {value: 'Тестовая задача'}});
    fireEvent.change(taskDescriptionInput, {target: {value: 'Очень важная тестовая задача'}});
    fireEvent.click(importanceCheckbox);
    fireEvent.click(addTaskButton);

    // assert
    expect(submitFormMock).toHaveBeenCalledTimes(1);
    expect(mainStore.tasks.fullTasksArray.some(task => task.name === 'Тестовая задача'
      && task.description === 'Очень важная тестовая задача'
      && task.isImportant === true)).toBe(true);
    expect(mainStore.tasks.fullTasksArray.length).toBe(initialTasksLength + 1);

    submitFormMock.mockRestore();
  });
});