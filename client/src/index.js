import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
import { store, history } from './store';
import userManager from './utils/userManager';
import './index.scss';
import App from './App';
// import * as serviceWorker from './serviceWorker';

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
        <OidcProvider store={store} userManager={userManager}>
          <App history={history} />
        </OidcProvider>
    </Provider>,
    document.getElementById('root')
  );
};

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
