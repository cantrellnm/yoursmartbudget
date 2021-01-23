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
  div.totals div.total-free {
    position: absolute;
    height: 100%;
    width: ${props => (props.free >= 0 ? (props.free)*100/props.total + '%' : 0)};
    top: 0;
    right: 0;
    background: var(--color-good-mid);
    z-index: 0;
  }
  div.totals div.total-free:hover, div.totals div.total-free:focus {
    outline-color: var(--color-good-dark);
    z-index: 2;
  }
  div.totals div.total-planned {
    position: absolute;
    height: 100%;
    width: ${props => (props.free >= 0 ? props.planned*100/props.total + '%' : props.planned*100/(props.planned+props.budgeted+props.pending) + '%')};
    top: 0;
    left: 0;
    background: var(--color-warning-mid);
  }
  div.totals div.total-planned:hover, div.totals div.total-planned:focus {
    outline-color: var(--color-warning-dark);
  }
  div.totals div.total-budgeted {
    position: absolute;
    height: 100%;
    width: ${props => (props.free >= 0 ? props.budgeted*100/props.total + '%' : props.budgeted*100/(props.planned+props.budgeted+props.pending) + '%')};
    top: 0;
    left: ${props => (props.free >= 0 ? props.planned*100/props.total + '%' : props.planned*100/(props.planned+props.budgeted+props.pending) + '%')};
    background: var(--color-info-mid);
  }
  div.totals div.total-budgeted:hover, div.totals div.total-budgeted:focus {
    outline-color: var(--color-info-dark);
  }
  div.totals div.total-pending {
    position: absolute;
    height: 100%;
    width: ${props => (props.free >=0  ? props.pending*100/props.total + '%' : props.pending*100/(props.planned+props.budgeted+props.pending) + '%')};
    top: 0;
    left: ${props => (props.free >= 0 ? (props.planned+props.budgeted)*100/props.total + '%' : (props.planned+props.budgeted)*100/(props.planned+props.budgeted+props.pending) + '%')};
    background: var(--color-table-header);
  }
  div.totals div.total-pending:hover, div.totals div.total-pending:focus {
    outline-color: var(--color-header-bg);
  }
  div.total {
    z-index: 1;
  }
  div.total:hover, div.total:focus {
    z-index: 2;
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
  span.text-total.pending {
    transform: ${props => (props.hover === 'pending' ? 'scale(1.1)' : 'none')};
  }
  span.text-total.free {
    transform: ${props => (props.hover === 'free' ? 'scale(1.1)' : 'none')};
  }
  span.text-total:before {
    content: '';
    display: inline-block;
    width: 1rem;
    height: 1rem;
    margin-right: 5px;
  }
  span.text-total.planned:before {
    background: var(--color-warning-mid);
  }
  span.text-total.budgeted:before {
    background: var(--color-info-mid);
  }
  span.text-total.pending:before {
    background: var(--color-table-header);
  }
  span.text-total.free:before {
    background: var(--color-good-mid);
  }

  p.summary {
    text-align: left;
    font-weight: 500;
    font-size: 1.1rem;
    margin: 1rem auto;
  }
`

const AvailableTotals = (props) => {
  const { planned, total, pending } = props;
  let { budgeted } = props;

  const [hover, setHover] = useState('');

  if (budgeted < 0) budgeted = 0;
  let free = ((total*100) - (planned*100) - (budgeted*100) - (pending*100))/100;
  let format = '$0,0.00';

  return (
    <TotalsDiv planned={planned} free={free} budgeted={budgeted} pending={pending} total={total} hover={ hover }>
      <p className="summary">{ numeral(total).format(format) } Net Cash</p>
      <div className="totals">
        { ['planned', 'budgeted', 'pending', 'free' ].map(name => (
          <div key={name} tabIndex="0" className={`total total-${name}`}
            onMouseEnter={ () => setHover(name) } onMouseLeave={ () => setHover('') }
            onFocus={ () => setHover(name) } onBlur={ () => setHover('') }></div>
        )) }
      </div>
      <p className="text-totals">
        <span className="text-total planned">Set Aside: { numeral(planned).format(format) }</span>
        <span className="text-total budgeted">Budgeted: { numeral(budgeted).format(format) }</span>
        <span className="text-total pending">Pending: { numeral(pending).format(format) }</span>
        <span className="text-total free">{(free >= 0) ?
          <span>Free: <span className="positive">{numeral(free).format(format)}</span></span> :
          <span>Over: <span className="negative">{numeral(Math.abs(free)).format(format)}</span></span>
        }</span>
      </p>
    </TotalsDiv>
  );
}

export default AvailableTotals;
