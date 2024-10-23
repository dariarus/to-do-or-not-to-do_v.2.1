import React, {ChangeEvent, FunctionComponent, useState} from 'react';

import searchFormStyles from './search-form.module.css';
import mainStore from '../../stores';
import {set} from 'mobx';

export const SearchForm: FunctionComponent = () => {
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <div className={searchFormStyles['form-wrap']}>
      <form className={searchFormStyles.form}>
        <input value={inputValue}
               placeholder="Название или описание задачи"
               className={!inputValue
                 ? `${searchFormStyles.input}`
                 : `${searchFormStyles.input} ${searchFormStyles['input_not-empty']}`}
               onChange={(e: ChangeEvent<HTMLInputElement>) => {
                 setInputValue(e.target.value);
                 mainStore.tasks.setTaskNameFilterValue(e.target.value);
                 mainStore.tasks.setShowingTasksArray();
               }}
        />
        {
          inputValue &&
          <button type="button"
                  className={searchFormStyles['reset-button']}
                  onClick={() => {
                    setInputValue('');
                    mainStore.tasks.setTaskNameFilterValue('');
                    mainStore.tasks.setShowingTasksArray();
                  }}
          />
        }
      </form>
    </div>
  )
}