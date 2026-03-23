import { _decorator, Component, director, Node, Prefab } from 'cc';
import { PlayerController } from './PlayerController';
import { EnemySpawner } from './EnemySpawner';
import { setBattleMain } from './battleAccess';
import {
  presentPostBossChoice,
  type PostBossChoice,
} from './postBossChoiceFlow';
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

  private _bossHudVisible = false;
  private _bossHudHp = 0;
  private _bossHudMax = 0;

  init(playField: Node, upgradePickPrefab: Prefab | null) {
    this._playField = playField;
    this._upgradePrefab = upgradePickPrefab;
    this._spawner = playField.getComponent(EnemySpawner)!;
    this._spawner.setBattleMain(this);
    setBattleMain(this);

    this._buildHud();

    this._run.activeWave = 1;
    this._startCurrentWave();
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

  onPlayerHit() {
    this._run.resetCombo();
    this._refreshHud();
  }

  onBossSpawned(maxHp: number) {
    this._bossHudVisible = true;
    this._bossHudHp = maxHp;
    this._bossHudMax = maxHp;
    this._refreshHud();
  }

  onBossHpChanged(hp: number, maxHp: number) {
    this._bossHudHp = hp;
    this._bossHudMax = maxHp;
    this._refreshHud();
  }

  onBossGone() {
    this._bossHudVisible = false;
    this._refreshHud();
  }

  onWaveCleared() {
    if (this._run.activeWave === 8 && !this._run.inContinuationBlock) {
      presentPostBossChoice(this.node, 'main', (c) =>
        this._resolvePostBossChoice(c),
      );
      return;
    }
    if (this._run.activeWave === 8 && this._run.inContinuationBlock) {
      presentPostBossChoice(this.node, 'continuation', (c) =>
        this._resolvePostBossChoice(c),
      );
      return;
    }
    if (!this._run.tryEnterUpgradeFlow()) {
      return;
    }
    this._openUpgrade();
  }

  private _resolvePostBossChoice(c: PostBossChoice) {
    if (c === 'settle') {
      director.loadScene('MainMenu');
      return;
    }
    this._run.applyContinueChallenge();
    this._startCurrentWave();
    this._refreshHud();
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
    this._startCurrentWave();
    this._refreshHud();
  }

  private _startCurrentWave() {
    this._spawner?.startWave(
      this._run.activeWave,
      this._run.threatTier,
      this._run.continuationBossForWave(this._run.activeWave),
    );
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
      this._run.inContinuationBlock,
      this._bossHudVisible
        ? { hp: this._bossHudHp, maxHp: this._bossHudMax }
        : null,
    );
  }
}
