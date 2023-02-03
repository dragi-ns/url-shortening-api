import Storage from './storage';
import UI from './ui';
import './style.css';

const ui = new UI(new Storage('shortly-shorted-links'));
ui.init();
