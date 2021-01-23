import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import API from '../../utils/api';
import actions from '../../actions';
import utils from '../../utils/budgets';
import HeaderContainer from '../../shared/page/HeaderContainer';
import FooterContainer from '../../shared/page/FooterContainer';
import TransactionTable from '../../shared/info/TransactionTable';
import BudgetSummary from './components/BudgetSummary';
import BudgetTotals from '../../shared/info/BudgetTotals';
import PlannedTotals from './components/PlannedTotals';
import BudgetForm from './components/BudgetForm';
import Budget from './components/Budget';
import PlannedDetail from './components/PlannedDetail';
import moment from 'moment';
import numeral from 'numeral';
import styled from 'styled-components';

const Budgets = styled.div`
  ul.budgets, ul.planned {
    list-style-type: none;
    padding: 0;
  }
  h3, p {
    text-align: center;
  }
  p.summary {
    text-align: left;
    font-weight: 500;
    font-size: 110%;
    margin: 1rem auto;
  }
`

const BudgetsView = (props) => {
  const {
    dispatch,
    user,
    settings,
    budgets,
    unbudgetedPending,
    planned
  } = props;
  let {
    budgeted,
    budgetedPending,
    unbudgeted,
    complete
  } = props;

  const [openForm, setOpenForm] = useState(false);
  const [showUnbudgeted, setShowUnbudgeted] = useState(false);
  const [showPlanned, setShowPlanned] = useState(false);

  const fetchBudgetData = () => {
    API.get('/budget').then( data => {
      if (data && data.budgets) dispatch(actions.loadBudgets(data.budgets));
    });
  }

  useEffect(() => {
    if (user && budgets.length < 1) fetchBudgetData();
  });

  const createBudget = (values) => {
    let { name, amount, categories } = values;
    amount = utils.budgetAmountFromInput(settings.budgetPeriod, amount);
    API.post('/budget/new', { name, amount, categories })
    .then( data => {
      if (data && data.budget) {
        dispatch(actions.newBudget(data.budget));
        let message = {type: 'success', time: Date.now(), message: `New budget "${data.budget.name}" created. `};
        dispatch(actions.displayMessage(message));
      }
    });
    setOpenForm(false);
  };

  budgeted = utils.filterAmountAndDate(utils.combineBudgeted(budgeted), settings.budgetStart);
  budgetedPending = utils.combineBudgeted(budgetedPending);
  unbudgeted = utils.filterAmountAndDate(unbudgeted, settings.budgetStart);
  complete = utils.filterAmountAndDate(complete, settings.budgetStart);

  let totalBudgeted = utils.totalBudgeted(settings.budgetPeriod, budgets);
  let nextBudgetStart = moment(settings.budgetStart).add(parseInt(settings.budgetPeriod[0]), settings.budgetPeriod[1]).format('YYYY-MM-DD');

  return (
    <Budgets className="view">
      <HeaderContainer />
      <h2 id="budgets">Budgets</h2>
      <menu>
        { (openForm) ? (
          <div>
            <button className="icon icon-close" onClick={ e => setOpenForm(false) }>Close</button>
            <BudgetForm onSubmit={ createBudget } label="Create Budget" />
          </div>
        ) : (
          <div><button className="icon icon-budget" onClick={ e => setOpenForm(true) }>New Budget</button></div>
        )}
      </menu>
      <BudgetSummary
        settings={ settings }
        budgeted={ totalBudgeted }
        nextBudgetStart={ nextBudgetStart }
        set_aside={ utils.totalPlanned(nextBudgetStart, settings.budgetPeriod, planned, true) }
      />
      { (budgets && budgets.length) ? (
        <>
          <BudgetTotals
            budgeted={ totalBudgeted }
            spent={ utils.totalAmount(budgeted) }
            pending={ utils.totalAmount(budgetedPending) }
            today={ utils.budgetPercentPassed(settings.budgetPeriod, settings.budgetStart) }
            big={ true } />
          <ul className="budgets">
            { budgets.map(budget => (<Budget key={budget._id} budget={budget} />)) }
          </ul>
        </>
      ) : (
        <p>You have no budgets. Click New Budget to get started.</p>
      )}

      <h2 id="unbudgeted">Unbudgeted Spending</h2>
      { (unbudgeted && unbudgeted.length) ? (
        <>
          <h3>{unbudgeted.length} Transaction(s)</h3>
          <BudgetTotals budgeted={ 0 } spent={ utils.totalAmount(unbudgeted) } pending={ utils.totalAmount(unbudgetedPending) } big={ true } />
          { showUnbudgeted ? (
            <>
              <p><button className="icon icon-hide" onClick={ e => setShowUnbudgeted(false) }>Hide Transactions</button></p>
              <TransactionTable transactions={ unbudgeted } pending={ unbudgetedPending } />
            </>
          ) : (
            <p><button className="icon icon-show" onClick={ e => setShowUnbudgeted(true) }>Show Transactions</button></p>
          )}
        </>
      ) : (
        <p>You have no unbudgeted transactions.</p>
      )}

      <h2 id="planned">Planned Transactions</h2>
      { (planned && planned.length) ? (
        <>
          <h3>{planned.length} Transaction(s)</h3>
          <PlannedTotals amount={ utils.totalAmount(planned) } set_aside={ utils.totalPlanned(settings.budgetStart, settings.budgetPeriod, planned) } big={ true } />
          <ul className="planned">
            { planned.sort((a,b) => (utils.sortByDate(a, b, false))).map(trans => (
              <PlannedDetail key={ trans._id } planned={ trans } />
            )) }
          </ul>
        </>
      ) : (
        <p>You have no planned transactions.</p>
      ) }

      <h2 id="complete">Planned Spending</h2>
      <div><p className="summary">{ numeral(utils.totalAmount(complete)).format('$0,0.00') } Spent</p></div>
      { showPlanned ? (
        <>
          <p><button className="icon icon-hide" onClick={ e => setShowPlanned(false) }>Hide Transactions</button></p>
          <TransactionTable transactions={ complete } planned={ [] } />
        </>
      ) : (
        <p><button className="icon icon-show" onClick={ e => setShowPlanned(true) }>Show Transactions</button></p>
      )}
      <FooterContainer />
    </Budgets>
  );
}

const mapStateToProps = (state) => ({
  user: state.oidc.user,
  settings: state.settings.all,
  budgets: state.budgets.all,
  budgeted: state.transactions.budgeted,
  budgetedPending: state.pending.budgeted,
  unbudgeted: state.transactions.unbudgeted,
  unbudgetedPending: state.pending.unbudgeted,
  complete: state.transactions.planned,
  planned: state.planned.visible
});

export default connect(mapStateToProps)(BudgetsView);
