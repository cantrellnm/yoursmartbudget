import React from 'react';
import User from './User';
import MessageContainer from './MessageContainer';
import styled from 'styled-components';

const HeaderDiv = styled.header`
  h1 a {
    color: var(--color-header-text);
    text-decoration: none;
  }
  h1 a:before {
    display: inline-block;
    width: 1em;
    height: 1em;
    margin-right: 5px;
    position: relative;
    top: 2px;
    right: 2px;
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:24px;height:24px' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M11,18H13V15.87C14.73,15.43 16,13.86 16,12A4,4 0 0,0 12,8A4,4 0 0,0 8,12C8,13.86 9.27,15.43 11,15.87V18Z' /%3E%3C/svg%3E");
  }
`

const Header = () => (
  <HeaderDiv>
    <h1><a href="/">Your Smart Budget</a></h1>
    <User />
    <MessageContainer />
  </HeaderDiv>
);

export default Header;
