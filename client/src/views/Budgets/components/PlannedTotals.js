import React, { useState } from 'react';
import numeral from 'numeral';
import utils from '../../../utils/budgets';
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
  div.totals div.total-planned {
    position: absolute;
    height: 100%;
    width: ${props => (props.diff < 0 ? props.planned * 100 / props.set_aside + '%' : '100%')};
    top: 0;
    left: 0;
    z-index: 0;
    background: var(--color-info-light);
  }
  div.totals div.total-set_aside {
    position: absolute;
    height: 100%;
    width: ${props => (props.diff < 0 ? '100%' : props.set_aside * 100 / props.planned + '%')};
    top: 0;
    left: 0;
    z-index: 1;
    background: var(--color-info-dark);
  }
  div.total:hover, div.total:focus {
    z-index: 2;
    outline: solid 5px;
    outline-color: var(--color-info-mid);
  }
  div.date {
    position: absolute;
    height: 100%;
    width: 5px;
    top: 0;
    z-index: 5;
    background: var(--color-good-dark);
    left: ${props => (props.planned * 100 / props.set_aside + '%')};
  }
  div.date:before {
    content: 'Next';
    font-size: .8rem;
    position: absolute;
    top: -1.2rem;
    color: var(--color-good-dark);
    right: ${props => (props.planned/props.set_aside > .5 ? 0 : 'auto')};
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
  span.text-total.planned:before {
    background: var(--color-info-light);
  }
  span.text-total.set_aside:before {
    background: var(--color-info-dark);
  }

  p.summary {
    text-align: left;
    font-weight: 500;
    font-size: 1.1rem;
    margin: 1rem auto;
  }
`

const PlannedTotals = (props) => {
  const { amount, set_aside, repeating, big } = props;

  const [hover, setHover] = useState('');

  let diff = ((amount*100) - (set_aside*100)) / 100;
  let format = '$0,0.00';
  let className = repeating ? 'icon icon-refresh' : '';

  return (
    <TotalsDiv planned={ amount } set_aside={ set_aside } diff={ diff } hover={ hover } big={ big }>
      <p className={`summary ${className}`}>{ numeral(amount).format(format) } Planned</p>
      {(set_aside) ? (
        <>
          <div className="totals">
            { ['planned', 'set_aside'].map(name => (
              <div key={name} tabIndex="0" className={`total total-${name}`}
                onMouseEnter={ () => setHover(name) } onMouseLeave={ () => setHover('') }
                onFocus={ () => setHover(name) } onBlur={ () => setHover('') }></div>
            )) }
            {(diff < 0) ? (
              <div className="date"></div>
            ) : (<></>)}
          </div>
          <p className="text-totals">
            <span className="text-total set_aside">Set Aside: { numeral(set_aside).format(format) }</span>
            <span className="text-total planned">Planned: { numeral(amount).format(format) }</span>
          </p>
        </>
      ) : (<></>)}
    </TotalsDiv>
  );
};

export default PlannedTotals;
