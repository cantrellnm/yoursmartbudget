import { createStore, applyMiddleware, compose } from "redux";
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createOidcMiddleware, { createUserManager } from "redux-oidc";
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import storageSession from 'redux-persist/lib/storage/session'
import createRootReducer from './reducer';
import userManager from "./utils/userManager";

const oidcMiddleware = createOidcMiddleware(userManager);

const loggerMiddleware = store => next => action => {
  console.log("Action type:", action.type);
  console.log("Action payload:", action.payload);
  console.log("State before:", store.getState());
  next(action);
  console.log("State after:", store.getState());
};

const history = createBrowserHistory();

const rootReducer = createRootReducer(history);

const persistStorageConfig = {
 key: 'root',
 storage: storageSession,
 blacklist: ['messages']
};

const persistStorageReducer = persistReducer(persistStorageConfig, rootReducer);

let middleware = [
  oidcMiddleware,
  routerMiddleware(history),
  thunk,
];
if (process.env.NODE_ENV !== 'production') middleware.push(loggerMiddleware);

const store = createStore(
  persistStorageReducer,
  compose(applyMiddleware(...middleware))
);

// loadUser(store, userManager);

const persistor = persistStore(store);

export { store, persistor, history };
