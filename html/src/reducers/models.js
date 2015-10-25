import {uuid} from '../helpers';
import _ from 'lodash';
import {THE_INIT_MODELS} from '../constants';


const CREATE = 'app/models/CREATE';
const UPDATE = 'app/models/UPDATE';
const REMOVE = 'app/models/REMOVE';


export default function reducers(state = THE_INIT_MODELS, action) {

  let stateTemp = _.clone(state);

  switch (action.type) {

  case CREATE:
    //action.data {id:'', name}
    stateTemp.push(_.assign({}, action.data.model, {id: uuid()}));
    return stateTemp;

  case UPDATE:
    //action.data {id, name}
    let index = _.findIndex(stateTemp, model => model.id === action.data.model.id);
    stateTemp[index] = action.data.model;
    return stateTemp;

  case REMOVE:
    //action.data {id}
    _.remove(stateTemp, (model) => model.id === action.data.model.id);
    return stateTemp;
  default:
    return state;

  }
}

/**
 * model{id, name}
 **/

export function createModel(model) {
  return {type: CREATE, data: {model}};
}

export function updateModel(model) {
  return {type: UPDATE, data: {model}};
}

export function removeModel(model) {
  return {type: REMOVE, data: {model}};
}
