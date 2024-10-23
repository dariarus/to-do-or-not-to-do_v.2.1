import {FunctionComponent} from 'react';

import radioButtonStyles from './radio-button.module.css';

import {TRadioButton} from '../../services/types/props';

export const RadioButton: FunctionComponent<TRadioButton> = (props) => {
  return (
    <>
      <input type="radio"
             id={props.value}
             name="radio"
             value={props.value}
             checked={props.isChecked}
             className={radioButtonStyles.input}
             onChange={props.onClickRadio}
      />
      <label htmlFor={props.value} className={radioButtonStyles['input__label']}>{props.label}</label>
    </>
  )
}