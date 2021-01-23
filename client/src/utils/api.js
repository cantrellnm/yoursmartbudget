import { store } from '../store';
import actions from '../actions';

const api_root = (process.env.NODE_ENV === 'production') ? document.location.origin + '/api' : 'http://localhost:8000/api';
function setHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  }
}

const API = {
  get: async (path) => {
    const token = store.getState().oidc.user.id_token;
    return await fetch(api_root+path, {
      method: 'get',
      headers: setHeaders(token)
    })
    .then(res => processResponse(res))
    .then(json => {
      return (json.data) ? json.data : json;
    })
    .catch(error => {
      let message = {type: 'error', time: Date.now(), message: error};
      store.dispatch(actions.displayMessage(message));
    });
  },
  post: async (path, body) => {
    const token = store.getState().oidc.user.id_token;
    return await fetch(api_root+path, {
      method: 'post',
      body: JSON.stringify({data: body}),
      headers: setHeaders(token)
    })
    .then(res => processResponse(res))
    .then(json => {
      return (json.data) ? json.data : json;
    })
    .catch(error => { errorResponse(error) });
  },
};

async function processResponse(res) {
  if (!res.ok) throw res.statusText
  if (res.status === 204) return Promise.resolve({'status': res.status})
  return res.json();
}

function errorResponse(error) {
  let message = {type: 'error', time: Date.now(), message: `Request failed with message: ${error}`};
  store.dispatch(actions.displayMessage(message));
  return null;
}

export default API;
