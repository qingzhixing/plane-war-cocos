import { _decorator, Component, director } from 'cc';
import {
  createMainMenuRoot,
  presentRecordsQueryOverlay,
} from './mainMenuChromeFactory';

const { ccclass } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {
  onLoad() {
    const root = createMainMenuRoot(
      this.node,
      () => {
        director.loadScene('Game');
      },
      () => {
        presentRecordsQueryOverlay(this.node);
      },
    );
    this.node.addChild(root);
  }
}
