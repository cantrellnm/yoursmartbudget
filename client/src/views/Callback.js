import React from 'react';
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import { push } from "connected-react-router";
import userManager from "../utils/userManager";

const CallbackView = ({ dispatch }) => (
  <CallbackComponent
    userManager={userManager}
    successCallback={() => dispatch(push("/"))}
    errorCallback={error => {
      dispatch(push("/"));
      console.error(error);
    }}
    >
    <div>Redirecting...</div>
  </CallbackComponent>
);

export default connect()(CallbackView);
