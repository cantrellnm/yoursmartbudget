import React from 'react';
import TransactionContainer from './TransactionContainer';
import PlannedContainer from './PlannedContainer';
import PendingContainer from './PendingContainer';
import utils from '../../utils/budgets';
import styled from 'styled-components';

const Transactions = styled.table`
  text-align: left;
  margin: 1rem auto;

  tr.transaction, tr.planned, tr.pending {
    display: grid;
    grid-template-columns: 1fr 3fr 3fr 1fr 1.5fr;
    grid-template-rows: auto auto;
  }

  tr.planned td[colSpan="4"], tr.pending td[colSpan="4"] {
    grid-area: 1 / 1 / 2 / 5 ;
  }

  tr.new td[headers="payee"]:before {
    content: 'NEW ';
    font-weight: bold;
    color: var(--color-warning-dark);
  }

  td[headers="category"] select {
    width: 100%;
  }

  td[headers="category"] span {
    margin: 0;
  }
  tr.planned td[headers="category"].planned:after {
    width: 1.5em;
    height: 1.5em;
    margin-left: 5px;
    display: inline-block;
    vertical-align: text-top;
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:24px;height:24px' viewBox='0 0 24 24'%3E%3Cpath fill='%23696969' d='M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z' /%3E%3C/svg%3E");
  }
  td[headers="amount"], td[headers="actions"] {
    text-align: right;
  }
  td.link {
    display: block;
    padding-top: 0;
    margin-top: -5px;
    margin-bottom: 5px;
    grid-area: 2 / 1 / 3 / 6;
  }

  @media (max-width: 650px) {
    tr.transaction, tr.planned, tr.pending {
      border-top: solid 1px var(--color-header-bg);
      display: grid;
      padding: 5px 0;
      grid-template-columns: 3fr 1fr;
      grid-template-rows: repeat(3, auto);
      grid-gap: 5px;
      grid-template-areas:
        "payee    date"
        "category amount"
        "link  actions";
    }
    tr.planned td[colSpan="4"], tr.pending td[colSpan="4"] {
      grid-area: 2 / 1 / 4 / 4 ;
    }
    td[colSpan="4"] + td[headers="actions"] {
      grid-area: date;
    }
    td {
      padding: 0;
    }
    td[headers="payee"] {
      grid-area: payee;
    }
    td[headers="date"] {
      grid-area: date;
      text-align: right;
    }
    td[headers="amount"] {
      grid-area: amount;
      text-align: right;
    }
    td[headers="actions"] {
      text-align: right;
      grid-area: actions;
    }
    td.link {
      margin-top: 0;
      margin-bottom: 0;
      grid-area: link;
    }
  }
`

const TransactionTable = (props) => {
  const transactions = props.transactions || [];
  const planned = props.planned || [];
  const pending = props.pending || [];

  return (
    <Transactions>
      <thead>
        <tr>
          <th scope='col'>Date</th>
          <th scope='col'>Payee</th>
          <th scope='col'>Category</th>
          <th scope='col'>Amount</th>
          <th scope='col'>Actions</th>
        </tr>
      </thead>
      {
        (planned.length) ? (
          <PlannedContainer planned={ planned } />
        ) : (
          <tbody><tr><td colSpan="5"></td></tr></tbody>
        )
      }
      {
        (pending.length) ? (
          <PendingContainer pending={ pending } />
        ) : (
          <tbody><tr><td colSpan="5"></td></tr></tbody>
        )
      }
      {
        (transactions.length) ? (
          <TransactionContainer transactions={ transactions } />
        ) : (
          <tbody><tr><td colSpan="5"></td></tr></tbody>
        )
      }
      {
        (!planned.length && !pending.length && !transactions.length) ? (
          <tbody><tr><td colSpan="5"><p>No transactions found.</p></td></tr></tbody>
        ) : (<></>)
      }
    </Transactions>
  );
}

export default TransactionTable;
