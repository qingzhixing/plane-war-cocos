import { _decorator, Component, Node, Prefab } from 'cc';
import { PlayerController } from './PlayerController';
import { EnemySpawner } from './EnemySpawner';
import { setBattleMain } from './battleAccess';
import { presentUpgradePick } from './UpgradePickFlow';
import { BattleHud } from './BattleHud';
import { BattleRunState } from './battleRunState';

const { ccclass } = _decorator;

@ccclass('BattleMain')
export class BattleMain extends Component {
  private _playField: Node | null = null;
  private _spawner: EnemySpawner | null = null;
  private _hud: BattleHud | null = null;

  private _upgradePrefab: Prefab | null = null;

  private readonly _run = new BattleRunState();

  init(playField: Node, upgradePickPrefab: Prefab | null) {
    this._playField = playField;
    this._upgradePrefab = upgradePickPrefab;
    this._spawner = playField.getComponent(EnemySpawner)!;
    this._spawner.setBattleMain(this);
    setBattleMain(this);

    this._buildHud();

    this._run.activeWave = 1;
    this._spawner.startWave(1);
    this._refreshHud();
  }

  start() {
    this._refreshHud();
  }

  onDestroy() {
    setBattleMain(null);
  }

  addExp(n: number) {
    this._run.addExp(n);
    this._refreshHud();
  }

  addScore(n: number) {
    this._run.addScoreRaw(n);
    this._refreshHud();
  }

  onEnemyKill(expValue: number, baseScore: number) {
    this._run.onEnemyKill(expValue, baseScore);
    this._refreshHud();
  }

  onWaveCleared() {
    if (!this._run.tryEnterUpgradeFlow()) {
      return;
    }
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
      this._run.applyScoreUpUpgrade();
    }
    if (id === 'combo_boost') {
      this._run.applyComboBoostUpgrade();
    }
  }

  private _finishAfterUpgrade() {
    this._run.finishUpgradeAdvanceWave();
    this._spawner?.startWave(this._run.activeWave);
    this._refreshHud();
  }

  private _buildHud() {
    const n = new Node('BattleHud');
    this.node.addChild(n);
    this._hud = n.addComponent(BattleHud);
  }

  private _refreshHud() {
    this._hud?.refresh(
      this._run.activeWave,
      this._run.score,
      this._run.combo,
      this._run.exp,
      this._run.scoreMultiplier,
    );
  }
}
