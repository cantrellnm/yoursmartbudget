import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import API from '../../../utils/api';
import actions from '../../../actions';
import styled from 'styled-components';
import numeral from 'numeral';

const AccountTr = styled.tr`
  cursor: pointer;

  &:hover {
    background: var(--color-table-header);
  }
`

const Account = (props) => {
  const { dispatch, account } = props;
  let { balance } = props;

  const [redirect, setRedirect] = useState(false);
  if (redirect) {
    return (<Redirect to={{ pathname: '/account', state: { account } }} />);
  }

  const updateAccount = (values) => {
    let { hidden } = values;
    API.post('/account/update', {type: 'account', id: account._id, hidden}).then( data => {
      if (data && data.account) {
        dispatch(actions.updateAccount(data.account));
        dispatch(actions.updateTransaction({}));
        dispatch(actions.updatePlanned({}));
        dispatch(actions.updatePending({}));
        let message = {type: 'notice', time: Date.now(), message: 'Your account has been updated.'}
        dispatch(actions.displayMessage(message));
      } else {
        let message = {type: 'error', time: Date.now(), message: 'Failed to update account.'}
        dispatch(actions.displayMessage(message));
      }
    });
  }

  let neg_bal = ['credit', 'loan', 'mortgage'];
  balance = (balance) ? ((account.type === 'credit') ? balance.current : balance.available || balance.current) : undefined ;

  return (
    <AccountTr className={ `account ${props.type}` } onClick={ e => setRedirect(true) }>
      <td headers={ account.type + " mask" }>{ account.mask }</td>
      <td headers={ account.type + " subtype" }>{ account.subtype }</td>
      <td headers={ account.type + " name" }>{ account.nickname || account.name }</td>
      <td headers={ account.type + " balance" } className={(neg_bal.indexOf(account.type) > -1) ? ('negative') : ('positive')}>
        { (typeof balance !== 'undefined') ? (
          <span>{ numeral(balance).format('$0,0.00') }</span>
        ) : (
          <span>NA</span>
        )}
      </td>
      <td headers={ account.type + " actions" }>
        {(account.hidden) ? (
          <button className="icon icon-show" onClick={ (e) => { e.stopPropagation(); updateAccount({hidden: false}); } }>Show</button>
        ) : (
          <button className="icon icon-hide" onClick={ (e) => { e.stopPropagation(); updateAccount({hidden: true}); } }>Hide</button>
        )}
      </td>
    </AccountTr>
  );
}

export default connect()(Account);
