import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import API from '../../../utils/api';
import actions from '../../../actions';
import Moment from 'react-moment';
import moment from 'moment';
import styled from 'styled-components';

const ItemLi = styled.li`
  text-align: center;
  margin: 0 1rem;
  h4 {
    background: var(--color-table-header);
    color: var(--color-table-header-text);
    text-align: center;
    padding: 2rem 10px;
    margin: 0;
    cursor: default;
  }
  menu {
    text-align: center;
  }
`

const Item = (props) => {

  const { dispatch, item, accounts, balances, settings, plaidData } = props;
  const id = item._id;

  const refreshItem = () => {
    API.post('/item/refresh', {type: 'item', id, date: settings.budgetStart}).then( data => {
      if (data && data.item) {
        if (data.accounts) dispatch(actions.refreshAccounts(data.accounts));
        if (data.balances) dispatch(actions.refreshBalances(data.balances));
        if (data.transactions) dispatch(actions.refreshTransactions(data.transactions));
        dispatch(actions.updateItem(data.item));
        if (data.errors) {
          let message = {type: 'error', time: Date.now(), message: data.errors[0]}
          dispatch(actions.displayMessage(message));
        } else {
          let message = {type: 'notice', time: Date.now(), message: `Your ${item.institution_name} account information has been refreshed.`}
          dispatch(actions.displayMessage(message));
        }
      } else {
        let message = {type: 'error', time: Date.now(), message: `Failed to refresh ${item.institution_name} accounts.`}
        dispatch(actions.displayMessage(message));
      }
    });
  };

  const createLink = (public_token) => {
    if (plaidData) {
      const link = window.Plaid.create({
        apiVersion: 'v2',
        clientName: 'Your Smart Budget',
        env: plaidData.plaid_environment,
        product: plaidData.plaid_products.split(','),
        key: plaidData.plaid_public_key,
        token: public_token,
        // webhook: 'https://your-domain.tld/plaid-webhook',
        onSuccess: (public_token, metadata) => {
          // refresh item (access token hasn't changed)
          refreshItem();
        }
      }).open();
    } else {
      console.log('Missing Plaid data, unable to update Item.')
    }
  };

  const getToken = () => {
    API.post('/item/update', { id }).then( data => {
      if (data && data.public_token) createLink(data.public_token);
    });
  };

  useEffect(() => {
    if (accounts[id] && accounts[id].length && (!balances[id]  || !balances[id].length)) {
      refreshItem();
    }
  }, []);

  const deleteItem = () => {
    API.post('/item/delete', {type: 'item', id}).then( data => {
      if (data && data.status && data.status === 204) {
        let message = {type: 'notice', time: Date.now(), message: `Your connection to ${item.institution_name} has been deleted.`}
        dispatch(actions.deleteItem(id));
        deleteAccounts();
        dispatch(actions.displayMessage(message));
      } else {
        let message = {type: 'error', time: Date.now(), message: 'Failed to delete connection.'}
        dispatch(actions.displayMessage(message));
      }
    });
  }

  const pendingDelete = () => {
    let timer = setTimeout(deleteItem, 10000);
    let message = {type: 'warning', time: Date.now(),
      message: `Your connection to ${item.institution_name} is about to be deleted, would you like to undo this action?`,
      cancelMessage: 'Got it. Your connection will not be deleted.',
      timer
    }
    dispatch(actions.displayMessage(message));
  };

  const deleteAccounts = () => {
    accounts[id]
      .forEach( acc => {
        dispatch(actions.removeBalances(acc._id));
        dispatch(actions.removeTransactions(acc._id));
      });
    dispatch(actions.removeAccounts(id));
  };

  return (
    <ItemLi>
      <h4>{ item.institution_name }</h4>
      <p>Refreshed <Moment fromNow>{ item.refreshed }</Moment></p>
      <menu>
        {(moment(item.refreshed) < moment().subtract(5, 'minutes') && !item.loginRequired) ? (
          <button className="icon icon-refresh" onClick={ refreshItem }>Refresh</button>
        ) : (<></>)}
        {(item.loginRequired) ? (
          <button className="icon icon-refresh color" onClick={ getToken }>Log In</button>
        ) : (<></>)}
        <button className="icon icon-delete" onClick={ pendingDelete }>Delete</button>
      </menu>
    </ItemLi>
  );
}

const mapStateToProps = (state) => ({
  settings: state.settings.all,
  accounts: state.accounts.items,
  balances: state.balances.items,
});

export default connect(mapStateToProps)(Item);
