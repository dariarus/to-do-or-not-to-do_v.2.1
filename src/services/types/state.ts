export interface IRadioButtonsState {
  allIsChecked: boolean,
  undoneIsChecked: boolean,
  doneIsChecked: boolean
}

export interface IInputsValuesState {
  textInputValue: string,
  textAreaValue: string | undefined,
  isImportant: boolean,
  isDone: boolean,
}

export enum TaskCompletion {
  ALL = 'all',
  UNDONE = 'undone',
  DONE = 'done'
}

export enum SortingParameters {
  ALL = 'all',
  ASCENDING = 'ascending',
  DESCENDING = 'descending'
}

export enum SortingTasksFieldParameter {
  NONE = 'none',
  NAME = 'name',
  IMPORTANCE = 'importance',
  DATE = 'date'
}