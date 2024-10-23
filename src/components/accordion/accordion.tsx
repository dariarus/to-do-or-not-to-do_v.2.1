import React, {FunctionComponent, useState} from 'react';

import accordionStyles from './accordion.module.css';

import {SortingOptionRadio} from '../sorting-option-radio/sorting-option-radio';

import mainStore from '../../stores';

import {SortingParameters, TaskCompletion} from '../../services/types/state';

export const Accordion: FunctionComponent<{ isActive: boolean }> = (props) => {
  const [alphabetSortingRadio, setAlphabetSortingRadio] = useState<SortingParameters>(SortingParameters.ALL);
  const [importanceSortingRadio, setImportanceSortingRadio] = useState<SortingParameters>(SortingParameters.ALL);
  const [dateSortingRadio, setDateSortingRadio] = useState<SortingParameters>(SortingParameters.ASCENDING);

  return (
    <div className={
      props.isActive && mainStore.tasks.fullTasksArray.length > 0
        ? `${accordionStyles.accordion} ${accordionStyles['accordion_is-active']}`
        : `${accordionStyles.accordion}`}>
      <h3
        className={`${accordionStyles['accordion__text']} ${accordionStyles['accordion__text_heading']}`}>Сортировать
        задачи</h3>
      <form className={accordionStyles.form}>
        <fieldset className={accordionStyles.fieldset}>
          <legend className={accordionStyles.legend}>По названию</legend>
          <SortingOptionRadio id="allNames"
                              isChecked={alphabetSortingRadio === SortingParameters.ALL}
                              inputName="tasksNames"
                              label="Не сортировать"
                              onClickRadio={() => {
                                setAlphabetSortingRadio(SortingParameters.ALL);
                                mainStore.sortOptions.sortByNames(mainStore.tasks.showingTasksArray, SortingParameters.ALL)
                                mainStore.tasks.setShowingTasksArray();
                              }}
          />
          <SortingOptionRadio id="ascAlphabet"
                              isChecked={alphabetSortingRadio === SortingParameters.ASCENDING}
                              inputName="tasksNames"
                              label="А &#8594; Я"
                              onClickRadio={() => {
                                setAlphabetSortingRadio(SortingParameters.ASCENDING);
                                mainStore.sortOptions.sortByNames(mainStore.tasks.showingTasksArray, SortingParameters.ASCENDING);

                                setImportanceSortingRadio(SortingParameters.ALL);
                                setDateSortingRadio(SortingParameters.ASCENDING);
                              }}
          />
          <SortingOptionRadio id="descAlphabet"
                              isChecked={alphabetSortingRadio === SortingParameters.DESCENDING}
                              inputName="tasksNames"
                              label="Я &#8594; А"
                              onClickRadio={() => {
                                setAlphabetSortingRadio(SortingParameters.DESCENDING);
                                mainStore.sortOptions.sortByNames(mainStore.tasks.showingTasksArray, SortingParameters.DESCENDING);

                                setImportanceSortingRadio(SortingParameters.ALL);
                                setDateSortingRadio(SortingParameters.ASCENDING);
                              }}
          />
        </fieldset>
        <fieldset className={accordionStyles.fieldset}>
          <legend className={accordionStyles.legend}>По важности</legend>
          <SortingOptionRadio id="allTasks"
                              isChecked={importanceSortingRadio === SortingParameters.ALL}
                              inputName="tasksImportance"
                              label="Не сортировать"
                              onClickRadio={() => {
                                setImportanceSortingRadio(SortingParameters.ALL);
                                mainStore.sortOptions.sortByImportance(mainStore.tasks.showingTasksArray, SortingParameters.ALL);
                                mainStore.tasks.setShowingTasksArray();
                              }}
          />
          <SortingOptionRadio id="important"
                              isChecked={importanceSortingRadio === SortingParameters.ASCENDING}
                              inputName="tasksImportance"
                              label="Сначала важные"
                              onClickRadio={() => {
                                setImportanceSortingRadio(SortingParameters.ASCENDING);
                                mainStore.sortOptions.sortByImportance(mainStore.tasks.showingTasksArray, SortingParameters.ASCENDING);

                                setAlphabetSortingRadio(SortingParameters.ALL);
                                setDateSortingRadio(SortingParameters.ASCENDING);
                              }}
          />
          <SortingOptionRadio id="notImportant"
                              isChecked={importanceSortingRadio === SortingParameters.DESCENDING}
                              inputName="tasksImportance"
                              label="Сначала неважные"
                              onClickRadio={() => {
                                setImportanceSortingRadio(SortingParameters.DESCENDING);
                                mainStore.sortOptions.sortByImportance(mainStore.tasks.showingTasksArray, SortingParameters.DESCENDING);

                                setAlphabetSortingRadio(SortingParameters.ALL);
                                setDateSortingRadio(SortingParameters.ASCENDING);
                              }}
          />
        </fieldset>
        <fieldset className={accordionStyles.fieldset}>
          <legend className={accordionStyles.legend}>По
            дате {mainStore.tasks.taskCompletionFilterValue === TaskCompletion.DONE
              ? 'выполнения' : 'добавления'}</legend>
          <SortingOptionRadio id="newFirst"
                              isChecked={dateSortingRadio === SortingParameters.ASCENDING}
                              inputName="tasksDates"
                              label="Сначала новые"
                              onClickRadio={() => {
                                setDateSortingRadio(SortingParameters.ASCENDING);
                                mainStore.sortOptions.sortByDate(mainStore.tasks.showingTasksArray, SortingParameters.ASCENDING);

                                setAlphabetSortingRadio(SortingParameters.ALL);
                                setImportanceSortingRadio(SortingParameters.ALL);
                              }}
          />
          <SortingOptionRadio id="oldFirst"
                              isChecked={dateSortingRadio === SortingParameters.DESCENDING}
                              inputName="tasksDates"
                              label="Сначала старые"
                              onClickRadio={() => {
                                setDateSortingRadio(SortingParameters.DESCENDING);
                                mainStore.sortOptions.sortByDate(mainStore.tasks.showingTasksArray, SortingParameters.DESCENDING);

                                setAlphabetSortingRadio(SortingParameters.ALL);
                                setImportanceSortingRadio(SortingParameters.ALL);
                              }}
          />
        </fieldset>
      </form>
    </div>
  )
}