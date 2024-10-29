import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { SearchForm } from "../../src/components/search-form/search-form";
import mainStore from "../../src/stores";

describe('Work of SearchForm', () => {
  it('renders the search form', () => {
    render(<SearchForm/>);

    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Название или описание задачи')).toBeInTheDocument();
  });

  it('updates the input value when typing', () => {
    // arrange
    const {container} = render(<SearchForm/>);
    const input = screen.getByPlaceholderText('Название или описание задачи');

    // act
    fireEvent.change(input, {target: {value: 'Текст для поиска'}});

    // assert
    expect(input).toHaveValue('Текст для поиска');
    expect(screen.getByRole('button')).toBeInTheDocument();

    const resetButton = container.querySelector('button[type="reset"]');
    expect(resetButton).toBeInTheDocument();
  });

  it('calls search handlers when input changes', () => {
    // arrange
    render(<SearchForm/>);

    const onSetSearchValueMock = vi.spyOn(mainStore.tasks, 'setTaskNameFilterValue');
    const onShowSearchResultsMock = vi.spyOn(mainStore.tasks, 'setShowingTasksArray');

    const input = screen.getByPlaceholderText('Название или описание задачи');

    // act
    fireEvent.change(input, {target: {value: 'Текст для поиска'}});
    // assert
    expect(onSetSearchValueMock).toHaveBeenCalledWith('Текст для поиска');
    expect(onShowSearchResultsMock).toHaveBeenCalled();

    // act
    fireEvent.change(input, {target: {value: 'Другой текст для поиска'}});
    // assert
    expect(onSetSearchValueMock).toHaveBeenCalledWith('Другой текст для поиска');
    expect(onShowSearchResultsMock).toHaveBeenCalled();

    onSetSearchValueMock.mockRestore();
    onShowSearchResultsMock.mockRestore();
  });

  it('resets form after click reset button', () => {
    // arrange
    const {container} = render(<SearchForm/>);

    const onSetSearchValueMock = vi.spyOn(mainStore.tasks, 'setTaskNameFilterValue');
    const onShowSearchResultsMock = vi.spyOn(mainStore.tasks, 'setShowingTasksArray');

    const input = screen.getByPlaceholderText('Название или описание задачи');

    // act
    fireEvent.change(input, {target: {value: 'Текст для поиска'}});

    const resetButton = container.querySelector('button[type="reset"]') as HTMLButtonElement;
    fireEvent.click(resetButton);

    // assert
    expect(onSetSearchValueMock).toHaveBeenCalledWith('');
    expect(onShowSearchResultsMock).toHaveBeenCalled();

    onSetSearchValueMock.mockRestore();
    onShowSearchResultsMock.mockRestore();
  });
});