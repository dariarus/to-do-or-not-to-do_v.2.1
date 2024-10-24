import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Accordion } from "../../src/components/accordion/accordion";

describe('Work of radio-buttons in Accordion', () => {
  it('renders radio buttons in Accordion with correct labels', () => {
    render(<Accordion isActive={true}/>);

    const notSortOptionInputs = screen.getAllByLabelText('Не сортировать');
    const newFirstOptionInput = screen.getByLabelText('Сначала новые');

    expect(notSortOptionInputs).toHaveLength(2);
    expect(screen.getByLabelText('А → Я')).toBeInTheDocument();
    expect(screen.getByLabelText('Я → А')).toBeInTheDocument();
    expect(screen.getByLabelText('Сначала важные')).toBeInTheDocument();
    expect(screen.getByLabelText('Сначала неважные')).toBeInTheDocument();
    expect(newFirstOptionInput).toBeInTheDocument();
    expect(screen.getByLabelText('Сначала старые')).toBeInTheDocument();

    expect(notSortOptionInputs[0]).toBeChecked();
    expect(notSortOptionInputs[1]).toBeChecked();
    expect(newFirstOptionInput).toBeChecked();
  });

  it('selects the correct option when clicked ascending option sorting by names', () => {
    render(<Accordion isActive={true}/>);

    const notSortOptionInputs = screen.getAllByLabelText('Не сортировать') as HTMLInputElement[];
    const ascendingAlphabetOrderOptionInput = screen.getByLabelText('А → Я') as HTMLInputElement;
    const descendingAlphabetOrderOptionInput = screen.getByLabelText('Я → А') as HTMLInputElement;

    // arrange
    expect(notSortOptionInputs[0].checked).toBe(true);
    expect(ascendingAlphabetOrderOptionInput.checked).toBe(false);
    expect(descendingAlphabetOrderOptionInput.checked).toBe(false);

    // act
    fireEvent.click(ascendingAlphabetOrderOptionInput);

    // assert
    expect(notSortOptionInputs[0].checked).toBe(false);
    expect(ascendingAlphabetOrderOptionInput.checked).toBe(true);
    expect(descendingAlphabetOrderOptionInput.checked).toBe(false);
  });

  it('selects the correct option when clicked descending option sorting by names', () => {
    render(<Accordion isActive={true}/>);

    const notSortOptionInputs = screen.getAllByLabelText('Не сортировать') as HTMLInputElement[];
    const ascendingAlphabetOrderOptionInput = screen.getByLabelText('А → Я') as HTMLInputElement;
    const descendingAlphabetOrderOptionInput = screen.getByLabelText('Я → А') as HTMLInputElement;

    // arrange
    expect(notSortOptionInputs[0].checked).toBe(true);
    expect(ascendingAlphabetOrderOptionInput.checked).toBe(false);
    expect(descendingAlphabetOrderOptionInput.checked).toBe(false);

    // act
    fireEvent.click(descendingAlphabetOrderOptionInput);

    // assert
    expect(notSortOptionInputs[0].checked).toBe(false);
    expect(ascendingAlphabetOrderOptionInput.checked).toBe(false);
    expect(descendingAlphabetOrderOptionInput.checked).toBe(true);
  });

  it('selects the correct option when clicked ascending option sorting by importance', () => {
    render(<Accordion isActive={true}/>);

    const notSortOptionInputs = screen.getAllByLabelText('Не сортировать') as HTMLInputElement[];
    const importantFirstOptionInput = screen.getByLabelText('Сначала важные') as HTMLInputElement;
    const notImportantFirstOptionInput = screen.getByLabelText('Сначала неважные') as HTMLInputElement;

    // arrange
    expect(notSortOptionInputs[1].checked).toBe(true);
    expect(importantFirstOptionInput.checked).toBe(false);
    expect(notImportantFirstOptionInput.checked).toBe(false);

    // act
    fireEvent.click(importantFirstOptionInput);

    // assert
    expect(notSortOptionInputs[1].checked).toBe(false);
    expect(importantFirstOptionInput.checked).toBe(true);
    expect(notImportantFirstOptionInput.checked).toBe(false);
  });

  it('selects the correct option when clicked descending option sorting by importance', () => {
    render(<Accordion isActive={true}/>);

    const notSortOptionInputs = screen.getAllByLabelText('Не сортировать') as HTMLInputElement[];
    const importantFirstOptionInput = screen.getByLabelText('Сначала важные') as HTMLInputElement;
    const notImportantFirstOptionInput = screen.getByLabelText('Сначала неважные') as HTMLInputElement;

    // arrange
    expect(notSortOptionInputs[1].checked).toBe(true);
    expect(importantFirstOptionInput.checked).toBe(false);
    expect(notImportantFirstOptionInput.checked).toBe(false);

    // act
    fireEvent.click(notImportantFirstOptionInput);

    // assert
    expect(notSortOptionInputs[1].checked).toBe(false);
    expect(importantFirstOptionInput.checked).toBe(false);
    expect(notImportantFirstOptionInput.checked).toBe(true);
  });

  it('selects the correct option when clicked ascending option sorting by date', () => {
    render(<Accordion isActive={true}/>);

    const newFirstOptionInput = screen.getByLabelText('Сначала новые') as HTMLInputElement;
    const oldFirstOptionInput = screen.getByLabelText('Сначала старые') as HTMLInputElement;

    // arrange
    expect(newFirstOptionInput.checked).toBe(true);
    expect(oldFirstOptionInput.checked).toBe(false);

    // act
    fireEvent.click(oldFirstOptionInput);

    // assert
    expect(newFirstOptionInput.checked).toBe(false);
    expect(oldFirstOptionInput.checked).toBe(true);
  });
});