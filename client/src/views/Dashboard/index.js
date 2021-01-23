import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import API from '../../utils/api';
import utils from '../../utils/budgets';
import actions from '../../actions';
import HeaderContainer from '../../shared/page/HeaderContainer';
import FooterContainer from '../../shared/page/FooterContainer';
import BudgetOverview from './components/BudgetOverview';
import ItemContainer from './components/ItemContainer';
import AccountContainer from './components/AccountContainer';
import RecentTransactions from './components/RecentTransactions';

const DashboardView = (props) => {

  const { dispatch, settings, items, user } = props;

  const adjustBudgetStart = () => {
    settings.budgetStart =  utils.adjustBudgetStart(settings.budgetPeriod, settings.budgetStart);
    API.post('/user/update', { settings })
      .then( data => {
        if (data && data.settings) {
          dispatch(actions.saveSettings(data.settings));
          console.log('Settings saved');
        }
      });
  }

  useEffect(() => {
    if (user && items.length < 1 ) {
      API.get('/user').then( data => {
        if (data) {
          if (data.categories) dispatch(actions.loadCategories(data.categories));
          if (data.settings) dispatch(actions.saveSettings(data.settings));
          if (data.items) dispatch(actions.loadItems(data.items));
          if (data.accounts) dispatch(actions.loadAccounts(data.accounts));
          if (data.budgets) dispatch(actions.loadBudgets(data.budgets));
          if (data.transactions) dispatch(actions.loadTransactions(data.transactions));
          if (data.pendingTransactions) dispatch(actions.loadPending(data.pendingTransactions));
          if (data.plannedTransactions) dispatch(actions.loadPlanned(data.plannedTransactions));
        }
      });
    };
  }, []);

  useEffect(() => {
    if (settings.budgetPeriod && utils.budgetEndPassed(settings.budgetPeriod, settings.budgetStart)) {
      adjustBudgetStart();
    }
  }, [settings]);

  return (
    <div className="view">
      <HeaderContainer />
      <BudgetOverview />
      <ItemContainer />
      <AccountContainer />
      <RecentTransactions />
      <FooterContainer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.oidc.user,
  items: state.items.all,
  settings: state.settings.all
});

export default connect(mapStateToProps)(DashboardView);
