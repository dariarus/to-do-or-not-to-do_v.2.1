import React, {FunctionComponent, useCallback, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {DropTargetMonitor, useDrag, useDrop} from 'react-dnd';
import {Identifier, XYCoord} from 'dnd-core';

import taskItemStyles from './task-item.module.css';
import checkedStar from '../../images/star-checked.svg';
import defaultStar from '../../images/star-default.svg';

import {Checkbox} from '../checkbox/checkbox';

import mainStore from '../../stores';

import {TTaskItem} from '../../services/types/props';

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

      // Не замещать элементы самими собой
      if (dragIndex === hoverIndex) {
        return;
      }

      // вычислить пространство экрана:
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // вычислить середину по вертикали:
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // вычислить, где находится указатель мыши:
      const clientOffset = monitor.getClientOffset();
      // расстояние от верха экрана:
      const hoverActualY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      /* Выполняем перемещение только тогда, когда мышь пересекла половину высоты элемента.
      При перетаскивании вниз перемещение элемента происходит только тогда, когда курсор находится ниже 50% высоты элемента
      При перетаскивании вверх перемещение элемента происходит только тогда, когда курсор находится выше 50% высоты элемента */

      // При перетаскивании вниз совершать действие только в случае, если hover меньше, чем middleY
      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return;
      // При перетаскивании вверх совершать действие только в случае, если hover больше, чем middleY
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return;

      props.onMoveTask(dragIndex, hoverIndex);

      /* Примечание из документации. Здесь мы меняем элемент монитора!
      Обычно лучше избегать мутаций,
      но здесь можно применить ради производительности,
      чтобы избежать дорогостоящего поиска по индексу. */
      item.index = hoverIndex;
    }
  })

  dragRef(dropRef(ref));

  const handleOnChangeIsDone = useCallback(() => {
    mainStore.tasks.changeTaskIsDone(props.id);
  }, [props.isDone])

  return (
    <li ref={ref}
        data-handler-id={handlerId}
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
        <div className={taskItemStyles['task__buttons-wrap']}>
          <button type="button"
                  className={`${taskItemStyles.task__button} ${taskItemStyles['task__button_type_status']}`}
                  style={{
                    backgroundImage: props.isImportant
                      ? `url(${checkedStar})`
                      : `url(${defaultStar})`
                  }}
                  onClick={() => {
                    mainStore.tasks.changeTaskStatus(props.id)
                  }}
          />
          <button type="button"
                  className={`${taskItemStyles.task__button} ${taskItemStyles['task__button_type_edit']}`}
                  onClick={() => {
                    mainStore.popup.setPopupIsOpened(props.id, props.name, props.description, props.isDone, props.isImportant);
                  }}
          />
          <button type="button"
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