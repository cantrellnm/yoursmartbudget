import React, { useState } from 'react';
import API from '../../utils/api';
import { connect } from 'react-redux';
import actions from '../../actions';
import moment from 'moment';
import AccountMultiSelect from './AccountMultiSelect';
import CategoryMultiSelect from './CategoryMultiSelect';
import styled from 'styled-components';

const Settings = styled.form`
  fieldset {
    text-align: right;
    margin-bottom: 1rem;
  }
  select[name="period"] {
    min-width: 8rem;
  }
  legend.toggle-hidden {
    padding: 5px;
    cursor: pointer;
  }
  ul.merchants {
    margin-top: 0;
    padding-left: 0;
    list-style-type: none;
  }
  li.merchant span:first-of-type {
    margin-right: 10px;
  }
`

const SettingsForm = (props) => {
  const { dispatch, categories } = props;
  let { settings } = props;
  if (!settings.credit) settings.credit = {};

  const [showPayees, setShowPayees] = useState(false);
  const [budgetPeriod, setBudgetPeriod] = useState(settings.budgetPeriod.join('|') || '1|month');
  const [budgetStart, setBudgetStart] = useState(settings.budgetStart || moment().startOf('month').format('YYYY-MM-DD'));
  const [merchants, setMerchants] = useState(settings.merchants || {});
  const [creditAccounts, setCreditAccounts] = useState(settings.credit.accounts || []);
  const [creditCategories, setCreditCategories] = useState(settings.credit.categories || []);
  const [transferCategories, setTransferCategories] = useState(settings.transferCategories || []);

  // setValues(e) {
  //   if (e.target.name === 'period') this.setState({budgetPeriod: e.target.value})
  //   if (e.target.name === 'start') this.setState({budgetStart: e.target.value})
  //   if (e.target.name === 'accounts') {
  //     let accounts = Array.prototype.map.call(e.target.selectedOptions, acc => {return acc.value});
  //     this.setState({creditAccounts: accounts});
  //     if (!this.state.creditAccounts.length) this.setState({creditCategories: []});
  //   }
  //   if (e.target.name === 'credit_cat') {
  //     let categories = Array.prototype.map.call(e.target.selectedOptions, cat => {
  //       return cat.split('|');
  //     });
  //     this.setState({creditCategories: categories});
  //   }
  //   if (e.target.name === 'transfer_cat') {
  //     let categories = Array.prototype.map.call(e.target.selectedOptions, cat => {
  //       return cat.split('|');
  //     });
  //     this.setState({transferCategories: categories});
  //   }
  // }

  const removeMerchant = (e, name) => {
    e.preventDefault();
    if (merchants[name]) {
      let changed = {...merchants};
      delete changed[name];
      setMerchants(changed);
    }
  };

  const saveSettings = (e) => {
    e.preventDefault();
    let changed = {
      budgetPeriod: budgetPeriod.split('|'),
      budgetStart,
      merchants,
      credit: { accounts: creditAccounts, categories: creditCategories },
      transferCategories
    };
    API.post('/user/update', { settings: changed })
    .then( data => {
      if (data && data.settings) {
        dispatch(actions.saveSettings(data.settings));
        let message = {type: 'success', time: Date.now(), message: 'Settings saved.'};
        dispatch(actions.displayMessage(message));
        props.onSubmit();
      }
    });
  };

  // togglePayees() {
  //   this.setState({showPayees: !this.state.showPayees});
  // }

  return (
    <Settings onSubmit={saveSettings}>
      <fieldset>
        <legend>Budgets</legend>
        <div className="form-field">
          <label htmlFor="period">Budget Period</label>
          <select id="period" name="period" value={budgetPeriod}
            onChange={e => setBudgetPeriod(e.target.value)}>
            <option value="1|month">Month</option>
            <option value="4|weeks">4 Weeks</option>
            <option value="2|weeks">2 Weeks</option>
            <option value="1|weeks">1 Weeks</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="start">Budget Start</label>
          <input id="start" name="start" type="date" value={budgetStart}
            onChange={e => setBudgetStart(e.target.value)}
            min={ moment().subtract(parseInt(budgetPeriod[0]), budgetPeriod.split('|')[1]).add(1, 'days').format('YYYY-MM-DD') }
            max={ moment().format('YYYY-MM-DD') } />
        </div>
      </fieldset>
      <fieldset>
        <legend>Credit</legend>
        <div className="form-field">
          <label>Remove credit balance from available cash</label>
          <AccountMultiSelect creditOnly="true" selected={creditAccounts}
            onChange={e => {
              let accounts = Array.prototype.map.call(e.target.selectedOptions, acc => acc.value);
              setCreditAccounts(accounts);
              if (!accounts.length) setCreditCategories([]);
            }} />
        </div>
        { creditAccounts.length ? (
          <CategoryMultiSelect categories={categories} selected={creditCategories}
            onChange={e => {
              setCreditCategories(Array.prototype.map.call(e.target.selectedOptions, cat => cat.split('|')));
            }}
            name="credit_cat" label="Transaction categories to ignore as payments" />
        ) : (<></>)}
      </fieldset>
      <fieldset>
        <legend>Transfer</legend>
        <CategoryMultiSelect categories={ categories } selected={ transferCategories }
          onChange={e => {
            setTransferCategories(Array.prototype.map.call(e.target.selectedOptions, cat => cat.split('|')));
          }}
          name="transfer_cat" label="Transaction categories to ignore as transfers" />
      </fieldset>
      <fieldset>
        <legend className={`toggle-hidden ${showPayees}`} onClick={e => setShowPayees(!showPayees)}>Past Payees</legend>
        { showPayees ? (
          <ul className="merchants">
            { Object.keys(merchants).map(name => (
              <li key={name} className="merchant">
                <span>{name}:</span>
                <span className="category">{merchants[name][1] || merchants[name][0]}</span>
                <button className="icon icon-delete" type="button" onClick={(e) => removeMerchant(e, name)}>Delete</button>
              </li>
            )) }
          </ul>
        ) : (<></>)}
      </fieldset>
      <button className="icon icon-save" type="submit">Save</button>
    </Settings>
  );
}

const mapStateToProps = (state) => ({
  settings: state.settings.all,
  categories: state.categories.all
});

export default connect(mapStateToProps)(SettingsForm);
