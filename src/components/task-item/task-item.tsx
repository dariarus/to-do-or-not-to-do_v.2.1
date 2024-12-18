import React, { FunctionComponent, useCallback, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { Identifier, XYCoord } from 'dnd-core';

import taskItemStyles from './task-item.module.css';

import { Checkbox } from '../checkbox/checkbox';

import mainStore from '../../stores';

import { TTaskItem } from '../../services/types/props';
import { generateUniqueId } from "../../utils/functions";

export const TaskItem: FunctionComponent<TTaskItem> = observer((props) => {
  const ref = useRef<HTMLLIElement>(null);

  const [{isDragging}, dragRef] = useDrag({
    type: 'task',
    item: () => {
      return {index: props.index}
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  })

  const [{handlerId}, dropRef] = useDrop<TTaskItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'task',
    collect(monitor: DropTargetMonitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover: (item: TTaskItem, monitor: DropTargetMonitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index
      const hoverIndex = props.index

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverActualY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return;

      props.onMoveTask(dragIndex, hoverIndex);

      item.index = hoverIndex;
    }
  })

  dragRef(dropRef(ref));

  const checkboxUniqueId = generateUniqueId();

  const handleOnChangeIsDone = useCallback(() => {
    mainStore.tasks.changeTaskIsDone(props.id);
  }, [props.isDone])

  return (
    <li ref={ref}
        data-handler-id={handlerId}
        data-testid="task-item"
        className={isDragging ? `${taskItemStyles.task} ${taskItemStyles['task_is-dragging']}` : `${taskItemStyles.task}`}>
      {
        props.isDone && props.closeDate
          ? <p className={
            `${taskItemStyles['task__text']} 
        ${taskItemStyles['task__text_paragraph']} 
        ${taskItemStyles['task__date']}`
          }>Выполнена {props.closeDate?.toLocaleDateString('ru-RU')}</p>
          : props.createDate &&
          <p className={
            `${taskItemStyles['task__text']} 
        ${taskItemStyles['task__text_paragraph']} 
        ${taskItemStyles['task__date']}`
          }>Добавлена {props.createDate?.toLocaleDateString('ru-RU')}</p>
      }
      <div className={taskItemStyles['task__item-wrap']}>
        <Checkbox
          key={generateUniqueId()}
          type="isDone"
          checked={props.isDone}
          onChange={handleOnChangeIsDone}/>
        {
          props.isDone
            ? <div className={`${taskItemStyles['task__item']} ${taskItemStyles['task__item_is-done']}`}>
              <p
                className={`${taskItemStyles['task__text']} ${taskItemStyles['task__text_heading']} ${taskItemStyles['task__text_crossed']}`}>
                {props.name}
              </p>
              {
                props.description &&
                <p
                  className={`${taskItemStyles['task__text']} ${taskItemStyles['task__text_paragraph']} ${taskItemStyles['task__text_crossed']}`}>
                  {props.description}
                </p>
              }
            </div>
            : <div className={taskItemStyles['task__item']}>
              <p className={`${taskItemStyles['task__text']} ${taskItemStyles['task__text_heading']}`}>{props.name}</p>
              {
                props.description &&
                <p
                  className={`${taskItemStyles['task__text']} ${taskItemStyles['task__text_paragraph']}`}>
                  {props.description}
                </p>
              }
            </div>
        }
        <div className={taskItemStyles['task__task-options-wrap']}>
          <input type="checkbox"
                 className={taskItemStyles['task__importance-checkbox']}
                 key={generateUniqueId()}
                 defaultChecked={props.isImportant}
                 onChange={() => {
                   mainStore.tasks.changeTaskStatus(props.id)
                 }}
          />
          <button type="button"
                  data-testid="edit task"
                  className={`${taskItemStyles.task__button} ${taskItemStyles['task__button_type_edit']}`}
                  onClick={() => {
                    mainStore.popup.setPopupIsOpened(props.id, props.name, props.description, props.isDone, props.isImportant);
                  }}
          />
          <button type="button"
                  data-testid="delete task"
                  className={`${taskItemStyles.task__button} ${taskItemStyles['task__button_type_delete']}`}
                  onClick={() => {
                    mainStore.tasks.deleteTask(props.id);
                  }}
          />
        </div>
      </div>
    </li>
  )
})