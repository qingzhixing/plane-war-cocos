import { _decorator, Component, director, Node } from 'cc';
import { createMainMenuHint } from './mainMenuChromeFactory';

const { ccclass } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {
  onLoad() {
    this.node.addChild(createMainMenuHint());
    this.node.on(Node.EventType.TOUCH_END, this._go, this);
  }

  onDestroy() {
    this.node.off(Node.EventType.TOUCH_END, this._go, this);
  }

  private _go() {
    director.loadScene('Game');
  }
}
