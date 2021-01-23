import React, { useState } from 'react';
import { connect } from 'react-redux';
import PlannedForm from './PlannedForm';
import PendingForm from './PendingForm';
import actions from '../../actions';
import API from '../../utils/api';

const NewTransactionMenu = (props) => {
  const { dispatch, account } = props;

  const [newPlanned, setNewPlanned] = useState(false);
  const [newPending, setNewPending] = useState(false);

  const createPlanned = (values) => {
    API.post('/planned/new', values)
    .then( data => {
      if (data && data.planned_transaction) {
        dispatch(actions.newPlanned(data.planned_transaction));
        let message = {type: 'success', time: Date.now(), message: `New planned transaction for $${data.planned_transaction.amount} to ${data.planned_transaction.payee} created. `};
        dispatch(actions.displayMessage(message));
      }
    });
    setNewPlanned(false);
  }

  const createPending = (values) => {
    API.post('/pending/new', values)
    .then(data => {
      if (data && data.pending_transaction) {
        dispatch(actions.newPending(data.pending_transaction));
        let message = {type: 'success', time: Date.now(), message: `New pending transaction for $${data.pending_transaction.amount} to ${data.pending_transaction.payee} created. `};
        dispatch(actions.displayMessage(message));
      }
    });
    setNewPending(false);
  }

  return (
    <menu>
      { (newPending) ? (
        <>
          <button className="icon icon-close" onClick={e => setNewPending(false)}>Close</button>
          <PendingForm onSubmit={ createPending } transaction={ {account} } label="Create Transaction" />
        </>
      ) : (
        <button className="icon icon-pending" onClick={e => setNewPending(true)}>New Pending Transaction</button>
      )}
      { (newPlanned) ? (
        <>
          <button className="icon icon-close" onClick={e => setNewPlanned(false)}>Close</button>
          <PlannedForm onSubmit={ createPlanned } transaction={ {account} } label="Create Transaction" />
        </>
      ) : (
        <button className="icon icon-planned" onClick={e => setNewPlanned(true)}>New Planned Transaction</button>
      )}
    </menu>
  );
}

export default connect()(NewTransactionMenu);
