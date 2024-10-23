import React, {FunctionComponent, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import appStyles from './app.module.css';

import {AddTaskForm} from '../add-task-form/add-task-form';
import {RadioButton} from '../radio-button/radio-button';
import {TaskItem} from '../task-item/task-item';
import {Popup} from '../popup/popup';
import {SearchForm} from '../search-form/search-form';
import {Accordion} from '../accordion/accordion';

import mainStore from '../../stores';

import {radioButtonsInitialState} from '../../utils/constants';
import {loadTasksFromLocalStorage} from '../../utils/functions';

import {IRadioButtonsState, TaskCompletion} from '../../services/types/state';

const App: FunctionComponent = observer(() => {
  const [filterRadioButtons, setFilterRadioButtons] = useState<IRadioButtonsState>(radioButtonsInitialState);
  const [accordionIsActive, setAccordionIsActive] = useState<boolean>(false);

  const handleOnMoveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    /* Перемещаем элементы в массиве mainStore.tasks.showingTasksArray, отображаемом в зависимости от выбранной сортировки задач,
    на основе его индексов */

    /* Если модифицировать напрямую mainStore (например, писать mainStore.tasks.showingTasksArray[dragIndex] = hoverItem),
    то возникает предупреждение "[MobX] Since strict-mode is enabled,
    changing (observed) observable values without using an action is not allowed. Tried to modify: Tasks@1.fullTasksArray"
    Поэтому применено копирование состояния и запись обновленного массива обратно в mainStore*/
    const updatedShowingArray = [...mainStore.tasks.showingTasksArray];

    const dragItem = updatedShowingArray[dragIndex]
    const hoverItem = updatedShowingArray[hoverIndex]

    updatedShowingArray[dragIndex] = hoverItem;
    updatedShowingArray[hoverIndex] = dragItem;

    // Перемещаем элементы в основном массиве mainStore.tasks.fullTasksArray на основе его индексов
    const updatedTasksArray = [...mainStore.tasks.fullTasksArray];

    const dragTask = updatedTasksArray.find(task => task.id === dragItem.id);
    const hoverTask = updatedTasksArray.find(task => task.id === hoverItem.id);

    if (dragTask && hoverTask) {
      const dragTaskIndex = updatedTasksArray.indexOf(dragTask);
      const hoverTaskIndex = updatedTasksArray.indexOf(hoverTask);
      updatedTasksArray[dragTaskIndex] = hoverItem;
      updatedTasksArray[hoverTaskIndex] = dragItem;
    }

    mainStore.tasks.setFullTasksArray(updatedTasksArray);
    mainStore.tasks.setShowingTasksArray();
  }, [mainStore.tasks.fullTasksArray, mainStore.tasks.showingTasksArray])

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

        {/*1). <AddTaskForm onAddTask={mainStore.tasks.addNewTask}/>
        Не работает, так как прокинута ссылка на ф-цию, без контекста.
        Т.е. в месте вызова не будет объявлена переменная this.fullTasksArray, и поэтому падает в ошибку this.fullTasksArray - undefined */}

        {/*2). <AddTaskForm onAddTask={(task) => mainStore.tasks.addNewTask(task)}/>*/}
        {/* Работает, так как прокинут контекст в сам коллбэк (task: TTask) => ...*/}

        {/*3). Но можно вообще без пропсов, а вызвать addTask прямо в месте выполнения. Тогда нет проблем с контекстом*/}
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
          <div className={appStyles['todos-board__tasks-list-wrap']}>
            {
              mainStore.tasks.showingTasksArray && mainStore.tasks.showingTasksArray.length > 0
                ? <DndProvider backend={HTML5Backend}>
                  <ul className={appStyles['todos-board__tasks-list']}>
                    {
                      mainStore.tasks.showingTasksArray.map((task, index) => (
                        <TaskItem key={task.id}
                                  id={task.id}
                                  index={index}
                                  name={task.name}
                                  description={task.description}
                                  isDone={task.isDone}
                                  isImportant={task.isImportant}
                                  createDate={task.createDate}
                                  closeDate={task.closeDate}
                                  onMoveTask={handleOnMoveTask}
                        />
                      ))
                    }
                  </ul>
                </DndProvider>
                : <p className={appStyles['stub-text']}>Нет задач</p>
            }
          </div>
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