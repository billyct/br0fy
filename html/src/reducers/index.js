import {combineReducers} from 'redux';
import user from './user';
import tribes from './tribes';
import messages from './messages';


export default combineReducers({
  user, tribes, messages
});