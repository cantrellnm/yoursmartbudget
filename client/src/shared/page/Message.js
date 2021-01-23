import React, { useEffect } from 'react';
import { connect } from "react-redux";
import actions from "../../actions";
import styled from 'styled-components';

const MessageLi = styled.li`
  padding: 0 1rem;
  display: flex;
  p {
    flex: 1 0;
  }
  menu {
    flex: 0 0;
  }
  button {
    margin: 0 5px;
  }
`

const Message = (props) => {
  const { dispatch, message } = props;

  useEffect(() => {
    if (message.type === 'error') {
      setTimeout(dispatch, 10000, actions.closeMessage(message));
    } else {
      setTimeout(dispatch, 5000, actions.closeMessage(message));
    }
  });

  const removeMessage = () => {
    dispatch(actions.closeMessage(message));
  }

  const undoAction = () => {
    clearTimeout(message.timer);
    let notice = {type: 'notice', time: Date.now()};
    notice.message = message.cancelMessage || 'Action has been cancelled.';
    removeMessage(message);
    dispatch(actions.displayMessage(notice));
  }

  return (
    <MessageLi className={ 'message ' + message.type }>
      <p>
        { message.message.toString() }
      </p>
      <menu>
        { message.timer ? (
          <button onClick={ undoAction }>Undo</button>
        ) : (
          <button onClick={ removeMessage }>Close</button>
        ) }
      </menu>
    </MessageLi>
  );
}

const mapStateToProps = (state) => ({
  messages: state.messages.all
});

export default connect(mapStateToProps)(Message);
