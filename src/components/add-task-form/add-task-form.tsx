import React, {ChangeEvent, MouseEvent, FunctionComponent, useState, FormEvent} from 'react';
import {observer} from 'mobx-react-lite';

import addTaskFormStyles from './add-task-form.module.css';

import mainStore from '../../stores';

import {IInputsValuesState} from '../../services/types/state';

import {TaskInputs} from '../task-inputs/task-inputs';

import {inputsValuesInitialState} from '../../utils/constants';
import {generateUniqueId} from '../../utils/functions';

export const AddTaskForm: FunctionComponent = observer(() => {
  const [inputsValues, setInputsValues] = useState<IInputsValuesState>(inputsValuesInitialState);

  const createDate = new Date();

  return (
    <form className={addTaskFormStyles.form}
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
          }}
    >
      <TaskInputs
        isPopupInput={false}
        taskNameValue={inputsValues.textInputValue}
        taskDescriptionValue={inputsValues.textAreaValue}
        isDisabled={inputsValues.textInputValue === ''}
        isStatusCheckboxChecked={inputsValues.isImportant}
        setTaskNameValue={(e: ChangeEvent<HTMLInputElement>) => {
          setInputsValues({
            ...inputsValues,
            textInputValue: e.target.value
          })
        }}
        setTaskStatus={() => {
          setInputsValues({
            ...inputsValues,
            isImportant: !inputsValues.isImportant
          })
        }}
        setTaskDescriptionValue={(e: ChangeEvent<HTMLTextAreaElement>) => {
          setInputsValues({
            ...inputsValues,
            textAreaValue: e.target.value
          })
        }}/>
      <button type="submit"
              className={addTaskFormStyles.button}
              disabled={inputsValues.textInputValue === ''}
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                mainStore.tasks.addNewTask({
                  id: generateUniqueId(),
                  name: inputsValues.textInputValue,
                  description: inputsValues.textAreaValue ? inputsValues.textAreaValue : undefined,
                  isImportant: inputsValues.isImportant,
                  isDone: false,
                  createDate: createDate,
                  closeDate: null
                  // closeDate: undefined
                });
                setInputsValues(inputsValuesInitialState);
                mainStore.tasks.setShowingTasksArray();
              }}
      >
        Добавить<br/>задачу
      </button>
    </form>
  )
})