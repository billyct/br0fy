import {uuid} from '../helpers';
import _ from 'lodash';
import {THE_INIT_USER, SERVER, SDK, APP_KEY} from '../constants';
import {fetchCheckStatus, fetchParseJSON} from '../helpers';


const CREATE = 'app/user/CREATE';
const REMOVE = 'app/user/REMOVE';


export default function reducers(state = THE_INIT_USER, action) {

  let stateTemp = _.clone(state);

  switch (action.type) {


  case CREATE:
    return _.assign({}, action.data.user);

  case REMOVE:
    return _.assign({}, THE_INIT_USER);

  default:
    return state;

  }
}

/**
 * model{id, name}
 **/

export function createUser(user) {
  return {type: CREATE, data: {user}};
}

export function removeUser(user) {
  return {type: REMOVE, data: {user}};
}

export function loginWithSDK(user, callback) {

  //每次刷新都需要重新去login一下也是醉了

  SDK.Base.login({
    uid: user.username,
    appkey: APP_KEY,
    credential: user.password,
    timeout: 40000,
    success: function(data){
      // {code: 1000, resultText: 'SUCCESS'}
      console.log('login success', data);
      callback();
    },
    error: function(error){
      // {code: 1002, resultText: 'TIMEOUT'}
      console.log('login fail', error);
    }
  });
}

export function createUserWithLogin(user, callback) {
  return (dispatch) => {


    fetch(`${SERVER}/login`, {
      method: 'post',
      body : JSON.stringify(user)
    })
      .then(fetchCheckStatus)
      .then(fetchParseJSON)
      .then((data) => {

        let user_callback = {
          username : data.userid,
          password : data.password
        };

        loginWithSDK(user_callback, function() {
          dispatch(createUser(user_callback));
          callback();
        });

      }).catch((error) => {
        console.log('request failed', error)
      });

  }
}

export function createUserWithRegister(user, callback) {
  return (dispatch) => {
    fetch(`${SERVER}/register`, {
      method: 'post',
      body: JSON.stringify(user)
    })
      .then(fetchCheckStatus)
      .then(fetchParseJSON)
      .then((data) => {

        let user_callback = {
          username: data.username,
          password: data.password
        };

        loginWithSDK(user_callback, function () {
          dispatch(createUser(user_callback));
          callback();
        });

      }).catch((error) => {
        console.log('request failed', error)
      });
  }
}

