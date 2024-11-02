import React, { FunctionComponent, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { observer } from "mobx-react-lite";

import tasksListStyles from './tasks-list.module.css';

import { TaskItem } from "../task-item/task-item";
import mainStore from "../../stores";

export const TasksList: FunctionComponent = observer(() => {
  const handleOnMoveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    /* Если модифицировать напрямую mainStore (например, писать mainStore.tasks.showingTasksArray[dragIndex] = hoverItem),
    то возникает предупреждение "[MobX] Since strict-mode is enabled,
    changing (observed) observable values without using an action is not allowed. Tried to modify: Tasks@1.fullTasksArray"
    Поэтому применено копирование состояния и запись обновленного массива обратно в mainStore*/
    const updatedShowingArray = [...mainStore.tasks.showingTasksArray];

    const dragItem = updatedShowingArray[dragIndex]
    const hoverItem = updatedShowingArray[hoverIndex]

    updatedShowingArray[dragIndex] = hoverItem;
    updatedShowingArray[hoverIndex] = dragItem;

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

  return (
    <div className={tasksListStyles['tasks-list-wrap']}>
      {
        mainStore.tasks.showingTasksArray && mainStore.tasks.showingTasksArray.length > 0
          ? <DndProvider backend={HTML5Backend}>
            <ul className={tasksListStyles['tasks-list']}>
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
          : <p className={tasksListStyles['tasks-list__stub-text']}>Нет задач</p>
      }
    </div>
  )
});
