import React, { Component } from 'react';
import { connect } from 'react-redux';
import utils from '../../utils/budgets';
import styled from 'styled-components';

const AccountMultiSelect = (props) => {
  const { accounts } = props;

  return (
    <select multiple name="accounts" defaultValue={ props.selected } onChange={ props.onChange }>
      { accounts.filter(acc => {
        if (props.creditOnly && !utils.isCredit(acc)) return false;
        return !acc.hidden;
      }).map(acc => (
        <option key={ acc._id } value={ acc._id }>
          { acc.mask }: { acc.nickname || acc.name } ({ acc.subtype })
        </option>)
      ) }
    </select>
  );
}

const mapStateToProps= (state) => ({
  accounts: state.accounts.all
});

export default connect(mapStateToProps)(AccountMultiSelect);
