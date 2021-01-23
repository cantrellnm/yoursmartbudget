import React from 'react';
import { connect } from "react-redux";
import Message from './Message.js';
import styled from 'styled-components';

const MessagesDiv = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  ul {
    list-style-type: none;
    padding: 0;
  }
  li.error {
    background: var(--color-warning-light);
    border: solid 5px var(--color-warning-mid);
  }
  li.error button {
    background: var(--color-warning-dark);
  }
  li.notice, li.warning {
    background: var(--color-info-light);
    border: solid 5px var(--color-info-mid);
  }
  li.notice button, li.warning button {
    background: var(--color-info-dark);
  }
  li.success {
    background: var(--color-good-light);
    border: solid 5px var(--color-good-mid);
  }
  li.success button {
    background: var(--color-good-dark);
  }
`

const MessageContainer = (props) => {
  const { messages } = props;

  return (
    <MessagesDiv>
      { messages && messages.length > 0 &&
        <ul>
          { messages.map( message => (
            <Message key={message.time} message={message} />
          )) }
        </ul>
      }
    </MessagesDiv>
  );
}

const mapStateToProps = (state) => ({
  messages: state.messages.all
});

export default connect(mapStateToProps)(MessageContainer);
