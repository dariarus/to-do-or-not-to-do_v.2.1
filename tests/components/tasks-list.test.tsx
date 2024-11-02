import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { TasksList } from "../../src/components/tasks-list/tasks-list";
import mainStore from "../../src/stores";

describe('Work of TasksList', () => {
  it('should render a tasks list', () => {
    const taskCreationDate = new Date();
    mainStore.tasks.showingTasksArray = [
      {
        id: '1',
        name: 'Тестовая задача-1',
        description: 'Описание тестовой задачи-1',
        isImportant: true,
        isDone: false,
        createDate: taskCreationDate,
        closeDate: null,
      },
      {
        id: '2',
        name: 'Тестовая задача-2',
        description: 'Описание тестовой задачи-2',
        isImportant: false,
        isDone: true,
        createDate: taskCreationDate,
        closeDate: taskCreationDate,
      },
    ]

    render(<TasksList/>);

    const taskItems = screen.getAllByTestId('task-item');
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(taskItems).toHaveLength(2);
    expect(checkboxes).toHaveLength(4);
    expect(taskItems[0].textContent).toContain('Тестовая задача-1');
    expect(taskItems[0].textContent).toContain('Описание тестовой задачи-1');
    expect(taskItems[1].textContent).toContain('Тестовая задача-2');
    expect(taskItems[1].textContent).toContain('Описание тестовой задачи-2');
    expect(checkboxes[0].checked).toBe(false);
    expect(checkboxes[1].checked).toBe(true);
    expect(checkboxes[2].checked).toBe(true);
    expect(checkboxes[3].checked).toBe(false);
  });

  it('should change tasks array after click on checkbox', () => {
    const taskCreationDate = new Date();
    mainStore.tasks.showingTasksArray = [
      {
        id: '1',
        name: 'Тестовая задача-1',
        description: 'Описание тестовой задачи-1',
        isImportant: true,
        isDone: false,
        createDate: taskCreationDate,
        closeDate: null,
      },
    ]

    render(<TasksList/>)

    const taskItem = screen.getByTestId('task-item');

    const checkboxes = taskItem.querySelectorAll('input[type="checkbox"]');
    const isDoneCheckbox = checkboxes[0] as HTMLInputElement;
    const isImportantCheckbox = checkboxes[1] as HTMLInputElement;

    fireEvent.click(isDoneCheckbox);
    fireEvent.click(isImportantCheckbox);

    expect(isDoneCheckbox.checked).toBe(true);
    expect(isImportantCheckbox.checked).toBe(false)
  });

  it('should add task after triggering add task function', async () => {
    const taskCreationDate = new Date();
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

    mainStore.tasks.showingTasksArray = mainStore.tasks.fullTasksArray;

    const newTaskMock = {
      id: '2',
      name: 'Тестовая задача-2',
      description: 'Описание тестовой задачи-2',
      isImportant: false,
      isDone: true,
      createDate: taskCreationDate,
      closeDate: taskCreationDate,
    };

    render(<TasksList/>);
    await act(() => {
      mainStore.tasks.addNewTask(newTaskMock);
    });

    expect(mainStore.tasks.fullTasksArray.length).toBe(2);

    const taskItems = screen.getAllByTestId('task-item');
    expect(taskItems).toHaveLength(2);
    expect(taskItems[0].textContent).toContain('Тестовая задача-2');
    expect(taskItems[0].textContent).toContain('Описание тестовой задачи-2');
  });

  it('should delete task after click on delete button', () => {
    const deleteTaskMock = vi.spyOn(mainStore.tasks, 'deleteTask');

    const taskCreationDate = new Date();
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
      {
        id: '2',
        name: 'Тестовая задача-2',
        description: 'Описание тестовой задачи-2',
        isImportant: false,
        isDone: true,
        createDate: taskCreationDate,
        closeDate: taskCreationDate,
      },
    ];

    mainStore.tasks.showingTasksArray = mainStore.tasks.fullTasksArray;

    render(<TasksList/>);

    const deleteButtons = screen.getAllByTestId('delete task');
    const deleteFirstTaskButton = deleteButtons[0];

    fireEvent.click(deleteFirstTaskButton);

    expect(deleteTaskMock).toBeCalledWith('1');
    expect(mainStore.tasks.fullTasksArray.length).toBe(1);

    deleteTaskMock.mockRestore();
  });

  it('should trigger popup opening after click on edit button', () => {
    const onOpenPopupMock = vi.spyOn(mainStore.popup, 'setPopupIsOpened');

    const taskCreationDate = new Date();
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

    render(<TasksList/>);

    const editButton = screen.getByTestId('edit task');

    fireEvent.click(editButton);

    expect(onOpenPopupMock).toBeCalledTimes(1);

    onOpenPopupMock.mockRestore();
  });
})