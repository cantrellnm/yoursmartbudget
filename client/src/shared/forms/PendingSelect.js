import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import moment from 'moment';
import utils from '../../utils/budgets';

const PendingSelect = (props) => {
  let { account } = props;
  let { pending } = props;

  if (account) {
    pending = pending.filter(trans => trans.account === account);
  }

  const handleChange = (e) => {
    let id = (e.target.value) ? e.target.value : null;
    let selected = pending.find(trans => trans._id === id);
    if (selected) {
      props.onChange(id, selected.category);
    } else {
      props.onChange(id, []);
    }
  }

  return (
    <select id="select_pending" name="select_pending" value={ props.value } onChange={ handleChange }>
      <option value="">None</option>
      { pending.sort((a, b) => utils.sortByDate(a, b, false)).map(trans => (
        <option key={ trans._id } value={ trans._id } category={ trans.category.join('|') }>
          { moment(trans.date).format('MMM DD') }: { trans.payee } - { numeral(trans.amount).format('$0,0.00') }
        </option>
      )) }
    </select>
  );
}

const mapStateToProps = (state) => ({
  pending: state.pending.visible
});

export default connect(mapStateToProps)(PendingSelect);
