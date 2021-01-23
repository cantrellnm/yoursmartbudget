import React from 'react';
import moment from 'moment';
import numeral from 'numeral';
import utils from '../../../utils/budgets';
import styled from 'styled-components';

const SummaryDiv = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding-bottom: 1rem;
  h3 {
    font-weight: normal;
    flex: 1 0 100%;
  }
  h3 label {
    font-weight: bold;
  }
  h4 {
    flex-grow: 1;
  }
  .field-group label {
    right: 1rem;
  }
`

const BudgetSummary = (props) => {
  const { settings, nextBudgetStart, budgeted, set_aside } = props;
  let format = '$0,0.00';

  return (
    <SummaryDiv>
      <h3>
        <label>Current Budget:</label>
        {( settings.budgetPeriod[1] === 'month' ) ?
          ( '1 Month' ) :
          ( parseInt(settings.budgetPeriod[0]) + ' Week(s)' )} starting { moment(settings.budgetStart).format('MMM D')
        }
      </h3>
      <h4>Next Budget:</h4>
      <div className="field-group">
        <label>Starts</label>
        <span>{ moment(nextBudgetStart).format('MMM D') }</span>
      </div>
      <div className="field-group">
        <label>Set Aside</label>
        <span>{ numeral(set_aside).format(format) }</span>
      </div>
      <div className="field-group">
        <label>Budgeted</label>
        <span>{ numeral(budgeted).format(format) }</span>
      </div>
    </SummaryDiv>
  );
};

export default BudgetSummary;
