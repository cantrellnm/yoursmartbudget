import React, { useState } from 'react';
import { connect } from 'react-redux';
import PendingForm from '../forms/PendingForm';
import actions from '../../actions';
import API from '../../utils/api';
import styled from 'styled-components';
import numeral from 'numeral';
import moment from 'moment';
import helpers from '../../utils/helpers';

const PendingTr = styled.tr`
  font-style: italic;
  color: var(--color-header-bg);
`

const Pending = (props) => {
  const { dispatch, transaction } = props;
  const id = transaction._id;

  const [update, setUpdate] = useState(false);

  const updatePending = (values) => {
    API.post('/pending/update', { id, ...values })
    .then( data => {
      if (data && data.pending_transaction) {
        dispatch(actions.updatePending(data.pending_transaction));
        let message = {type: 'success', time: Date.now(), message: `Pending transaction of $${data.pending_transaction.amount} to ${data.pending_transaction.payee} updated. `};
        dispatch(actions.displayMessage(message));
      }
    });
    setUpdate(false);
  }

  const pendingDelete = () => {
    let timer = setTimeout(deletePending, 10000);
    let message = {type: 'warning', time: Date.now(),
      message: 'Your pending transaction is about to be deleted, would you like to undo this action?',
      cancelMessage: 'Got it. Your pending transaction will not be deleted.',
      timer
    }
    dispatch(actions.displayMessage(message));
  }

  const deletePending = () => {
    API.post('/pending/delete', {type: 'pending_transaction', id}).then( data => {
      if (data && data.status && data.status === 204) {
        dispatch(actions.deletePending(id));
        let message = {type: 'notice', time: Date.now(), message: 'Your pending transaction has been deleted.'}
        dispatch(actions.displayMessage(message));
      } else {
        let message = {type: 'error', time: Date.now(), message: 'Failed to delete pending transaction.'}
        dispatch(actions.displayMessage(message));
      }
    });
  }

  let format = '$0,0.00';

  return (
    <PendingTr className="pending">
      {
        update ?
        ( <>
            <td colSpan="4">
              <button className="icon icon-delete" onClick={ pendingDelete }>Delete</button>
              <PendingForm onSubmit={ updatePending } transaction={ transaction } label="Update" />
            </td>
            <td headers="actions">
              <button className="icon icon-close" onClick={e => setUpdate(false)}>Close</button>
            </td>
          </>
        ) : (
          <>
            <td headers="date">{ moment(transaction.date).format('MMM DD') }</td>
            <td headers="payee">{ transaction.payee }</td>
            <td headers="category">
              <svg className="icon" viewBox="0 0 24 24">
                <path fill='var(--color-header-bg)' d="M6,2H18V8H18V8L14,12L18,16V16H18V22H6V16H6V16L10,12L6,8V8H6V2M16,16.5L12,12.5L8,16.5V20H16V16.5M12,11.5L16,7.5V4H8V7.5L12,11.5M10,6H14V6.75L12,8.75L10,6.75V6Z" />
              </svg>
            </td>
            <td headers="amount">
              { numeral(transaction.amount).format(format) }
            </td>
            <td headers="actions">
              <button className="icon icon-edit" onClick={e => setUpdate(true)}>Edit</button>
            </td>
          </>
        )
      }
    </PendingTr>
  );
}

export default connect()(Pending);
