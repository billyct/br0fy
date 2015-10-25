import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { COMMON_STYLE_CLASS } from '../constants';

import * as messagesActions from '../reducers/messages';
import * as tribesActions from '../reducers/tribes';
import * as userActions from '../reducers/user';

import ClearFix from '../components/ClearFix';



import './styles/chatPage.scss';

class ChatPage extends Component {

  constructor(props, context) {

    super(props, context);

    this.state = {
      input : '',
    };
  }


  componentWillMount() {

    if(!!this.props.user.username && !!this.props.user.password) {

      userActions.loginWithSDK({
        username : this.props.user.username,
        password : this.props.user.password
      }, (() => {

        this.props.dispatch(messagesActions.fetchMessagesWithSDK(this.props.params.tid));
        this.props.dispatch(messagesActions.startLiveMessageWithSDK());
        this.props.dispatch(tribesActions.joinTribeWithSDK(this.props.user.username, this.props.params.tid));

      }).bind(this));

    } else {
      this.props.history.pushState(null, `/sign?redirect=/chat/${this.props.params.tid}`);
    }

  }

  scrollToBottom() {
    let chatNode = this.refs.chat.getDOMNode();
    chatNode.scrollTop = chatNode.scrollHeight;
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    this.props.dispatch(messagesActions.endLiveMessageWithSDK());
  }

  handleChange(e) {
    let tmp = {};
    tmp[e.target.name] = e.target.value;
    this.setState(tmp);
  }

  submit() {
    this.props.dispatch(messagesActions.createMessageWithSDK(this.props.params.tid, this.state.input));
    this.setState({
      input : ''
    });
  }



  handleSubmitByKeyDown(e) {
    if (e.which === 13) {
      if(!!this.state.input) {
        this.submit()
      }
    }
  }

  handleSubmitByClick() {
    this.submit()
  }

  renderMessage(message) {

    const block = 'chatPage';
    let position = 'left';

    const uid = message.from.replace('iae5vfm3', '');

    if (message.self !== undefined || uid === this.props.user.username ) {
      position = 'right'
    }

    if(typeof message.msg === 'string') {
      return (
        <li key={message.msgId} className={`${block}__chat__item`}>


          <div className={`${block}__chat__item__msg bubble ${position}`}>
            <p>{message.msg}</p>
          </div>

          <div className={`${block}__chat__item__avatar ${position}`}>
            <img src={`http://api.adorable.io/avatars/48/${message.from}`}/>
          </div>

          <ClearFix />


        </li>
      )
    }
  }


  render() {

    const block = 'chatPage';
    const {messages} = this.props;


    return (
      <div className={block}>

        <div className={`${block}__chat`} ref='chat'>

          <ul className={`${block}__chat__list`}>
            {messages.map(message =>
                this.renderMessage(message)
            )}

          </ul>

        </div>



        <div className={`${block}__controls`}>

          <div className={`${COMMON_STYLE_CLASS}--controls`}>
            <input
              className={`${COMMON_STYLE_CLASS}--input ${block}__input`}
              onChange={this.handleChange.bind(this)}
              onKeyDown={this.handleSubmitByKeyDown.bind(this)}
              autoFocus={true}
              name='input'
              placeholder='吐点槽吧...'
              value={this.state.input}
              type="text" />

          </div>

          <div className={`${COMMON_STYLE_CLASS}--controls`}>
            <button
              className={`${COMMON_STYLE_CLASS}--button ${COMMON_STYLE_CLASS}--button--primary`}
              disabled={!this.state.input}
              onClick={this.handleSubmitByClick.bind(this)}>发送</button>

          </div>


        </div>




      </div>
    );
  }
}

ChatPage.propTypes = {
  messages: PropTypes.array.isRequired,
  dispatch : PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    messages: state.messages,
    user : state.user
  };
}

export default connect(mapStateToProps)(ChatPage);