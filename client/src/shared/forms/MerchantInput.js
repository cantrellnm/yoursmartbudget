import React, { useState } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import styled from 'styled-components';

const Merchant = styled.div`
  .suggestions {
    position: absolute;
    width: 100%;
    top: 100%;
    text-align: left;
    border: solid 1px black;
    background: white;
    z-index: 100;
    overflow-y: scroll;
  }
  .suggestion {
    cursor: pointer;
    padding: 5px;
  }
  .suggestion:hover {
    background: var(--color-table-header);
  }
`

const MerchantInput = (props) => {
  const { settings } = props;

  const [value, setValue] = useState(props.value || '');
  const [suggestions, setSuggestions] = useState([]);

  const chooseSuggestion = (suggestion) => {
    setValue(suggestion);
    setSuggestions([]);
    props.onChange({target: {name: 'payee', value: suggestion}});
  }

  const searchMerchants = (e) => {
    let search = e.target.value;
    if (search) {
      let merchants = settings.merchants;
      if (merchants) {
        let names = Object.keys(merchants);
        let results = names.filter( n => (n.toUpperCase().indexOf(search.toUpperCase()) > -1));
        if (results.length) {
          setSuggestions(results.length === 1 && results[0] === search ? [] : results);
        } else {
          setSuggestions([]);
        }
      }
    }
  }

  const changeValue = (e) => {
    setValue(e.target.value);
    props.onChange(e);
    searchMerchants(e);
  }

  return (
    <Merchant className="form-field">
      <label htmlFor="payee">Payee</label>
      <input required type="text" name="payee" value={ value } autoComplete="off" onChange={ changeValue } onBlur={e => setSuggestions([])}  />
      {suggestions.length ? (
        <div className="suggestions">
          {suggestions.map(sug => (
            <div key={sug} className="suggestion" onMouseDown={ () => chooseSuggestion(sug) }>
              {sug}
            </div>
          ))}
        </div>
      ) : (<></>)}
    </Merchant>
  );
}

const mapStateToProps = (state) => ({
  settings: state.settings.all
});

export default connect(mapStateToProps)(MerchantInput);
