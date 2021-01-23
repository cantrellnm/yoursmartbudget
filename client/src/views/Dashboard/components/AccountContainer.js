import React, { Fragment, useState } from 'react';
import { connect } from "react-redux";
import Account from './Account';
import utils from '../../../utils/budgets';
import styled from 'styled-components';
import numeral from 'numeral';

const Accounts = styled.div`
  margin-bottom: 2rem;

  .balance-summary {
    display: flex;
    justify-content: space-around;
  }
  .balance-summary .balance {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
  tr.hidden {
    background: var(--color-table-header);
  }
  tr.hidden:hover {
    background: var(--color-header-bg);
    color: var(--color-header-text);
  }
  td {
    padding: 1rem 5px;
  }
  td[headers~="actions"] {
    text-align: right;
  }

  @media (max-width: 500px) {
    tr.account {
      display: grid;
      grid-template-columns: 15% 55% 30%;
      grid-template-rows: 50% 50%;
      grid-template-areas:
        "mask name balance"
        "mask type actions"
    }
    tr.account {
      padding: 1rem 5px;
    }
    td {
      padding: 0;
    }
    td[headers~="mask"] { grid-area: mask; }
    td[headers~="name"] { grid-area: name; }
    td[headers~="subtype"] { grid-area: type; }
    td[headers~="balance"] { grid-area: balance; text-align: right; }
    td[headers~="actions"] { grid-area: actions; }
  }
`

const sortAccounts = (a, b) => {
  let order = ['checking', 'paypal', 'prepaid', 'savings', 'money market', 'cd'];
  if (order.indexOf(a.subtype) < order.indexOf(b.subtype)) return -1;
  if (order.indexOf(a.subtype) > order.indexOf(b.subtype)) return 1;
  return 0;
};

const AccountContainer = (props) => {
  const { accounts, balances, items } = props;

  const [showHidden, setShowHidden] = useState(false);

  const listAccounts = (accounts, accType) => (
    accounts.map(account => {
      let balance = balances.find( bal => { return bal.account === account._id; });
      let item = items.find( item => item._id === account.item );
      return (
        <Account key={ account._id } type={ accType }
          account={ account } balance={ balance } item={ item } />
      );
    })
  );

  let hidden = accounts.filter( acc => acc.hidden );
  let balanceSummary = utils.balanceSummary(accounts, balances);

  return (
    <Accounts>
      <h2>Accounts</h2>
      {(balances && balances.length) ? (
        <div className="balance-summary">
          <span className="balance">Cash: <span className="positive">{numeral(balanceSummary.cash).format('$0,0.00')}</span></span>
          <span className="balance">Credit: <span className="negative">{numeral(balanceSummary.credit).format('$0,0.00')}</span></span>
        </div>
      ) : (<></>)}
      <table>
        <thead>
          <tr>
            <th scope='col' id="mask">Mask</th>
            <th scope='col' id="subtype">Type</th>
            <th scope='col' id="name">Name</th>
            <th scope='col' id="balance">Balance</th>
            <th scope='col' id="actions">Balance</th>
          </tr>
        </thead>
        <tbody>
          { (accounts && accounts.length) ? (
            <>
              {
                ['depository', 'credit', 'loan', 'mortgage', 'brokerage', 'other'].map(accType => {
                  let filtered = accounts.filter( acc => acc.type === accType && !acc.hidden );
                  if (!filtered || filtered.length === 0) return (<Fragment key={accType} />);
                  return (
                    <Fragment key={accType}>
                      <tr><th colSpan="5" scope="colgroup">{ accType }</th></tr>
                      { listAccounts(filtered.sort(sortAccounts), accType) }
                    </Fragment>
                  );
                })
              }
              { (hidden.length) ? (
                <>
                  <tr className={'toggle-hidden ' + showHidden} onClick={e => setShowHidden(!showHidden)}><th colSpan="5">hidden</th></tr>
                  {(showHidden) ? (
                    listAccounts(hidden, 'hidden')
                  ) : (<></>)}
                </>
              ) : (<></>) }
            </>
          ) : (
            <tr><td colSpan="5">No accounts found. Try refreshing your connections.</td></tr>
          )}
        </tbody>
      </table>
    </Accounts>
  );
}

const mapStateToProps = (state) => ({
  accounts: state.accounts.all,
  balances: state.balances.all,
  items: state.items.all
});

export default connect(mapStateToProps)(AccountContainer);
