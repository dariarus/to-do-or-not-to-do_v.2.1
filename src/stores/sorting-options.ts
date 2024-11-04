import { makeAutoObservable, observable, reaction, IObservableArray, toJS } from 'mobx';
import { SortingParameters, SortingTasksFieldParameter } from '../services/types/state';
import { TTask } from '../services/types/props';
import { Tasks } from './tasks';

export class SortingOptions {
  sortOrder: SortingParameters = SortingParameters.ALL;
  sortByField: SortingTasksFieldParameter = SortingTasksFieldParameter.NONE;
  tasksState: Tasks | undefined = undefined;

  constructor(tasksState: Tasks) {
    this.tasksState = tasksState;
    makeAutoObservable(this);

    reaction(
      () =>
        observable.array(this.tasksState?.showingTasksArray),
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
        const showingTasksArrayObservable = this.tasksState?.showingTasksArray as IObservableArray<TTask>
        return showingTasksArrayObservable.replace(showingTasksArrayProxy);
      }
    );
  }

  _sort<T>(a: T, b: T) {
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
        return sortingArray.sort((a, b) => this._sort(a.name?.toUpperCase(), b.name?.toUpperCase()));
      case SortingParameters.DESCENDING:
        return sortingArray.sort((a, b) => this._sort(b.name?.toUpperCase(), a.name?.toUpperCase()));
    }
  }

  sortByImportance(sortingArray: TTask[], order: SortingParameters): TTask[] {
    this.sortByField = SortingTasksFieldParameter.IMPORTANCE;
    this.sortOrder = order;
    switch (order) {
      case SortingParameters.ALL:
        return sortingArray;
      case SortingParameters.ASCENDING:
        return sortingArray.sort((a, b) => this._sort(b.isImportant, a.isImportant));
      case SortingParameters.DESCENDING:
        return sortingArray.sort((a, b) => this._sort(a.isImportant, b.isImportant));
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
          ? this._sort(b.closeDate, a.closeDate)
          : this._sort(b.createDate, a.createDate));
      case SortingParameters.DESCENDING:
        return sortingArray.sort((a, b) => a.closeDate && b.closeDate
          ? this._sort(a.closeDate, b.closeDate)
          : this._sort(a.createDate, b.createDate));
    }
  }

  reset() {
    this.sortOrder = SortingParameters.ALL;
    this.sortByField = SortingTasksFieldParameter.NONE;
    this.tasksState = undefined;
  }
}