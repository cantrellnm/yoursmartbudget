import React, { useState } from 'react';
import numeral from 'numeral';
import utils from '../../utils/budgets';
import styled from 'styled-components';

const TotalsDiv = styled.div`
  background-color: ${props => (props.big ? 'var(--color-table-header)' : 'none')};
  margin-bottom: 1rem;
  div.totals {
    width: 100%;
    height: ${props => (props.big ? '3rem' : '2rem')};
    margin: 1rem auto;
    background: var(--color-table-header);
    position: relative;
  }
  div.today, div.budgeted {
    position: absolute;
    height: 100%;
    width: 5px;
    top: 0;
    z-index: 5;
    background: var(--color-info-dark);
  }
  div.today {
    left: ${props => (props.free >= 0 ? props.today + '%' : props.today * props.budgeted/(props.spent+props.pending) + '%')};
  }
  div.budgeted {
    left: ${props => (props.budgeted*100/(props.spent+props.pending) + '%')};
  }
  div.today:before, div.budgeted:before {
    font-size: .8rem;
    position: absolute;
    top: -1.2rem;
    color: var(--color-info-dark);
  }
  div.today:before {
    content: 'Today';
    top: 100%;
    right: ${props => (props.today > 50 ? 0 : 'auto')};
  }
  div.budgeted:before {
    content: 'Budgeted';
    right: ${props => ((props.budgeted/(props.spent+props.pending) > .5) ? 0 : 'auto')};
  }
  div.totals div.total-free {
    position: absolute;
    height: 100%;
    width: ${props => (props.free > 0 ? props.free*100/props.budgeted + '%' : 0)};
    top: 0;
    right: 0;
    background: ${props => (props.free < 0 ? 'var(--color-warning-light)' : 'var(--color-good-light)')};
  }
  div.totals div.total-pending {
    position: absolute;
    height: 100%;
    width: ${props => (props.free > 0 ? props.pending*100/props.budgeted + '%' : props.pending*100/(props.spent+props.pending) + '%')};
    top: 0;
    left: ${props => (props.free > 0  ? props.spent*100/props.budgeted + '%' : props.spent*100/(props.spent+props.pending) + '%')};
    background: var(--color-header-bg);
  }
  div.totals div.total-spent {
    position: absolute;
    height: 100%;
    width: ${props => (props.free > 0 ? props.spent*100/props.budgeted + '%' : props.spent*100/(props.spent+props.pending) + '%')};
    top: 0;
    left: 0;
    background: ${props => (props.free < 0 ? 'var(--color-warning-dark)' : 'var(--color-good-dark)')};
  }
  div.total {
    z-index: 1;
  }
  div.total:hover, div.total:focus {
    z-index: 2;
    outline: solid 5px;
    outline-color: ${props => (props.free < 0 ? 'var(--color-warning-mid)' : 'var(--color-good-mid)')};
  }
  p.text-totals {
    display: flex;
    justify-content: space-between;
  }
  span.text-total {
    display: block;
  }
  span.text-total.free {
    transform: ${props => (props.hover === 'free' ? 'scale(1.1)' : 'none')};
  }
  span.text-total.pending {
    transform: ${props => (props.hover === 'pending' ? 'scale(1.1)' : 'none')};
  }
  span.text-total.spent {
    transform: ${props => (props.hover === 'spent' ? 'scale(1.1)' : 'none')};
  }
  span.text-total:before {
    content: '';
    display: inline-block;
    width: 1rem;
    height: 1rem;
    margin-right: 5px;
  }
  span.text-total.free:before {
    background: ${props => (props.free < 0 ? 'var(--color-warning-light)' : 'var(--color-good-light)')};
  }
  span.text-total.pending:before {
    background: var(--color-header-bg);
  }
  span.text-total.spent:before {
    background: ${props => (props.free < 0 ? 'var(--color-warning-dark)' : 'var(--color-good-dark)')};
  }

  p.summary {
    text-align: left;
    font-weight: 500;
    font-size: 1.1rem;
    margin: 1rem auto;
  }
`

const BudgetTotals = (props) => {
  const { budgeted, spent, pending, today } = props;
  const [hover, setHover] = useState('');
  const free = ((budgeted*100) - (spent*100) - (pending*100))/100
  let format = '$0,0.00';

  return (
    <TotalsDiv budgeted={ budgeted } spent={ spent } pending={ pending } free={ free }
    today={ today } hover={ hover } big={ props.big }>
      <p className="summary">{ numeral(budgeted).format(format) } Budgeted</p>
      <div className="totals">
        {['spent', 'pending', 'free'].map(name => (
          <div key={name} tabIndex="0" className={`total total-${name}`}
            onMouseEnter={ () => setHover(name) } onMouseLeave={ () => setHover('') }
            onFocus={ () => setHover(name) } onBlur={ () => setHover('') }></div>
        ))}
        {(today) ? (<div className="today"></div>) : (<></>)}
        {(free < 0) ? (<div className="budgeted"></div>) : (<></>)}
      </div>
      <p className="text-totals">
        <span className="text-total spent">Spent: { numeral(spent).format(format) }</span>
        <span className="text-total pending">Pending: { numeral(pending).format(format) }</span>
        <span className="text-total free">
        {(free >= 0) ?
          <span>Free: <span className="positive">{ numeral(free).format(format) }</span></span> :
          <span>Over: <span className="negative">{numeral(Math.abs(free)).format(format)}</span></span>
        }
        </span>
      </p>
    </TotalsDiv>
  );
}

export default BudgetTotals;
