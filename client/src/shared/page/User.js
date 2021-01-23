import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from "react-router-dom";
import userManager from '../../utils/userManager';
import API from '../../utils/api';
import actions from '../../actions';
import SettingsForm from '../forms/SettingsForm';
import utils from '../../utils/budgets';
import styled from 'styled-components';

const UserDiv = styled.div`
  display: flex;
  @media (max-width: 500px) {
    flex-direction: column;
  }
  p {
    flex-grow: 0;
  }
  menu p {
    text-align: right;
  }
  menu {
    flex-grow: 1;
  }
`

const User = (props) => {
  const { user } = props;

  const [open, setOpen] = useState(false);

  if (!user) {
    return <Redirect to='/' />
  }

  return (
    <UserDiv>
      <p>Signed in {user ? " as " + user.profile.name : ""}</p>
      <menu>
        <button
          className="icon icon-power"
          onClick={e => {
            e.preventDefault();
            userManager.removeUser(); // removes the user data from sessionStorage
          }} >
          Logout
        </button>
        { open ? (
          <>
            <button className="icon icon-close" onClick={e => setOpen(false)}>Close</button>
            {
              //<p><Link to={{ pathname: '/categories' }}>Transaction Categories</Link></p>
            }
            <SettingsForm onSubmit={e => setOpen(false)} />
          </>
        ) : (
          <button className="icon icon-settings" onClick={e => setOpen(true)}>Settings</button>
        )}
      </menu>
    </UserDiv>
  );
}

const mapStateToProps = (state) => ({
  user: state.oidc.user
});

export default connect(mapStateToProps)(User);
