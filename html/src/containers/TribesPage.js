import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { COMMON_STYLE_CLASS } from '../constants';


import Icon from '../components/Icon';

import * as tribesActions from '../reducers/tribes';
import * as userActions from '../reducers/user';




import './styles/tribesPage.scss';

class TribesPage extends Component {

  constructor(props, context) {

    super(props, context);

    this.state = {
      input : '',
    };
  }

  handleChange(e) {
    let tmp = {};
    tmp[e.target.name] = e.target.value;
    this.setState(tmp);
  }

  search() {
    this.props.dispatch(tribesActions.searchTribeWithSDK(this.props.user.username, this.state.input));
  }

  handleSearchByKeyDown(e) {
    if(e.which == 13) {
      if(!!this.state.input) {
        this.search();
      }
    }
  }

  handleSearchByClick(e) {
    this.search();
  }

  handleChat(tid) {
    this.props.history.pushState(null, `/chat/${tid}`);
  }

  componentWillMount() {

    if(!!this.props.user.username && !!this.props.user.password) {

      userActions.loginWithSDK({
        username : this.props.user.username,
        password : this.props.user.password
      }, (() => {

        this.props.dispatch(tribesActions.fetchTribesWithSDK());

      }).bind(this));

    } else {
      this.props.history.pushState(null, `/sign`);
    }

  }


  render() {

    const block = 'tribesPage';
    const {tribes} = this.props;

    return (
      <div className={block}>

        <div className={`${COMMON_STYLE_CLASS}--controls`}>
          <button
            className={`${COMMON_STYLE_CLASS}--button ${COMMON_STYLE_CLASS}--right ${COMMON_STYLE_CLASS}--button--icon ${block}__button`}
            disabled={!this.state.input}
            onClick={this.handleSearchByClick.bind(this)}>
            <Icon name='search' size='s' />
          </button>
          <input
            className={`${COMMON_STYLE_CLASS}--input ${block}__input`}
            onChange={this.handleChange.bind(this)}
            onKeyDown={this.handleSearchByKeyDown.bind(this)}
            autoFocus={true}
            name='input'
            placeholder='群ID'
            value={this.state.input}
            type="text" />

        </div>
        <div className={`${COMMON_STYLE_CLASS}--controls `}>

          <ul className={`${block}__list`}>

            {tribes.map(tribe =>
                <li className={`${block}__item`}
                    key={tribe.tid}
                    onClick={this.handleChat.bind(this,tribe.tid)}>
                  <div className={`${block}__item__icon ${COMMON_STYLE_CLASS}--left`}>
                    <img src={tribe.icon} />
                  </div>
                  <div className={`${block}__item__name`}>
                    <p>{tribe.name}</p>

                  </div>
                </li>
            )}

          </ul>



        </div>


      </div>
    );
  }
}

TribesPage.propTypes = {
  tribes: PropTypes.array.isRequired,
  dispatch : PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    tribes: state.tribes,
    user : state.user
  };
}

export default connect(mapStateToProps)(TribesPage);