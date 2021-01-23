import React, { useState } from 'react';
import { connect } from 'react-redux';
import API from '../../utils/api';
import CategorySelect from '../forms/CategorySelect';
import PlannedSelect from '../forms/PlannedSelect';
import PendingSelect from '../forms/PendingSelect';
import actions from '../../actions';
import numeral from 'numeral';
import moment from 'moment';
import helpers from '../../utils/helpers';

const Transaction = (props) => {
  const { dispatch } = props;
  let { transaction } = props;
  const id = transaction._id;

  const [edit, setEdit] = useState(false);
  const [linkPlanned, setLinkPlanned] = useState(false);
  const [linkPending, setLinkPending] = useState(false);

  const close = () => {
    setEdit(false);
    setLinkPlanned(false);
    setLinkPending(false);
  }

  const changeCategory = (e) => {
    transaction.data.category =  e.target.value.split('|');
    // send api call to server to update transaction
    API.post('/transaction/update', { id, data: transaction.data })
    .then( data => {
      if (data && data.transaction) {
        dispatch(actions.updateTransaction(data.transaction));
        if (data.planned_transaction) dispatch(actions.updatePlanned(data.planned_transaction));
        let message = {type: 'success', time: Date.now(), message: `Transaction of $${data.transaction.data.amount} to ${data.transaction.data.name} updated. `};
        dispatch(actions.displayMessage(message));
      }
    });
    close();
  };

  const setPlanned = (e) => {
    let planned = (e.target.value) ? e.target.value : null;
    API.post('/transaction/update', { id, planned })
    .then( data => {
      if (data && data.transaction) {
        dispatch(actions.updateTransaction(data.transaction));
        if (data.planned_transactions && data.planned_transactions.length) {
          data.planned_transactions.forEach(updated_planned => {
            dispatch(actions.updatePlanned(updated_planned));
          });
        }
        let message = {type: 'success', time: Date.now(), message: `Transaction of $${data.transaction.data.amount} to ${data.transaction.data.name} updated. `};
        dispatch(actions.displayMessage(message));
      }
    });
    close();
  };

  const setPending = (id, category) => {
    if (transaction && id && category.length) {
      transaction.data.category = category;
      API.post('/transaction/update', { id, data: transaction.data })
      .then( data => {
        if (data && data.transaction) {
          dispatch(actions.updateTransaction(data.transaction));
          let message = {type: 'success', time: Date.now(), message: `Transaction of $${data.transaction.data.amount} to ${data.transaction.data.name} updated. `};
          dispatch(actions.displayMessage(message));
        }
      });
      API.post('/pending/delete', { id })
      .then( data => {
        if (data && data.status && data.status === 204) {
          dispatch(actions.deletePending(id));
        } else {
          let message = {type: 'error', time: Date.now(), message: 'Failed to delete pending transaction.'}
          dispatch(actions.displayMessage(message));
        }
      });
    }
    close();
  }

  let format = '$0,0.00';
  let className = (transaction.planned) ? 'planned' : 'transaction' ;
  className += (transaction.data.pending) ? ' pending' : '' ;
  className += (transaction.data.new) ? ' new' : '' ;

  return (
    <tr className={className}>
      <td headers="date">{ moment(transaction.data.date).format('MMM DD') }</td>
      <td headers="payee">{ transaction.data.name }</td>
      <td headers="category" className={ (transaction.planned)? 'planned' : '' }>
        { edit ?
          (<CategorySelect category={transaction.data.category} onChange={changeCategory} />) :
          (<span>{transaction.data.category[1] || transaction.data.category[0]}</span>)
        }
      </td>
      <td headers="amount" className={(transaction.data.amount >= 0) ? ('negative') : ('positive')}>
        { numeral(transaction.data.amount).format(format) }
      </td>
      <td headers="actions">
        { (transaction.data.pending) ?
          (<></>) : (
            edit ?
            (<button className="icon icon-close" onClick={close}>Close</button>) :
            (<button className="icon icon-edit" onClick={e => setEdit(true)}>Edit</button>)
          )
        }
      </td>
      { edit && (
          <td className="link">
            {(transaction.planned) ? (
              <div className="form-field">
                <label>Linked to planned transaction</label>
                <button className="icon icon-delete" onClick={setPlanned}>Remove Link</button>
              </div>
            ) : (
              <>
                {linkPending ? (
                  <div className="form-field">
                    <label htmlFor="select_pending">Link to pending transaction:</label>
                    <PendingSelect account={ transaction.account } onChange={setPending} />
                  </div>
                ) : (
                  <button className="icon icon-pending" onClick={e => setLinkPending(true)}>Link Pending</button>
                )}
                {linkPlanned ? (
                  <div className="form-field">
                    <label htmlFor="select_planned">Link to planned transaction:</label>
                    <PlannedSelect account={ transaction.account } value={ transaction.planned || '' }
                    onChange={setPlanned} />
                  </div>
                ) : (
                  <button className="icon icon-planned" onClick={e => setLinkPlanned(true)}>Link Planned</button>
                )}
              </>
            )}
          </td>
        )
      }
    </tr>
  );
}

export default connect()(Transaction);
