import {ChangeEvent} from 'react';

export type TTask = {
  id: string,
  name: string,
  description: string | undefined,
  isImportant: boolean,
  isDone: boolean,
  createDate?: Date,
  closeDate?: Date | null
}

export type TTaskItem = TTask & {
  index: number,
  onMoveTask: (dragIndex: number, hoverIndex: number) => void
}

export type TRadioButton = {
  label: string,
  value: string,
  isChecked: boolean,
  onClickRadio: (event: ChangeEvent<HTMLInputElement>) => void
}

export type TTaskInputs = {
  isPopupInput: boolean,
  taskNameValue: string,
  taskDescriptionValue: string | undefined,
  isDisabled?: boolean,
  isStatusCheckboxChecked?: boolean,
  setTaskNameValue: (e: ChangeEvent<HTMLInputElement>) => void,
  setTaskStatus: () => void,
  setTaskDescriptionValue: (e: ChangeEvent<HTMLTextAreaElement>) => void,
}

export type TIsDoneCheckbox = {
  type: 'isDone' | 'isImportant',
  checked: boolean,
  onChange: () => void,
  labelId?: string,
}

export type TTooltip = {
  tooltipStyles: string,
  description: string,
}

export type TSortOptionRadio = {
  id: string,
  isChecked: boolean,
  label: string,
  inputName: string,
  onClickRadio: () => void,
}