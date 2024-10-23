import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';

import {RadioButton} from "../../src/components/radio-button/radio-button";

describe('Work of RadioButton component', () => {
  it('RadioButton is rendering correctly', () => {
    const props = {
      value: 'amazingOption',
      isChecked: true,
      label: 'Amazing option',
      onClickRadio: vi.fn(),
    };

   render(<RadioButton {...props} />);

    const radioButtonInput = screen.getByLabelText('Amazing option') as HTMLInputElement;
    expect(radioButtonInput.type).toBe('radio');
    expect(radioButtonInput.checked).toBe(true);
  });

  it('onClickRadio is calling correctly by clicking on RadioButton', () => {
    const onClickRadio = vi.fn();
    const props = {
      value: 'awesomeOption',
      isChecked: false,
      label: 'Awesome option',
      onClickRadio,
    };

    render(<RadioButton {...props} />);

    const radioButtonInput = screen.getByLabelText('Awesome option');
    fireEvent.click(radioButtonInput);

    expect(onClickRadio).toHaveBeenCalledTimes(1);
  });
})
