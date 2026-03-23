import {
  AudioClip,
  AudioSource,
  Component,
  Node,
  _decorator,
  resources,
} from 'cc';

const { ccclass } = _decorator;

/** 仅用于承载 `scheduleOnce`，驱动 BGM 切歌 */
@ccclass('GameAudioScheduler')
class GameAudioScheduler extends Component {}

const BGM_PATHS = [
  'audio/BGM/Pixel Wanderer_1',
  'audio/BGM/Pixel Wanderer_2',
  'audio/BGM/Pixel Rogue Anthem_1',
  'audio/BGM/Pixel Rogue Anthem_2',
] as const;

const SFX = {
  shoot: 'audio/SFX/player/Shoot',
  hurt: 'audio/SFX/player/hurt',
  powerUp: 'audio/SFX/player/power_up',
  enemyHit: 'audio/SFX/enemy/EnemyInjured',
} as const;

const EXPLOSION_PATHS = [
  'audio/SFX/explode/Explosion1',
  'audio/SFX/explode/Explosion2',
  'audio/SFX/explode/Explosion3',
  'audio/SFX/explode/Explosion4',
  'audio/SFX/explode/Explosion5',
] as const;

let _scheduler: GameAudioScheduler | null = null;
let _sfx: AudioSource | null = null;
let _bgm: AudioSource | null = null;
let _bgmQueue: string[] = [];
let _bgmIndex = 0;
const _clipCache = new Map<string, AudioClip>();

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadClip(path: string, done: (c: AudioClip) => void) {
  const hit = _clipCache.get(path);
  if (hit) {
    done(hit);
    return;
  }
  resources.load(path, AudioClip, (err, clip) => {
    if (err || !clip) {
      console.warn('[gameAudio] load failed', path, err);
      return;
    }
    _clipCache.set(path, clip);
    done(clip);
  });
}

function playSfx(path: string, volumeScale: number) {
  if (!_sfx) {
    return;
  }
  loadClip(path, (clip) => {
    _sfx?.playOneShot(clip, volumeScale);
  });
}

function startBgmFromQueue() {
  if (_bgmQueue.length === 0) {
    return;
  }
  const path = _bgmQueue[_bgmIndex % _bgmQueue.length];
  loadClip(path, (clip) => playBgmClip(clip));
}

function playBgmClip(clip: AudioClip) {
  if (!_bgm || !_scheduler) {
    return;
  }
  _scheduler.unscheduleAllCallbacks();
  _bgm.stop();
  _bgm.clip = clip;
  _bgm.loop = false;
  _bgm.play();
  const d = Math.max(0.05, clip.getDuration());
  _scheduler.scheduleOnce(() => {
    advanceBgm();
  }, d);
}

function advanceBgm() {
  _bgmIndex += 1;
  if (_bgmIndex >= _bgmQueue.length) {
    _bgmIndex = 0;
    _bgmQueue = shuffle(BGM_PATHS);
  }
  startBgmFromQueue();
}

export function initGameAudio(host: Node) {
  destroyGameAudio();
  _scheduler = host.addComponent(GameAudioScheduler);

  const sfxNode = new Node('GameSfx');
  const bgmNode = new Node('GameBgm');
  host.addChild(sfxNode);
  host.addChild(bgmNode);
  _sfx = sfxNode.addComponent(AudioSource);
  _bgm = bgmNode.addComponent(AudioSource);
  _sfx.volume = 0.55;
  _bgm.volume = 0.42;

  _bgmQueue = shuffle(BGM_PATHS);
  _bgmIndex = 0;
  startBgmFromQueue();
}

export function destroyGameAudio() {
  _scheduler?.unscheduleAllCallbacks();
  _scheduler = null;
  _sfx = null;
  _bgm = null;
  _bgmQueue = [];
  _bgmIndex = 0;
  _clipCache.clear();
}

export function playShootSfx() {
  playSfx(SFX.shoot, 0.32);
}

export function playHurtSfx() {
  playSfx(SFX.hurt, 0.88);
}

export function playPowerUpSfx() {
  playSfx(SFX.powerUp, 0.9);
}

/** 连击档位跨越：与升级共用资源，略轻 */
export function playComboMilestoneSfx() {
  playSfx(SFX.powerUp, 0.52);
}

export function playEnemyHitSfx() {
  playSfx(SFX.enemyHit, 0.52);
}

/** 敌人/Boss 被弹击杀 */
export function playEnemyExplodeSfx() {
  const path =
    EXPLOSION_PATHS[Math.floor(Math.random() * EXPLOSION_PATHS.length)];
  playSfx(path, 0.62);
}
