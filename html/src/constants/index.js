import {uuid} from '../helpers';

export const SVG_URL = '/dist/icons/sprites.svg';//这个是根据gulp生成svg来做的静态的svg地址
export const COMMON_STYLE_CLASS = 'common'; //common style name
export const THE_INIT_MODELS = [
  {
    id: uuid(),
    name: 'hello world 1'
  },
  {
    id: uuid(),
    name: 'hello world 2'
  }
];
export const THE_INIT_TRIBES = [];

export const THE_INIT_USER = {
  username : '',
  password : ''
};

export const SDK = new WSDK();

export const APP_KEY = '23257991';

export const SERVER = 'http://10.202.5.145:3000';