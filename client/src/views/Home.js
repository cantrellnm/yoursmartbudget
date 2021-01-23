import React from 'react';
import { connect } from "react-redux";
import LoginView from "./Login";
import DashboardView from "./Dashboard";

const HomeView = ({ user }) => {
  return !user || user.expired ? <LoginView /> : <DashboardView />;
}

const mapStateToProps = (state) => ({
    user: state.oidc.user
});

export default connect(mapStateToProps)(HomeView);
