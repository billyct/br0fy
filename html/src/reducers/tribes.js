import {uuid} from '../helpers';
import _ from 'lodash';
import {THE_INIT_TRIBES, SERVER, SDK, APP_KEY} from '../constants';
import {fetchCheckStatus, fetchParseJSON} from '../helpers';
import tribeInfo from '../components/TribeInfo';


const CREATE = 'app/tribes/CREATE';
const REMOVE = 'app/tribes/REMOVE';
const FETCH = 'app/tribes/FETCH';
const SEARCH = 'app/tribes/SEARCH';
const JOIN = 'app/tribes/JOIN';


export default function reducers(state = THE_INIT_TRIBES, action) {

  let stateTemp = _.clone(state);

  switch (action.type) {

  case JOIN:
  case CREATE:
    stateTemp.push(action.data.tribe);
    return stateTemp;

  case FETCH:
    stateTemp = stateTemp.concat(action.data.tribes);
    return stateTemp;



  case REMOVE:
    _.remove(stateTemp, (tribe) => tribe.id === action.data.tribe.id);
    return stateTemp;

  default:
    return state;

  }
}

/**
 * model{id, name}
 **/



export function fetchTribes(tribes) {
  return {type: FETCH, data: {tribes}};
}

export function createTribe(tribe) {
  return {type: CREATE, data: {tribe}};
}

export function removeTribe(tribe) {
  return {type: REMOVE, data: {tribe}};
}

export function joinTribeWithSDK(username, tribe_id) {
  return (dispatch) => {
    fetch(`${SERVER}/tribe/join`, {
      method: 'post',
      body: JSON.stringify({
        username : username,
        tribe_id : tribe_id
      })
    })
      .then(fetchCheckStatus)
      .then(fetchParseJSON)
      .then((data) => {

        console.log(data);
        dispatch(createTribe(data.data));
      }).catch((error) => {
        console.log('request failed', error)
      });
  }
}


export function searchTribeWithSDK(username, tribe_id) {
  //搜索tribe
  return (dispatch) => {
    SDK.Tribe.getTribeInfo({
      tid: tribe_id,
      success: function(data){
        console.log(data);
        tribeInfo({
          tribe: data.data,
          confirmLabel: '加入',
          abortLabel: '取消',
          confirmHandler : () => {

            let tribeInfoData = data.data;

            console.log(data.data.tid);
            console.log(tribe_id);



            fetch(`${SERVER}/tribe/join`, {
              method: 'post',
              body: JSON.stringify({
                username : username,
                tribe_id : tribe_id
              })
            })
              .then(fetchCheckStatus)
              .then(fetchParseJSON)
              .then((d) => {

                console.log(d);
                dispatch(createTribe(tribeInfoData));
              }).catch((error) => {
                console.log('request failed', error)
              });

          }


        });

        //dispatch(searchTribe(data));
        //这里需要做一个modal或者什么的
      },
      error: function(error){
        console.log(error);
      }
    });
  }
};

export function fetchTribesWithSDK() {
  //获取自己已经加入的tribe
  return (dispatch) => {

    SDK.Tribe.getTribeList({
      tribeTypes: [0,1],
      success: function(data){
        dispatch(fetchTribes(data.data));
      },
      error: function(error){
        console.log(error);
      }
    });


  }
}
