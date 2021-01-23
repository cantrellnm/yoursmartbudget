import React, { useState } from 'react';
import { connect } from 'react-redux';
import API from '../../../utils/api';
import actions from '../../../actions';
import utils from '../../../utils/budgets';
import BudgetForm from './BudgetForm';
import BudgetTotals from '../../../shared/info/BudgetTotals';
import TransactionTable from '../../../shared/info/TransactionTable';
import styled from 'styled-components';

const BudgetLi = styled.li`
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 2rem;
  border-top: solid var(--color-header-bg) 1px;
  &:first-of-type {
    border: none;
  }
  div.budget-name {
    flex: 0 0;
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
    justify-content: center;
    margin: 1rem auto -0.4rem auto;
    max-width: 100%;
  }
  div.budget-name h3 {
    margin: 0px 1rem 5px 0;
  }
  div.budget-name ul {
    flex-grow: 1;
  }
  div.budget-name, div.budget-totals {
    flex: 0 0 100%;
  }
  div.budget-detail {
    flex: 0 0 100%;
    text-align: center;
  }
`

const Budget = (props) => {
  const { dispatch, settings, budget } = props;
  const id = budget._id;

  const [update, setUpdate] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const updateBudget = (values) => {
    let { name, amount, categories } = values;
    amount = utils.budgetAmountFromInput(settings.budgetPeriod, amount);
    API.post('/budget/update', { id, name, amount, categories })
    .then( data => {
      if (data && data.budget) {
        dispatch(actions.updateBudget(data.budget));
        let message = {type: 'success', time: Date.now(), message: `Budget "${data.budget.name}" updated. `};
        dispatch(actions.displayMessage(message));
      }
    });
    setUpdate(false);
  }

  const pendingDelete = () => {
    let timer = setTimeout(deleteBudget, 10000);
    let message = {type: 'warning', time: Date.now(),
      message: 'Your budget is about to be deleted, would you like to undo this action?',
      cancelMessage: 'Got it. Your budget will not be deleted.',
      timer
    }
    dispatch(actions.displayMessage(message));
  };

  const deleteBudget = () => {
    API.post('/budget/delete', {type: 'budget', id}).then( data => {
      if (data && data.status && data.status === 204) {
        dispatch(actions.deleteBudget(id));
        let message = {type: 'notice', time: Date.now(), message: 'Your budget has been deleted.'}
        dispatch(actions.displayMessage(message));
      } else {
        let message = {type: 'error', time: Date.now(), message: 'Failed to delete budget.'}
        dispatch(actions.displayMessage(message));
      }
    });
  };

  const filterTransactions = (transactions) => {
    return transactions
      ? transactions.filter( trans => {
          if (trans.data) {
            if (trans.data.amount < 0) return false;
            if (trans.data.date < settings.budgetStart) return false;
          } else {
            if (trans.amount < 0) return false;
          }
          return true;
        })
      : [];
  }

  const transactions = filterTransactions(props.transactions[id]);
  const pending = filterTransactions(props.pending[id]);

  return (
    <BudgetLi>
      <div className="budget-name">
        <h3>{ budget.name }</h3>
        <ul className="categories-list">{
          budget.categories.map( cat => {
            let value = cat[1] || cat[0];
            return (
              <li className="category" key={ value }>{ value }</li>
            )
          })
         }</ul>
        { showMore ? (
          <button className="icon icon-hide" onClick={ e => setShowMore(false) }>Hide</button>
        ) : (
          <button className="icon icon-show" onClick={ e => setShowMore(true) }>More</button>
        )}
      </div>
      <div className="budget-totals">
        <BudgetTotals
          budgeted={ utils.totalBudgeted(settings.budgetPeriod, [budget]) }
          spent={ utils.totalAmount(transactions) }
          pending={ utils.totalAmount(pending) }
          today={ utils.budgetPercentPassed(settings.budgetPeriod, settings.budgetStart) } />
      </div>
      <div className="budget-detail">
        { showMore ? (
          <>
            <menu>
              <button className="icon icon-delete" onClick={ pendingDelete }>Delete Budget</button>
              { update ? (
                <>
                  <button className="icon icon-close" onClick={ e => setUpdate(false) }>Close</button>
                  <BudgetForm onSubmit={ updateBudget }
                    name={ budget.name } amount={ utils.budgetPeriodAmount(settings.budgetPeriod, budget.amount) } categories={ budget.categories } label="Update" />
                </>
              ) : (
                <button className="icon icon-edit" onClick={ e => setUpdate(true) }>Edit Budget</button>
              )}
            </menu>
            <TransactionTable transactions={ transactions } pending={ pending } />
          </>
        ) : (<></>)}
      </div>
    </BudgetLi>
  );
}

const mapStateToProps = (state) => ({
  transactions: state.transactions.budgeted,
  pending: state.pending.budgeted,
  settings: state.settings.all
});

export default connect(mapStateToProps)(Budget);
