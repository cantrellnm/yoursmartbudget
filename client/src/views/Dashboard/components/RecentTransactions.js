import React from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import TransactionTable from '../../../shared/info/TransactionTable';
import NewTransactionMenu from '../../../shared/forms/NewTransactionMenu';

const RecentTransactions = (props) => {
  let { pending, transactions } = props;
  let date_limit = moment().subtract(1, 'week').format('YYYY-MM-DD');
  transactions = transactions.filter(trans => (trans.data.date > date_limit));

  return (
    <div>
      <h2>Recent Transactions</h2>
      <NewTransactionMenu />
      <TransactionTable pending={ pending } transactions={ transactions } />
    </div>
  );
};

const mapStateToProps = (state) => ({
  transactions: state.transactions.visible,
  pending: state.pending.visible
});

export default connect(mapStateToProps)(RecentTransactions);
