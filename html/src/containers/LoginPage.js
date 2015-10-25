import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { COMMON_STYLE_CLASS } from '../constants';
import ClearFix from '../components/ClearFix';
import Icon from '../components/Icon';

import {getQueryString} from '../helpers';

import * as userActions from '../reducers/user';


import './styles/loginPage.scss';

class LoginPage extends Component {

  constructor(props, context) {

    super(props, context);

    if(!!this.props.user.username && !!this.props.user.password) {

      userActions.loginWithSDK({
        username : this.props.user.username,
        password : this.props.user.password
      }, (() => {
        this.goToTribesPage();
      }).bind(this));

    }

    this.state = {
      username : '',
      password : ''
    };
  }

  goToTribesPage() {

    if(!!getQueryString('redirect')) {
      this.props.history.pushState(null, getQueryString('redirect'));
      return;
    }
    this.props.history.pushState(null, `/tribes`);
  }

  handleChange(e) {
    let tmp = {};
    tmp[e.target.name] = e.target.value;
    this.setState(tmp);
  }

  handleLogin() {

    this.props.dispatch(userActions.createUserWithLogin({
      username : this.state.username,
      password : this.state.password
    }, (() => {
      this.goToTribesPage();
    }).bind(this)));



  }

  handleRegister() {
    this.props.dispatch(userActions.createUserWithRegister({
      username : this.state.username,
      password : this.state.password
    }, (() => {
      this.goToTribesPage();
    }).bind(this)));
  }

  render() {

    const block = 'loginPage';

    return (
      <div className={block}>

        <div className={`${block}__logo`}>
          <img src='/dist/images/logo.png'/>
        </div>

        <h2 className={`${block}__title`}>登录或者注册</h2>

        <div className={`${COMMON_STYLE_CLASS}--controls`}>
          <input
            className={`${COMMON_STYLE_CLASS}--input ${block}__input`}
            onChange={this.handleChange.bind(this)}
            autoFocus={true}
            name='username'
            placeholder='用户名'
            value={this.state.username}
            type="text" />
        </div>
        <div className={`${COMMON_STYLE_CLASS}--controls `}>
          <input
            className={`${COMMON_STYLE_CLASS}--input ${block}__input`}
            onChange={this.handleChange.bind(this)}
            placeholder='密码'
            name='password'
            value={this.state.password}
            type="password" />
        </div>
        <div className={`${COMMON_STYLE_CLASS}--controls`}>
          <button
            className={`${COMMON_STYLE_CLASS}--button ${COMMON_STYLE_CLASS}--left ${COMMON_STYLE_CLASS}--button--primary ${block}__button`}
            disabled={!this.state.username || !this.state.password}
            onClick={this.handleLogin.bind(this)}>登录</button>

          <button
            className={`${COMMON_STYLE_CLASS}--button ${COMMON_STYLE_CLASS}--right ${COMMON_STYLE_CLASS}--button--last ${block}__button`}
            disabled={!this.state.username || !this.state.password}
            onClick={this.handleRegister.bind(this)}>注册</button>

          <ClearFix />
        </div>

      </div>
    );
  }
}

LoginPage.propTypes = {
  user: PropTypes.object.isRequired,
  dispatch : PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(LoginPage);