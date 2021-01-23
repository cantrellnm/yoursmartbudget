import React from 'react';
import Transaction from './Transaction';
import utils from '../../utils/budgets';

const TransactionContainer = (props) => {
  const { transactions } = props;

  return (
    <tbody>
      {
        (transactions && transactions.length > 0) ? (
          transactions.sort(utils.sortByDate).map(transaction => (
            <Transaction key={ transaction._id }
              pending={ transaction.data.pending } transaction={ transaction } />
          ))
        ) : (
          <tr><td colSpan="5">No transactions found.</td></tr>
        )
      }
    </tbody>
  );
}

export default TransactionContainer;
