import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as oidcReducer } from 'redux-oidc';
import accountsReducer from './accounts';
import balancesReducer from './balances';
import budgetsReducer from './budgets';
import categoriesReducer from './categories';
import itemsReducer from './items';
import messagesReducer from './messages';
import pendingReducer from './pending';
import plannedReducer from './planned';
import settingsReducer from './settings';
import transactionsReducer from './transactions';

export default (history) => combineReducers(
  {
    router: connectRouter(history),
    oidc: oidcReducer,
    accounts: accountsReducer,
    balances: balancesReducer,
    budgets: budgetsReducer,
    categories: categoriesReducer,
    items: itemsReducer,
    messages: messagesReducer,
    pending: pendingReducer,
    planned: plannedReducer,
    settings: settingsReducer,
    transactions: transactionsReducer,
  }
);
