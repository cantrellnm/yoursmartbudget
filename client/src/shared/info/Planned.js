import React, { useState } from 'react';
import { connect } from 'react-redux';
import PlannedForm from '../forms/PlannedForm';
import actions from '../../actions';
import API from '../../utils/api';
import styled from 'styled-components';
import numeral from 'numeral';
import moment from 'moment';
import helpers from '../../utils/helpers';

const PlannedTr = styled.tr`
  background-color: var(--color-table-header);
  color: var(--color-table-header-text);
  border: none;
  font-weight: 500;
`

const Planned = (props) => {
  const { dispatch, transaction } = props;
  const id = transaction._id;

  const [update, setUpdate] = useState(false);

  // openForm() {
  //   this.setState({update: true});
  // }
  // closeForm() {
  //   this.setState({update: false});
  // }

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
  }

  const pendingDelete = () => {
    let timer = setTimeout(deletePlanned, 10000);
    let message = {type: 'warning', time: Date.now(),
      message: 'Your planned transaction is about to be deleted, would you like to undo this action?',
      cancelMessage: 'Got it. Your planned transaction will not be deleted.',
      timer
    }
    dispatch(actions.displayMessage(message));
  }

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
  }

  let format = '$0,0.00';

  return (
    <PlannedTr className="planned">
      {
        update ?
        ( <>
            <td colSpan="4">
              <button className="icon icon-delete" onClick={pendingDelete}>Delete</button>
              <PlannedForm onSubmit={updatePlanned} transaction={ transaction } label="Update Transaction" />
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
              {(transaction.repeating) ? (
                <svg className="icon" viewBox="0 0 24 24">
                  <path fill='var(--color-header-bg)' d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                </svg>
              ) : (<></>)}
              <svg className="icon" viewBox="0 0 24 24">
                <path fill='var(--color-header-bg)' d="M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z" />
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
    </PlannedTr>
  );
}

export default connect()(Planned);
