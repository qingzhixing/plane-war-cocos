import { _decorator, Component, director, Node, Prefab } from 'cc';
import { getBattleMain } from './battleAccess';
import { BattleMain } from './BattleMain';
import { createPlayField } from './playFieldFactory';
import { createBackButton, createHintBanner } from './gameChromeFactory';
import { destroyGameAudio, initGameAudio } from './gameAudio';
import {
  clearBattleSpriteCache,
  preloadBattleSpriteFrames,
} from './battleSprites';
import { applyUiFontsUnder, preloadUiFonts } from './uiFonts';

const { ccclass, property } = _decorator;

@ccclass('GameRoot')
export class GameRoot extends Component {
  @property(Prefab)
  upgradePickPrefab: Prefab | null = null;

  private _backBtn: Node | null = null;

  onLoad() {
    preloadBattleSpriteFrames(() => {
      preloadUiFonts(() => {
        this._setupBattle();
      });
    });
  }

  private _setupBattle() {
    initGameAudio(this.node);
    const playField = createPlayField();
    this.node.addChild(playField);

    this.node.addChild(createHintBanner());

    const back = createBackButton(this._back, this);
    this.node.addChild(back);
    this._backBtn = back;

    const battle = this.node.addComponent(BattleMain);
    battle.init(playField, this.upgradePickPrefab);
    applyUiFontsUnder(this.node);
  }

  onDestroy() {
    destroyGameAudio();
    clearBattleSpriteCache();
    this._backBtn?.off(Node.EventType.TOUCH_END, this._back, this);
  }

  private _back() {
    getBattleMain()?.flushLocalRecords();
    director.loadScene('MainMenu');
  }
}
