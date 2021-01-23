import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import HeaderContainer from '../../shared/page/HeaderContainer';
import FooterContainer from '../../shared/page/FooterContainer';
import TransactionTable from '../../shared/info/TransactionTable';
import NewTransactionMenu from '../../shared/forms/NewTransactionMenu';
import AccountTotals from './components/AccountTotals';
import actions from '../../actions';
import numeral from 'numeral';
import utils from '../../utils/budgets';
import styled from 'styled-components';

const Account = styled.div`
  h3 {
    text-align: center;
  }
  .balance-summary {
    display: flex;
    justify-content: space-around;
    margin-bottom: 0;
  }
  .balance-summary .balance {
    font-size: 1.1rem;
    font-weight: 500;
  }
`

const AccountView = (props) => {
  const { location, settings, items, balances } = props;

  if (!location.state || !location.state.account) {
    return <Redirect to='/' />
  }

  const { account } = location.state;
  const item = items.find( item => item._id === account.item );
  const balance = balances.find( bal => { return bal.account === account._id; }) || {};
  let transactions = props.transactions.filter( trans => { return trans.account === account._id });
  let pending = props.pending.filter( trans => { return trans.account === account._id });
  let planned = props.planned.filter( trans => { return trans.account === account._id && !trans.complete });
  let neg_bal = ['credit', 'loan', 'mortgage'];

  return (
    <Account className="view">
      <HeaderContainer />
      <h2>{ account.mask } | { account.nickname || account.name }</h2>
      <div className="account-info">
        <h3>
          {(item) ? (
            `(${ item.institution_name }) `
          ) : (<></>)}
          <em>{ account.official_name }</em>
        </h3>
        {(balance.current) ? (
          <>
            <p className="balance-summary">
              <span className="balance">
                Balance: <span className={(neg_bal.indexOf(account.type) > -1 ? 'negative' : 'positive')}>{ numeral(balance.current).format('$0,0.00') }</span>
              </span>
              {(balance.available && balance.available !== balance.current) ?
                (<span className="balance">
                  Available: <span className='positive'>{numeral(balance.available).format('$0,0.00')}</span>
                 </span>) :
                (<></>)
              }
            </p>
            <AccountTotals available={ balance.available || balance.current } pending={ utils.totalAmount(pending) } set_aside={ utils.totalPlanned(settings.budgetStart, settings.budgetPeriod, planned) } />
          </>
        ) : (<></>)}
      </div>
      <div className="account-transactions">
        <NewTransactionMenu account={ account._id } />
        <TransactionTable transactions={ transactions } planned={ planned } pending={ pending } />
      </div>
      <FooterContainer />
    </Account>
  );
}

const mapStateToProps = (state) => ({
  user: state.oidc.user,
  settings: state.settings.all,
  items: state.items.all,
  balances: state.balances.all,
  planned: state.planned.all,
  pending: state.pending.all,
  transactions: state.transactions.all
});

export default connect(mapStateToProps)(AccountView);
