import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';
import createSagaMiddleware from 'redux-saga';

import App from './App';
import './index.css';

// import all the reducers
import burgerBuilderReducer from './store/reducers/burgerBuilder';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';

// import all the sagas
import { watchAuth, watchBurgerBuilder, watchOrder } from './store/sagas/index';

// const baseReducer = burgerBuilderReducer;

// dev tools for debugging
const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

// combine any number of reducers into a single reducer to be used in the application
const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer
})

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk, sagaMiddleware)
));

sagaMiddleware.run( watchAuth );
sagaMiddleware.run( watchBurgerBuilder );
sagaMiddleware.run( watchOrder );

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(
  app,
  document.getElementById('root')
);
registerServiceWorker();
