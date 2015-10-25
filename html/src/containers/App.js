import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Icon from '../components/Icon';
import ClearFix from '../components/ClearFix';

import './styles/app.scss';

class App extends Component {



  render() {

    const block = 'app';

    return (
      <div className={block}>

        <div className={`${block}__body`}>
          {this.props.children}
        </div>
      </div>

    );
  }
}




export default App;