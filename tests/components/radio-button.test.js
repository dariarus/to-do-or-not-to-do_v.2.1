/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import {RadioButton} from '../../src/components/radio-button/radio-button';

describe('Work of RadioButton component', () => {
  it('RadioButton is rendering correctly', () => {
    const props = {
      value: 'amazingOption',
      checked: true,
      label: 'Amazing option',
      onClickRadio: jest.fn(),
    };

   render(<RadioButton {...props} />);

    const radioButtonInput = screen.getByLabelText('Amazing option');
    expect(radioButtonInput.type).toBe('radio');
    expect(radioButtonInput.checked).toBe(true);
  });

  it('onClickRadio is calling correctly by clicking on RadioButton', () => {
    const onClickRadio = jest.fn();
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
