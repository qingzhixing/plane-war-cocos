import { _decorator, Color, Component, Label, Node, Prefab, UITransform } from 'cc';
import { PlayerController } from './PlayerController';
import { EnemySpawner } from './EnemySpawner';
import { setBattleMain } from './battleAccess';
import { presentUpgradePick } from './UpgradePickFlow';

const { ccclass } = _decorator;

@ccclass('BattleMain')
export class BattleMain extends Component {
  private _playField: Node | null = null;
  private _spawner: EnemySpawner | null = null;
  private _hudLabel: Label | null = null;

  private _upgradePrefab: Prefab | null = null;

  private _exp = 0;
  private _score = 0;
  private _activeWave = 0;
  private _waitingContinue = false;

  /** 未接 BattleMain 乘区时，score_up 的占位累计 */
  private _scoreMultiplier = 1;

  init(playField: Node, upgradePickPrefab: Prefab | null) {
    this._playField = playField;
    this._upgradePrefab = upgradePickPrefab;
    this._spawner = playField.getComponent(EnemySpawner)!;
    this._spawner.setBattleMain(this);
    setBattleMain(this);

    this._buildHud();

    this._activeWave = 1;
    this._spawner.startWave(1);
    this._refreshHud();
  }

  onDestroy() {
    setBattleMain(null);
  }

  addExp(n: number) {
    this._exp += n;
    this._refreshHud();
  }

  addScore(n: number) {
    this._score += Math.round(n * this._scoreMultiplier);
    this._refreshHud();
  }

  onWaveCleared() {
    if (this._waitingContinue) {
      return;
    }
    this._waitingContinue = true;
    this._openUpgrade();
  }

  private _openUpgrade() {
    presentUpgradePick(this.node, this._upgradePrefab, (id: string) => {
      this._applyUpgrade(id);
      this._finishAfterUpgrade();
    });
  }

  private _applyUpgrade(id: string) {
    const p = this._playField?.getChildByName('Player');
    const pc = p?.getComponent(PlayerController);
    pc?.applyUpgrade(id);

    if (id === 'score_up') {
      this._scoreMultiplier += 0.15;
    }
  }

  private _finishAfterUpgrade() {
    this._waitingContinue = false;
    this._activeWave += 1;
    this._spawner?.startWave(this._activeWave);
    this._refreshHud();
  }

  private _buildHud() {
    const n = new Node('BattleHud');
    const ut = n.addComponent(UITransform);
    ut.setContentSize(680, 100);
    n.setPosition(0, 560, 0);
    const lab = n.addComponent(Label);
    lab.fontSize = 20;
    lab.color = Color.WHITE;
    this._hudLabel = lab;
    this.node.addChild(n);
  }

  private _refreshHud() {
    if (!this._hudLabel) {
      return;
    }
    const sm = Math.round(this._scoreMultiplier * 100) / 100;
    this._hudLabel.string = `波次 ${this._activeWave}  得分 ${this._score}  经验 ${this._exp}  评分×${sm}`;
  }
}
