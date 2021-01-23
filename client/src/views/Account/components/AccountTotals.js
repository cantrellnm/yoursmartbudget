import React, { useState } from 'react';
import numeral from 'numeral';
import utils from '../../../utils/budgets'
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
    width: ${props => (props.free > 0 ? Math.floor(props.free*100/props.available)+'%' : 0)};
    top: 0;
    right: 0;
    background: ${props => (props.free >= 0 ? 'var(--color-info-light)' : 'var(--color-warning-light)')};
  }
  div.totals div.total-free:hover, div totals div.total-free:foucs {
    z-index: 2;
  }
  div.totals div.total-pending {
    position: absolute;
    height: 100%;
    width: ${props => (props.free >= 0 ? Math.ceil(props.pending * 100 / props.available) + '%' : Math.ceil(props.pending*100/(props.set_aside+props.pending))+'%')};
    top: 0;
    left: ${props => (props.free >= 0 ? Math.ceil(props.set_aside * 100 / props.available) + '%' : Math.ceil(props.set_aside*100/(props.set_aside+props.pending))+'%')};
    background: ${props => (props.free >= 0 ? 'var(--color-table-header)' : 'var(--color-table-header)')};
  }
  div.totals div.total-set_aside {
    position: absolute;
    height: 100%;
    width: ${props => (props.free >= 0 ? Math.ceil(props.set_aside*100/props.available)+'%' : Math.ceil(props.set_aside*100/(props.set_aside+props.pending))+'%')};
    top: 0;
    left: 0;
    background: ${props => (props.free >= 0 ? 'var(--color-info-dark)' : 'var(--color-warning-dark)')};
  }
  div.total {
    z-index: 1;
  }
  div.total:hover, div.total:focus {
    z-index: 2;
    outline: solid 5px;
    outline-color: ${props => (props.free >= 0 ? 'var(--color-info-mid)' : 'var(--color-warning-mid)')};
  }
  p.text-totals {
    display: flex;
    justify-content: space-between;
  }
  span.text-total {
    display: block;
  }
  span.text-total.free {
    transform: ${props => (props.hover === 'available' ? 'scale(1.1)' : 'none')};
  }
  span.text-total.pending {
    transform: ${props => (props.hover === 'pending' ? 'scale(1.1)' : 'none')};
  }
  span.text-total.set_aside {
    transform: ${props => (props.hover === 'set_aside' ? 'scale(1.1)' : 'none')};
  }
  span.text-total:before {
    content: '';
    display: inline-block;
    width: 1rem;
    height: 1rem;
    margin-right: 5px;
  }
  span.text-total.free:before {
    background: ${props => (props.free >= 0 ? 'var(--color-info-light)' : 'var(--color-warning-light)')};
  }
  span.text-total.pending:before {
    background: ${props => (props.free >= 0 ? 'var(--color-table-header)' : 'var(--color-table-header)')};
  }
  span.text-total.set_aside:before {
    background: ${props => (props.free >= 0 ? 'var(--color-info-dark)' : 'var(--color-warning-dark)')};
  }
`

const AccountTotals = (props) => {
  const { available, set_aside, pending } = props;

  const [hover, setHover] = useState('');

  let free = ((available*100) - (set_aside*100) - (pending*100))/100;
  let format = '$0,0.00';

  return (
    <TotalsDiv free={ free } available={ available }  pending={ pending } set_aside={ set_aside } hover={ hover }>
      <div className="totals">
        { ['free', 'pending', 'set_aside'].map(name => (
          <div key={name} tabIndex="0" className={`total total-${name}`}
            onMouseEnter={ () => setHover(name) } onMouseLeave={ () => setHover('') }
            onFocus={ () => setHover(name) } onBlur={ () => setHover('') }></div>
        )) }
      </div>
      <p className="text-totals">
        <span className="text-total set_aside">Set Aside: { numeral(set_aside).format(format) }</span>
        <span className="text-total pending">Pending: { numeral(pending).format(format) }</span>
        <span className="text-total free">{(free < 0) ? `Over: ${numeral(Math.abs(free)).format(format)}` : `Free: ${numeral(free).format(format)}` }</span>
      </p>
    </TotalsDiv>
  );
}

export default AccountTotals;
