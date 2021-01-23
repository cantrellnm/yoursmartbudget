import React from 'react';
import Pending from './Pending';
import utils from '../../utils/budgets';

const PendingContainer = (props) => {
  const { pending } = props;

  return (
    <tbody>
      {
        (pending && pending.length > 0) ? (
          pending.sort(utils.sortByDate).map(transaction => (
            <Pending key={ transaction._id } transaction={ transaction } />
          ))
        ) : (
          <tr><td colSpan="5">No transactions pending.</td></tr>
        )
      }
    </tbody>
  );
}

export default PendingContainer;
