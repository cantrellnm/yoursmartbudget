import React, { useState } from 'react';
import numeral from 'numeral';
import utils from '../../../utils/budgets';
import styled from 'styled-components';

const TotalsDiv = styled.div`
  div.totals {
    width: 100%;
    height: 2rem;
    margin: 1rem auto;
    background: var(--color-table-header);
    position: relative;
  }
  div.totals div.total-unbudgeted {
    position: absolute;
    height: 100%;
    width: ${props => (props.unbudgeted * 100 / props.total + '%')};
    top: 0;
    right: 0;
    background: var(--color-warning-dark);
  }
  div.totals div.total-unbudgeted:hover, div.totals div.total-unbudgeted:focus {
    outline-color: var(--color-warning-mid);
  }
  div.totals div.total-planned {
    position: absolute;
    height: 100%;
    width: ${props => (props.planned * 100 / props.total + '%')};
    top: 0;
    left: 0;
    background: var(--color-info-dark);
  }
  div.totals div.total-planned:hover, div.totals div.total-planned:focus {
    outline-color: var(--color-info-mid);
  }
  div.totals div.total-budgeted {
    position: absolute;
    height: 100%;
    width: ${props => (props.budgeted * 100 / props.total + '%')};
    top: 0;
    left: ${props => (props.planned * 100 / props.total + '%')};
    background: var(--color-good-dark);
  }
  div.totals div.total-budgeted:hover, div.totals div.total-budgeted:focus {
    outline-color: var(--color-good-mid);
  }
  div.total:hover, div.total:focus {
    z-index: 1;
    outline: solid 5px;
  }
  p.text-totals {
    display: flex;
    justify-content: space-between;
  }
  span.text-total {
    display: block;
  }
  span.text-total.planned {
    transform: ${props => (props.hover === 'planned' ? 'scale(1.1)' : 'none')};
  }
  span.text-total.budgeted {
    transform: ${props => (props.hover === 'budgeted' ? 'scale(1.1)' : 'none')};
  }
  span.text-total.unbudgeted {
    transform: ${props => (props.hover === 'unbudgeted' ? 'scale(1.1)' : 'none')};
  }
  span.text-total:before {
    content: '';
    display: inline-block;
    width: 1rem;
    height: 1rem;
    margin-right: 5px;
  }
  span.text-total.planned:before {
    background: var(--color-info-dark);
  }
  span.text-total.budgeted:before {
    background: var(--color-good-dark);
  }
  span.text-total.unbudgeted:before {
    background: var(--color-warning-dark);
  }

  p.summary {
    text-align: left;
    font-weight: 500;
    font-size: 1.1rem;
    margin: 1rem auto;
  }
`

const SpentTotals = (props) => {
  const { planned, unbudgeted, budgeted } = props;

  const [hover, setHover] = useState('');

  const total = ((planned*100) + (unbudgeted*100) + (budgeted*100))/100;
  const format = '$0,0.00';

  return (
    <TotalsDiv planned={planned} unbudgeted={unbudgeted} budgeted={budgeted} total={total} hover={ hover }>
      <p className="summary">{ numeral(total).format(format) } Spent</p>
      <div className="totals">
        { ['planned', 'budgeted', 'unbudgeted'].map(name => (
          <div key={name} tabIndex="0" className={`total total-${name}`}
            onMouseEnter={ () => setHover(name) } onMouseLeave={ () => setHover('') }
            onFocus={ () => setHover(name) } onBlur={ () => setHover('') }></div>
        )) }
      </div>
      <p className="text-totals">
        <span className="text-total planned">Planned: { numeral(planned).format(format) }</span>
        <span className="text-total budgeted">Budgeted: { numeral(budgeted).format(format) }</span>
        <span className="text-total unbudgeted">Unbudgeted: { numeral(unbudgeted).format(format) }</span>
      </p>
    </TotalsDiv>
  );
};

export default SpentTotals;
