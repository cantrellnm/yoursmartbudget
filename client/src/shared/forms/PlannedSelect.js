import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import moment from 'moment';
import utils from '../../utils/budgets';
import styled from 'styled-components';

const PlannedSelect = (props) => {
  const { account } = props;
  let { planned } = props;

  if (account) {
    planned = planned.filter(trans => trans.account === account);
  }

  return (
    <select id="select_planned" value={ props.value } onChange={ props.onChange }>
      <option value="">None</option>
      { planned.filter(trans => !trans.complete || trans._id === props.value)
        .sort((a, b) => utils.sortByDate(a, b, false)).map(trans => (
          <option key={ trans._id } value={ trans._id }>
            { moment(trans.date).format('MMM DD') }: { trans.payee } - { numeral(trans.amount).format('$0,0.00') }
          </option>
        )) }
    </select>
  );
}

const mapStateToProps = (state) => ({
  planned: state.planned.visible
});

export default connect(mapStateToProps)(PlannedSelect);
