import React from 'react';
import HeaderContainer from '../shared/page/HeaderContainer';
import FooterContainer from '../shared/page/FooterContainer';
import userManager from '../utils/userManager';
import styled from 'styled-components';

const LoginDiv = styled.div`
  flex-grow: 1;
  button {
    display: block;
    margin: auto;
  }
`

const LoginView = () => (
  <div className="view">
    <HeaderContainer />
    <LoginDiv>
      <h2>Welcome!</h2>
      <button onClick={e => {
        e.preventDefault();
        userManager.signinRedirect();
      }}>Login with Google</button>
    </LoginDiv>
    <FooterContainer />
  </div>
);

export default LoginView;
