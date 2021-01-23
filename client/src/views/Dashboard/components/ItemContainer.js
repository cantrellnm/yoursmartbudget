import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import API from '../../../utils/api';
import actions from "../../../actions";
import Item from './Item.js';
import styled from 'styled-components';

const ItemsDiv = styled.div`
  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    justify-content: center;
  }
`

const ItemContainer = (props) => {

  const { dispatch, items } = props;

  const [link, setLink] = useState(null);
  const [plaidData, setPlaidData] = useState(null);

  const sendToken = (public_token, metadata) => {
    API.post('/item/new', { public_token, metadata })
    .then( data => {
      console.log(data);
      if (data && data.item) {
        dispatch(actions.newItem(data.item));
        if (data.accounts) dispatch(actions.addAccounts(data.accounts));
        if (data.balances) dispatch(actions.addBalances(data.balances));
        if (data.transactions) dispatch(actions.addTransactions(data.transactions));
        let message = {type: 'success', time: Date.now(), message: 'New connection added to ' + data.item.institution_name + '.'};
        dispatch(actions.displayMessage(message));
      }
    });
  };

  const createLink = (env) => {
    let products = env.plaid_products.split(',');
    let newLink = window.Plaid.create({
      apiVersion: 'v2',
      clientName: 'Your Smart Budget',
      env: env.plaid_environment,
      product: products,
      key: env.plaid_public_key,
      // webhook: 'https://your-domain.tld/plaid-webhook',
      onSuccess: (public_token, metadata) => { sendToken(public_token, metadata); }
    });
    setLink(newLink);
  };

  useEffect(() => {
    if (!plaidData) {
      API.get('/item/environment').then( data => {
        if (data) {
          setPlaidData(data);
          createLink(data);
        }
      });
    }
  }, [plaidData]);

  const openLink = (e) => {
    e.preventDefault();
    link.open();
  };

  return (
    <ItemsDiv>
      <h2>Connections</h2>
      <menu>
        <button className="icon icon-connect" onClick={ openLink } >Add Connection</button>
      </menu>
      { (items && items.length > 0) ? (
        <ul>
          {items.map( item => (
            <Item key={item._id} item={item} plaidData={plaidData} />
          ))}
        </ul>
      ) : (
        <p>You have no connections. Click the "Add Connection" button to connect to a bank account.</p>
      )}
    </ItemsDiv>
  );
}

const mapStateToProps = (state) => ({
  items: state.items.all
});

export default connect(mapStateToProps)(ItemContainer);
