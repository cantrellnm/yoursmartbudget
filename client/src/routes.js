import React from 'react';
import { Route, Switch } from 'react-router';
import HomeView from './views/Home';
import CallbackView from './views/Callback';
import BudgetsView from './views/Budgets';
import AccountView from './views/Account';
import CategoriesView from './views/Categories';

const routes = (
  <Switch>
    <Route exact path="/" component={HomeView} />
    <Route path="/callback" component={CallbackView} />
    <Route path="/budgets" component={BudgetsView} />
    <Route path="/account" component={AccountView} />
    <Route path="/categories" component={CategoriesView} />
  </Switch>
);

export default routes;
