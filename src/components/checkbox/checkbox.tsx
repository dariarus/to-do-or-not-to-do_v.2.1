import React, {FunctionComponent} from 'react';

import checkboxStyles from './checkbox.module.css';

import {TIsDoneCheckbox} from '../../services/types/props';

export const Checkbox: FunctionComponent<TIsDoneCheckbox> = (props) => {
  return (
    <input type="checkbox"
           id={props.labelId}
           checked={props.checked}
           className={props.type === 'isDone'
             ? `${checkboxStyles.checkbox} ${checkboxStyles['checkbox_type_is-done']}`
             : `${checkboxStyles.checkbox} ${checkboxStyles['checkbox_type_is-important']}`}
           onChange={props.onChange}
    />
  )
}