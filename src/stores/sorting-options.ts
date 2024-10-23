import {makeAutoObservable, observable, reaction, IObservableArray, toJS} from 'mobx';
import {SortingParameters, SortingTasksFieldParameter} from '../services/types/state';
import {TTask} from '../services/types/props';
import {Tasks} from './tasks';

export class SortingOptions {
  sortOrder: SortingParameters = SortingParameters.ALL;
  sortByField: SortingTasksFieldParameter = SortingTasksFieldParameter.NONE;
  tasksState: Tasks;

  constructor(tasksState: Tasks) {
    this.tasksState = tasksState;
    makeAutoObservable(this);

    // Меняем showingTasksArray при каждом изменении задач в fullTasksArray.
    // Работает reaction вместо autorun, потому что showingTasksArray перезаписывается полностью каждый раз при изменении fullTasksArray
    reaction(
      () =>
        // скопировать поступивший в контсруктор массив видимых задач
        observable.array(this.tasksState.showingTasksArray),
      // Его проксированная копия поступает в аргументы. Если с ней что-то происходит, то это не влияет на изначальный массив
      (showingTasksArrayProxy) => {
        switch (this.sortByField) {
          case SortingTasksFieldParameter.NONE:
            return;
          case SortingTasksFieldParameter.NAME:
            this.sortByNames(showingTasksArrayProxy, this.sortOrder);
            break;
          case SortingTasksFieldParameter.IMPORTANCE:
            this.sortByImportance(showingTasksArrayProxy, this.sortOrder);
            break;
          case SortingTasksFieldParameter.DATE:
            this.sortByDate(showingTasksArrayProxy, this.sortOrder);
            break;
        }
        // Приводим явно тип для this.tasksState.showingTasksArray к observable-типу,
        // чтобы компилятор не ругался на метод replace (раньше подчеркивал, что его нет у массива TTask).
        // Хотя он есть, потому что он и так был сделан makeAutoObservable(), но компилятор не видит этого свойства
        const showingTasksArrayObservable = this.tasksState.showingTasksArray as IObservableArray<TTask>
        return showingTasksArrayObservable.replace(showingTasksArrayProxy);
      }
    );
  }

  sort<T>(a: T, b: T) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1
    }
    return 0;
  }

  sortByNames(sortingArray: TTask[], order: SortingParameters): TTask[] {
    this.sortByField = SortingTasksFieldParameter.NAME;
    this.sortOrder = order;
    switch (order) {
      case SortingParameters.ALL:
        return sortingArray;
      case SortingParameters.ASCENDING:
        return sortingArray.sort((a, b) => this.sort(a.name?.toUpperCase(), b.name?.toUpperCase()));
      case SortingParameters.DESCENDING:
        return sortingArray.sort((a, b) => this.sort(b.name?.toUpperCase(), a.name?.toUpperCase()));
    }
  }

  sortByImportance(sortingArray: TTask[], order: SortingParameters): TTask[] {
    this.sortByField = SortingTasksFieldParameter.IMPORTANCE;
    this.sortOrder = order;
    switch (order) {
      case SortingParameters.ALL:
        return sortingArray;
      case SortingParameters.ASCENDING:
        return sortingArray.sort((a, b) => this.sort(b.isImportant, a.isImportant));
      case SortingParameters.DESCENDING:
        return sortingArray.sort((a, b) => this.sort(a.isImportant, b.isImportant));
    }
  }

  sortByDate(sortingArray: TTask[], order: SortingParameters): TTask[] {
    this.sortByField = SortingTasksFieldParameter.DATE;
    this.sortOrder = order;
    switch (order) {
      case SortingParameters.ALL:
        return sortingArray;
      case SortingParameters.ASCENDING:
        return sortingArray.sort((a, b) => a.closeDate && b.closeDate
          ? this.sort(b.closeDate, a.closeDate)
          : this.sort(b.createDate, a.createDate));
      case SortingParameters.DESCENDING:
        return sortingArray.sort((a, b) => a.closeDate && b.closeDate
          ? this.sort(a.closeDate, b.closeDate)
          : this.sort(a.createDate, b.createDate));
    }
  }
}