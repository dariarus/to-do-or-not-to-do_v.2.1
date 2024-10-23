import {Tasks} from './tasks';
import {Popup} from './popup';
import {SortingOptions} from './sorting-options';

class MainStore {
  tasks: Tasks;
  popup: Popup;
  sortOptions: SortingOptions;

  constructor() {
    this.tasks = new Tasks();
    this.popup = new Popup();
    this.sortOptions = new SortingOptions(this.tasks);
  }
}

const mainStore = new MainStore();
export default mainStore;