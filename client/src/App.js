import React from 'react';
import PropTypes from 'prop-types';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { persistor } from './store';
import LoadingView from './views/Loading';
import routes from './routes';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

const App = ({ history }) => {
  return (
    <PersistGate loading={<LoadingView />} persistor={persistor}>
      <ConnectedRouter history={history}>
        { routes }
      </ConnectedRouter>
    </PersistGate>
  );
};

App.propTypes = {
  history: PropTypes.object,
};

export default App;
