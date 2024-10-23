import React, {FunctionComponent} from 'react';

import taskInputsStyles from './task-inputs.module.css';

import {TTaskInputs} from '../../services/types/props';
import {Tooltip} from '../tooltip/tooltip';

export const TaskInputs: FunctionComponent<TTaskInputs> = (props) => {
  return (
    <div className={taskInputsStyles['input-wrap']}>
      {
        !props.isPopupInput &&
        <>
          <input type="checkbox"
                 id="isImportant"
                 disabled={props.isDisabled}
                 checked={props.isStatusCheckboxChecked} // для сброса состояния после добавления задачи
                 className={taskInputsStyles.checkbox}
                 onChange={props.setTaskStatus}
          />
          <Tooltip tooltipStyles={taskInputsStyles.tooltip} description="Отметить задачу как важную"/>
        </>
      }
      <input type="text"
             value={props.taskNameValue}
             placeholder="Задача"
             className={taskInputsStyles['text-input']}
             onChange={props.setTaskNameValue}
      />
      <textarea value={props.taskDescriptionValue}
                placeholder="Описание (опционально)"
                disabled={props.isDisabled}
                className={taskInputsStyles['text-area']}
                style={props.isPopupInput ? {borderBottom: '1px solid rgba(171, 177, 193, .5)'} : undefined}
                onChange={props.setTaskDescriptionValue}
      />
    </div>
  )
}