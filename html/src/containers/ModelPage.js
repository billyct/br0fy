import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as modelActions from '../reducers/models';

import ComponentForDemoTest from '../components/ComponentForDemoTest';



class ModelPage extends Component {

  render() {

    const {models, dispatch} = this.props;
    const actions = bindActionCreators(modelActions, dispatch);

    return (
      <ComponentForDemoTest models={models} actions={actions} />
    );
  }
}

ModelPage.propTypes = {
  models: PropTypes.array.isRequired,
  dispatch : PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    models: state.models
  };
}

export default connect(mapStateToProps)(ModelPage);