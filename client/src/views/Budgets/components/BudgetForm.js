import React, { useState } from 'react';
import { connect } from 'react-redux';
import CategoryMultiSelect from '../../../shared/forms/CategoryMultiSelect';
import styled from 'styled-components';

const Budget = styled.form`
  fieldset p {
    text-align: right;
  }
`

const availableCategories = (all, budgeted) => {
  let categories = JSON.parse(JSON.stringify(all));
  let groups = Object.keys(categories);
  groups.forEach( group => {
    if (budgeted[group]) {
      delete categories[group];
    } else {
        Object.keys(categories[group]).forEach( subcat => {
          if (budgeted[group+'|'+subcat]) delete categories[group][subcat];
        });
    }
  });
  return categories;
};

const BudgetForm = (props) => {
  const { label, categories_all, categories_budgeted } = props;

  const [name, setName] = useState(props.name || '');
  const [amount, setAmount] = useState(props.amount || 0);
  const [categories, setCategories] = useState(props.categories || []);

  const clearState = () => {
    setName(props.name || '');
    setAmount(props.amount || 0);
    setCategories(props.categories || []);
  };

  const submitForm = (e) => {
    e.preventDefault();
    props.onSubmit({ name, amount, categories });
    if (!props.name) clearState();
  }

  return (
    <Budget onSubmit={ submitForm }>
      <fieldset>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input required name="name" type="text" value={name}
            onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="amount">Amount</label>
          <input required name="amount" type="number" min="0" step=".01"
            value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <CategoryMultiSelect categories={ availableCategories(categories_all, categories_budgeted) }
          selected={categories || []} onChange={e => {
            setCategories(Array.prototype.map.call(e.target.selectedOptions, cat => {
              return cat.split('|');
            }))
          }} />
      </fieldset>
      <button className="icon icon-save" type="submit">{ label }</button>
    </Budget>
  );
}

const mapStateToProps = (state) => ({
  categories_all: state.categories.all,
  categories_budgeted: state.categories.budgeted
});

export default connect(mapStateToProps)(BudgetForm);
