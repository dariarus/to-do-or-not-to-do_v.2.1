import React from 'react';
import ReactDOM from 'react-dom/client';

import reportWebVitals from './reportWebVitals';

import App from './components/app/app';

import './vendor/normalize.css';
import './index.css';
import './fonts/fonts.css';
import mainStore from './stores';
import {Provider} from 'mobx-react';

const stores = {
  mainStore,
  tasksStore: mainStore.tasks,
  popupStore: mainStore.popup,
  sortOptionsStore: mainStore.sortOptions,
};

const app = ReactDOM.createRoot(
  document.getElementById('app') as HTMLElement
);
app.render(
  <React.StrictMode>
    <Provider {...stores}>
    <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// тестовое задание: https://disk.yandex.ru/i/e_wLZ1I_drdGtg