import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';

import registerServiceWorker from './registerServiceWorker';

import { createStore } from 'redux';
import { processAction } from './reducers/index';
import { StoreState } from './types/index';
import { BotAction } from './actions';
import { Provider } from 'react-redux';

const store = createStore<StoreState, BotAction, any, any>(processAction, {
  messages: [],
  conversationStarted: false
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
