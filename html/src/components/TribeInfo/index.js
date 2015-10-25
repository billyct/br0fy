import React, {Component, PropTypes} from 'react';

import { COMMON_STYLE_CLASS } from '../../constants';

import Modal from '../Modal';
import ClearFix from '../ClearFix';
import {Confirm} from '../Confirm';

import './tribeInfo.scss';

class TribeInfo extends Component {

  render() {

    const {tribe} = this.props;
    const block = 'tribeInfo';


    return (
      <Confirm {...this.props}>

        <div className={block}>
          <div className={`${block}__icon`}>
            <img src={tribe.icon}/>
          </div>
          <div className={`${block}__name`}>
            <p>群名称：{tribe.name}</p>
          </div>
          <div className={`${block}__bulletin`}>
            <p>群公告：{tribe.bulletin}</p>
          </div>
          <div className={`${block}__memberCount`}>
            <p>成员数量：{tribe.memberCount}</p>
          </div>



        </div>

      </Confirm>

    )
  }
}



export default function tribeInfo(options = {}) {

  //tribeInfo 插进去
  let wrapper = document.body.appendChild(document.createElement('div'));
  React.render(React.createElement(TribeInfo, options), wrapper);


}