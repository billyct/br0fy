import {uuid} from '../helpers';
import _ from 'lodash';
import {SERVER, SDK, APP_KEY} from '../constants';
import {fetchCheckStatus, fetchParseJSON} from '../helpers';


const CREATE = 'app/messages/CREATE';
const FETCH = 'app/messages/FETCH';//history


export default function reducers(state = [], action) {

  let stateTemp = _.clone(state);

  switch (action.type) {

  case CREATE:
    stateTemp.push(action.data.message);
    console.log(stateTemp);
    return stateTemp;

  case FETCH:
    stateTemp = stateTemp.concat(action.data.messages);
    return stateTemp;



  default:
    return state;

  }
}

/**
 * model{id, name}
 **/



export function fetchMessages(messages) {
  return {type: FETCH, data: {messages}};
}

export function createMessage(message) {
  return {type: CREATE, data: {message}};
}


export function createMessageWithSDK(tid, message) {
  return (dispatch) => {
    SDK.Tribe.sendMsg({
      tid: tid,
      msg: message,
      success: function(data){
        console.log(data);
        dispatch(createMessage({
          msgId : uuid(),
          msg : message,
          from : uuid(),
          self: true
        }));

      },
      error: function(error){
        console.log(error);
      }
    });
  }
};


export function startLiveMessageWithSDK() {

  return (dispatch) => {
    SDK.Event.on('MSG_RECEIVED', function(data){
      console.log(data);
      if (data.data.data !== undefined) {

        data = data.data.data;

        for (let i = 0; i < data.messages.length; i++) {

          //代表用户发消息过来.图片，和文字
          dispatch(createMessage({
            msgId : data.messages[i].uuid,
            msg : data.messages[i].msgContent.customize ? data.messages[i].msgContent.customize : data.messages[i].msgContent[0][1],
            from : data.messages[i].fromId
          }));

          //=3 是有人加入进来 //msg content是用户加入群
        }
      }
    });

    SDK.Base.startListenAllMsg();

  }


}

export function endLiveMessageWithSDK() {

  return (dispatch) => {
    SDK.Base.stopListenAllMsg();
  }


}


let nextkey = '';

export function fetchMessagesWithSDK(tid) {
  return (dispatch) => {

    SDK.Tribe.getHistory({
      tid: tid,
      count: 10,
      nextkey: nextkey,
      success: function(data){
        console.log('get history msg success', data);


        nextkey = data.data && data.data.next_key;
        dispatch(fetchMessages(_.map(data.data.msgs, function(msg) {


          return {
            msgId : msg.msgId,
            from : msg.from,
            msg : (typeof msg.msg === 'string') ? msg.msg : msg.msg.customize
          }
        }).reverse()));
      },
      error: function(error){
        console.log('get history msg fail', error);
      }
    });


  }
}
