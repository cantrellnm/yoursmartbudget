import React, { useState } from 'react';
import { connect } from 'react-redux';
import CategorySelect from './CategorySelect';
import API from '../../utils/api';
import actions from '../../actions';
import MerchantInput from './MerchantInput';
import AccountSelect from './AccountSelect';
import moment from 'moment';

const PlannedForm = (props) => {
  const { dispatch, transaction, settings, label } = props;

  const [account, setAccount] = useState(transaction.account || '');
  const [payee, setPayee] = useState(transaction.payee || '');
  const [date, setDate] = useState(transaction.date || moment().format('YYYY-MM-DD'));
  const [amount, setAmount] = useState(transaction.amount || '');
  const [category, setCategory] = useState(transaction.category || []);

  const clearState = () => {
    setAccount(transaction.account || '');
    setPayee(transaction.payee || '');
    setDate(transaction.date || moment().format('YYYY-MM-DD'));
    setAmount(transaction.amount || '');
    setCategory(transaction.category || []);
  };

  const submitForm = (e) => {
    e.preventDefault();
    props.onSubmit({
      account,
      payee,
      date,
      amount,
      category
    });
    saveMerchant();
    if (!transaction.payee) clearState();
  }

  const saveMerchant = () => {
    if (!settings.merchants) settings.merchants = {};
    settings.merchants[payee] = category;
    API.post('/user/update', { settings })
    .then( data => {
      if (data && data.settings) {
        dispatch(actions.saveSettings(data.settings));
        console.log('Settings saved');
      }
    });
  }

  return (
    <form onSubmit={ submitForm }>
    {(transaction.account) ? (
      <input hidden required name="account" type="text" disabled value={account} />
    ) : (
      <fieldset>
        <div className="form-field">
          <label htmlFor="account">Account</label>
          <AccountSelect onChange={e => setAccount(e.target.value)} />
        </div>
      </fieldset>
    )}
      <fieldset>
        <div className="form-field">
          <label htmlFor="date">Date</label>
          <input required name="date" type="date" value={moment(date).format('YYYY-MM-DD')}
            onChange={e => setDate(e.target.value)} />
        </div>
        <MerchantInput value={payee} onChange={e => {
          setPayee(e.target.value);
          if (settings.merchants && settings.merchants[e.target.value]) {
            setCategory(settings.merchants[e.target.value]);
          }
        }} />
        <CategorySelect category={category} onChange={e => setCategory(e.target.value.split('|'))} />
        <div className="form-field">
          <label htmlFor="amount">Amount</label>
          <input required name="amount" type="number" min=".01" step=".01"
            value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
      </fieldset>

      <button className="icon icon-save" type="submit">{ label }</button>
    </form>
  );
}

const mapStateToProps = (state) => ({
  settings: state.settings.all
});

export default connect(mapStateToProps)(PlannedForm);
