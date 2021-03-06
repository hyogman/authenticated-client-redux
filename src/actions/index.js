import axios from 'axios';
import { browserHistory } from 'react-router';
import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, FETCH_MESSAGE } from './types';

const ROOT_URL = 'http://localhost:3090';

export function signinUser({ email, password }) {
  return function(dispatch) {
    // submit email/password to the server
    axios.post(ROOT_URL + '/signin', { email, password })
      .then(response => {
        // if request is good...
        // -update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // -save the JWT token
        localStorage.setItem('token', response.data.token);

        // - redirect to the route '/feature'
        browserHistory.push('/feature');

      })
      .catch(() => {
        // If request is bad show error
        dispatch(authError('Bad login info'));
      });
    }
  }

  export function signupUser({ email, password }) {
    return function(dispatch) {
      axios.post(ROOT_URL + '/signup', { email, password })
        .then(response => {
          dispatch({ type: AUTH_USER });

          localStorage.setItem('token', response.data.token);

          browserHistory.push('/feature');
        })
        // response.data.error undefined ? something in server?
        .catch(response => dispatch(authError('Email already in use')));
    }
  }

  export function authError(error) {

    return {
      type:AUTH_ERROR,
      payload:error
    };
  }

  export function signoutUser() {
    localStorage.removeItem('token');
    console.log('here');
    return { type: UNAUTH_USER };
  }

  export function fetchMessage() {
    return function(dispatch) {
      axios.get(ROOT_URL, {
        headers: { authorization: localStorage.getItem('token') }
      })
        .then(response => {
          dispatch({
            type: FETCH_MESSAGE,
            payload: response.data.message
          });
        });
    }
  }

// using redux promise below, just seeing that it is a little
// easier to read 

  // export function fetchMessage() {
  //   const request = axios.get(ROOT_URL, {
  //     headers: { authorization: localStorage.getItem('token') }
  //   });
  //
  //   return {
  //     type: FETCH_MESSAGE,
  //     payload: request
  //   };
  // }
