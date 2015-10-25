import React, {Component} from 'react';

import { COMMON_STYLE_CLASS } from '../../constants';


import Icon from '../Icon';
import ClearFix from '../ClearFix';
import confirm from '../Confirm';

import './ComponentForDemoTest.scss';

export default class ComponentForDemoTest extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      input : ''
    }
  }

  save() {
    let model = {
      name : this.state.input
    };
    let field = this.refs.modelInput.getDOMNode();

    this.props.actions.createModel(model);
    this.setState({
      input : ''
    }, () => {
      field.focus();
    });


  }

  handleSubmitByClick() {
    this.save();
  }

  handleSubmitByKeyDown(e) {
    if (e.which === 13) {
      this.save()
    }
  }


  handleChange(e) {
    this.setState({
      input : e.target.value
    });
  }

  handleRemove(model) {
    confirm(`removed "${model.name}"? are you sure?`, {
      confirmHandler : () => {
        this.props.actions.removeModel(model);
      }
    })
  }

  render() {

    const {models} = this.props;

    const block = 'ComponentForDemoTest';

    return (
      <div className={block}>

        <div className={`${COMMON_STYLE_CLASS}--controls`}>
          <input
            className={`${COMMON_STYLE_CLASS}--input`}
            onChange={this.handleChange.bind(this)}
            onKeyDown={this.handleSubmitByKeyDown.bind(this)}
            autoFocus={true}
            value={this.state.input}
            ref='modelInput'
            type="text" />

        </div>

        <div className={`${COMMON_STYLE_CLASS}--controls`}>
          <button
            className={`${COMMON_STYLE_CLASS}--button ${COMMON_STYLE_CLASS}--button--primary`}
            onClick={this.handleSubmitByClick.bind(this)}>save</button>
        </div>

        <div className={`${COMMON_STYLE_CLASS}--controls`}>
          <ul className={`${block}__list`}>
            {models.map(model =>
              <li key={model.id} className={`${block}__item`}>
                {model.name}


                <button
                  className={`${COMMON_STYLE_CLASS}--button ${COMMON_STYLE_CLASS}--button--icon ${COMMON_STYLE_CLASS}--button--radius`}
                  onClick={this.handleRemove.bind(this, model)}>
                  <Icon name='remove' size='s' />
                </button>
                <ClearFix />
              </li>
            )}
          </ul>
        </div>

      </div>
    )
  }
}