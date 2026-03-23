/** 每目标独立节流（局内秒表），避免同一帧重复计分 */

const _last = new Map<string, number>();

export function tryGrazeNow(
  targetKey: string,
  nowSec: number,
  throttleSec: number,
): boolean {
  const last = _last.get(targetKey) ?? -1e9;
  if (nowSec - last < throttleSec) {
    return false;
  }
  _last.set(targetKey, nowSec);
  return true;
}

export function clearGrazeThrottle(): void {
  _last.clear();
}
