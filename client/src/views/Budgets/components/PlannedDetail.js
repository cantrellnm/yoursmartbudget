import React, { useState } from 'react';
import { connect } from 'react-redux';
import API from '../../../utils/api';
import actions from '../../../actions';
import utils from '../../../utils/budgets';
import PlannedTotals from './PlannedTotals';
import PlannedForm from '../../../shared/forms/PlannedForm';
import moment from 'moment';
import styled from 'styled-components';

const PlannedLi = styled.li`
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 2rem;
  border-top: solid var(--color-header-bg) 1px;
  &:first-of-type {
    border: none;
  }
  div.planned-name, div.planned-totals {
    flex: 0 0 100%;
  }
  div.planned-name {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin: 1rem auto -0.4rem auto;
  }
  div.planned-name h3 {
    margin: 0px 1rem;
    flex-grow: 1;
    text-align: left;
  }
  div.planned-detail {
    flex: 0 0 100%;
  }
  .date {
    font-size: 1.17rem;
  }
`

const PlannedDetail = (props) => {
  const { dispatch, planned, settings } = props;
  const id = planned._id;

  const [update, setUpdate] = useState(false);

  const updatePlanned = (values) => {
    API.post('/planned/update', { id, ...values })
    .then( data => {
      if (data && data.planned_transaction) {
        dispatch(actions.updatePlanned(data.planned_transaction));
        let message = {type: 'success', time: Date.now(), message: `Planned transaction of $${data.planned_transaction.amount} to ${data.planned_transaction.payee} updated. `};
        dispatch(actions.displayMessage(message));
      }
    });
    setUpdate(false);
  };

  const pendingDelete = () => {
    let timer = setTimeout(deletePlanned, 10000);
    let message = {type: 'warning', time: Date.now(),
      message: 'Your planned transaction is about to be deleted, would you like to undo this action?',
      cancelMessage: 'Got it. Your planned transaction will not be deleted.',
      timer
    };
    dispatch(actions.displayMessage(message));
  };

  const deletePlanned = () => {
    API.post('/planned/delete', {type: 'planned_transaction', id}).then( data => {
      if (data && data.status && data.status === 204) {
        dispatch(actions.deletePlanned(id));
        let message = {type: 'notice', time: Date.now(), message: 'Your planned transaction has been deleted.'}
        dispatch(actions.displayMessage(message));
      } else {
        let message = {type: 'error', time: Date.now(), message: 'Failed to delete planned transaction.'}
        dispatch(actions.displayMessage(message));
      }
    });
  };

  let set_aside = utils.totalPlanned(settings.budgetStart, settings.budgetPeriod, [planned]);

  return (
    <PlannedLi>
      <div className="planned-name">
        <em className="date">{moment(planned.date).format('MMM D')}</em>
        <h3>{ planned.payee }</h3>
        { update ? (
          <button className="icon icon-close" onClick={ e => setUpdate(false) }>Close</button>
        ) : (
          <button className="icon icon-edit" onClick={ e => setUpdate(true) }>Edit</button>
        )}
      </div>
      <div className="planned-totals">
        <PlannedTotals amount={ planned.amount } set_aside={ set_aside } repeating={ planned.repeating } />
      </div>
      { update ? (
        <div className="planned-detail">
            <menu>
              <button className="icon icon-delete" onClick={ pendingDelete }>Delete Planned</button>
            </menu>
            <PlannedForm onSubmit={ updatePlanned } transaction={ planned } label="Update Transaction" />
        </div>
      ) : (<></>)}
    </PlannedLi>
  );
}

const mapStateToProps = (state) => ({
  settings: state.settings.all
});

export default connect(mapStateToProps)(PlannedDetail);
