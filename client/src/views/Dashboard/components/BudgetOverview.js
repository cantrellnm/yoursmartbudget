import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AvailableTotals from './AvailableTotals';
import SpentTotals from './SpentTotals';
import BudgetTotals from '../../../shared/info/BudgetTotals';
import utils from '../../../utils/budgets';
import styled from 'styled-components';

const BudgetsDiv = styled.div`
  div:hover {
    cursor: pointer;
  }
  p {
    text-align: center;
  }
`

const BudgetOverview = (props) => {
  const {
    accounts,
    balances,
    budgets,
    settings,
    planned,
    pending
  } = props;
  let {
    budgeted,
    budgetedPending,
    unbudgeted,
    complete
  } = props;

  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    return <Redirect to='/budgets' />
  }

  budgeted = utils.filterAmountAndDate(utils.combineBudgeted(budgeted), settings.budgetStart);
  budgetedPending = utils.combineBudgeted(budgetedPending);
  unbudgeted = utils.filterAmountAndDate(unbudgeted, settings.budgetStart);
  complete = utils.filterAmountAndDate(complete, settings.budgetStart);

  let net_balance_amount = utils.netAccountsBalance(accounts, balances, settings.credit);

  let budgets_amount = utils.totalBudgeted(settings.budgetPeriod, budgets);
  let budgets_spent = utils.totalAmount(budgeted);
  let budgets_pending = utils.totalAmount(budgetedPending);
  let budgets_remaining = ((budgets_amount*100) - (budgets_spent*100) - (budgets_pending*100))/100;
  let pending_amount = utils.totalAmount(pending);

  let unbudgeted_spent = utils.totalAmount(unbudgeted);

  let planned_spent = utils.totalAmount(complete);
  let planned_set_aside = utils.totalPlanned(settings.budgetStart, settings.budgetPeriod, planned);

  return (
    <BudgetsDiv onClick={ e => setRedirect(true) }>
      <h2>Overview</h2>
      {(accounts.length && accounts.length === balances.length) ? (
        <AvailableTotals total={ net_balance_amount } planned={ planned_set_aside } budgeted={ budgets_remaining } pending={ pending_amount } />
      ) : (<></>) }

      {(budgets.length) ? (
        <BudgetTotals budgeted={ budgets_amount } spent={ budgets_spent } pending={ budgets_pending } today={ utils.budgetPercentPassed(settings.budgetPeriod, settings.budgetStart) } />
      ) : (<></>)}

      {(budgeted.length || unbudgeted.length || complete.length) ? (
        <SpentTotals planned={ planned_spent } budgeted={ budgets_spent } unbudgeted={ unbudgeted_spent } />
      ) : (<></>)}
    </BudgetsDiv>
  );
}

const mapStateToProps = (state) => ({
  settings: state.settings.all,
  accounts: state.accounts.all,
  balances: state.balances.all,
  budgets: state.budgets.all,
  budgeted: state.transactions.budgeted,
  budgetedPending: state.pending.budgeted,
  unbudgeted: state.transactions.unbudgeted,
  complete: state.transactions.planned,
  planned: state.planned.visible,
  pending: state.pending.visible
});

export default connect(mapStateToProps)(BudgetOverview);
