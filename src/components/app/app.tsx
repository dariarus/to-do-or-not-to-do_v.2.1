import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import appStyles from './app.module.css';

import { AddTaskForm } from '../add-task-form/add-task-form';
import { RadioButton } from '../radio-button/radio-button';
import { TaskItem } from '../task-item/task-item';
import { Popup } from '../popup/popup';
import { SearchForm } from '../search-form/search-form';
import { Accordion } from '../accordion/accordion';

import mainStore from '../../stores';

import { radioButtonsInitialState } from '../../utils/constants';
import { loadTasksFromLocalStorage } from '../../utils/functions';

import { IRadioButtonsState, TaskCompletion } from '../../services/types/state';
import { TasksList } from "../tasks-list/tasks-list";

const App: FunctionComponent = observer(() => {
  const [filterRadioButtons, setFilterRadioButtons] = useState<IRadioButtonsState>(radioButtonsInitialState);
  const [accordionIsActive, setAccordionIsActive] = useState<boolean>(false);


  useEffect(() => {
    // Формат Date не парсится из localStorage, поэтому в createDate и closeDate находится текст вместо даты. Надо сериализовать вручную:
    const savedTasksArray = loadTasksFromLocalStorage();
    mainStore.tasks.setFullTasksArray(savedTasksArray);
  }, [])

  useEffect(() => {
    mainStore.tasks.setShowingTasksArray();
  }, [
    mainStore.tasks.fullTasksArray,
    filterRadioButtons.allIsChecked,
    filterRadioButtons.undoneIsChecked,
    filterRadioButtons.doneIsChecked
  ])

  return (
    <main className={appStyles.main}>
      <h1 className={appStyles['todos-board__heading']}>Мои задачи</h1>
      <div className={appStyles['todos-board']}>
        <AddTaskForm/>

        <div className={appStyles['todos-board__tasks-wrap']}>
          {
            mainStore.tasks.fullTasksArray.length > 0 &&
            <SearchForm/>
          }
          <div className={appStyles['radio-button-wrap']}>
            <RadioButton label="Все задачи"
                         value="all"
                         isChecked={filterRadioButtons.allIsChecked}
                         onClickRadio={() => {
                           setFilterRadioButtons({
                             allIsChecked: true,
                             undoneIsChecked: false,
                             doneIsChecked: false
                           });
                           mainStore.tasks.setTaskCompletionFilterValue(TaskCompletion.ALL)
                         }}/>
            <RadioButton label="Невыполненные"
                         value="undone"
                         isChecked={filterRadioButtons.undoneIsChecked}
                         onClickRadio={() => {
                           setFilterRadioButtons({
                             allIsChecked: false,
                             undoneIsChecked: true,
                             doneIsChecked: false
                           });
                           mainStore.tasks.setTaskCompletionFilterValue(TaskCompletion.UNDONE)
                         }}/>
            <RadioButton label="Выполненные"
                         value="done"
                         isChecked={filterRadioButtons.doneIsChecked}
                         onClickRadio={() => {
                           setFilterRadioButtons({
                             allIsChecked: false,
                             undoneIsChecked: false,
                             doneIsChecked: true
                           });
                           mainStore.tasks.setTaskCompletionFilterValue(TaskCompletion.DONE)
                         }}/>
            {
              mainStore.tasks.fullTasksArray.length > 0 &&
              <button type="button"
                      className={appStyles['radio-button-wrap__settings-button']}
                      onClick={() => setAccordionIsActive(!accordionIsActive)}
              />
            }
          </div>
          <Accordion isActive={accordionIsActive}/>
          <TasksList/>
        </div>
      </div>
      {
        mainStore.popup.isOpened &&
        <Popup/>
      }
    </main>
  );
})

export default App;