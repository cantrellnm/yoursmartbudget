import React, { useState } from 'react';
import Planned from './Planned';
import utils from '../../utils/budgets';
import styled from 'styled-components';

const PlannedContainer = (props) => {
  const { planned } = props;
  const [open, setOpen] = useState(false);

  return (
    <tbody>
      {
        (planned && planned.length > 0) ? (
          <>
            <tr className={'toggle-hidden ' + open} onClick={e => setOpen(!open)}>
              <th colSpan="5">planned</th>
            </tr>
            {(open) ? (
              planned.sort(utils.sortByDate).map(transaction => (
                <Planned key={ transaction._id } transaction={ transaction } />
              ))
            ) : (<></>)}
          </>
        ) : (
          <tr><td colSpan="5">No transactions planned.</td></tr>
        )
      }
    </tbody>
  );
}

export default PlannedContainer;
