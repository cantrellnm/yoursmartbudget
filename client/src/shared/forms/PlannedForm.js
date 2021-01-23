import React, { useState } from 'react';
import FrequencySelect from './FrequencySelect';
import AccountSelect from './AccountSelect';
import moment from 'moment';
import styled from 'styled-components';

const Planned = styled.form`
  text-align: right;
  input[name="repeating"] + span {
    display: none;
  }
  input[name="repeating"]:checked + span {
    display: block;
  }
`

const PlannedForm = (props) => {
  const { transaction, label } = props;

  const [account, setAccount] = useState(transaction.account || '');
  const [payee, setPayee] = useState(transaction.payee || '');
  const [date, setDate] = useState(transaction.date || moment().format('YYYY-MM-DD'));
  const [amount, setAmount] = useState(transaction.amount || '');
  const [repeating, setRepeating] = useState((typeof transaction.repeating !== 'undefined') ? transaction.repeating : false);
  const [frequency, setFrequency] = useState(transaction.frequency || '1w');
  const [setAside, setSetAside] = useState((typeof transaction.setAside !== 'undefined') ? transaction.setAside : true);

  const clearState = () => {
    setAccount(transaction.account || '');
    setPayee(transaction.payee || '');
    setDate(transaction.date || moment().format('YYYY-MM-DD'));
    setAmount(transaction.amount || '');
    setRepeating((typeof transaction.repeating !== 'undefined') ? transaction.repeating : false);
    setFrequency(transaction.frequency || '1w');
    setSetAside((typeof transaction.setAside !== 'undefined') ? transaction.setAside : true);
  };

  const submitForm = (e) => {
    e.preventDefault();
    props.onSubmit({
      account,
      payee,
      date,
      amount,
      repeating,
      frequency,
      setAside
    });
    if (!transaction.payee) clearState();
  };

  return (
    <Planned onSubmit={ submitForm }>
      {(transaction.account) ? (
        <input hidden required name="account" type="text" disabled value={ account } />
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
        <div className="form-field">
          <label htmlFor="payee">Payee</label>
          <input required name="payee" type="text" value={payee}
            onChange={e => setPayee(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="amount">Amount</label>
          <input required name="amount" type="number" min="0" step=".01"
            value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
      </fieldset>
      <fieldset>
        <label htmlFor="setAside">Set aside money for this transaction?</label>
        <input name="setAside" type="checkbox" value="true" checked={setAside}
          onChange={e => setSetAside(e.target.checked)} />
      </fieldset>
      <fieldset>
        <label htmlFor="repeating">Will this transaction repeat?</label>
        <input name="repeating" type="checkbox" value="true" checked={repeating}
          onChange={e => setRepeating(e.target.checked)} />
        <span>
          <label htmlFor="frequency">Repeats every:</label>
          <FrequencySelect value={frequency} onChange={e => setFrequency(e.target.value)} />
        </span>
      </fieldset>

      <button className="icon icon-save" type="submit">{ label }</button>
    </Planned>
  );
}

export default PlannedForm;
