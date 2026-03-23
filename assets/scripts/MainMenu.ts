import { _decorator, Component, director } from 'cc';
import {
  createMainMenuRoot,
  presentRecordsQueryOverlay,
} from './mainMenuChromeFactory';
import { applyUiFontsUnder, preloadUiFonts } from './uiFonts';

const { ccclass } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {
  onLoad() {
    preloadUiFonts(() => {
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
      applyUiFontsUnder(root);
    });
  }
}
