import React, { Component } from 'react';
import { connect } from 'react-redux';

const AccountSelect = (props) => {
  const { accounts } = props;

  return (
    <select name="account" id="select_account" value={ props.value } required={ props.required }
      onChange={ props.onChange }>
      <option value=""></option>
      { accounts.filter(acc => !acc.hidden).map(acc => (
        <option key={ acc._id } value={ acc._id }>
          { acc.mask }: { acc.nickname || acc.name } ({ acc.subtype })
        </option>
      )) }
    </select>
  );
}

const mapStateToProps = (state) => ({
  accounts: state.accounts.all
});

export default connect(mapStateToProps)(AccountSelect);
