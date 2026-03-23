import { describe, expect, it } from 'vitest';
import {
  computeReturnHint,
  DEFAULT_LOCAL_RECORDS,
  mergeRunIntoRecords,
} from '../assets/scripts/localRecordsCore';

describe('localRecordsCore', () => {
  it('mergeRunIntoRecords 取较高分与连击', () => {
    const prev = { ...DEFAULT_LOCAL_RECORDS, bestScore: 100, bestCombo: 5 };
    const next = mergeRunIntoRecords(prev, 50, 20, 0);
    expect(next.bestScore).toBe(100);
    expect(next.bestCombo).toBe(20);
  });

  it('mergeRunIntoRecords 刷新纪录', () => {
    const prev = { ...DEFAULT_LOCAL_RECORDS };
    const next = mergeRunIntoRecords(prev, 999, 12, 0);
    expect(next.bestScore).toBe(999);
    expect(next.bestCombo).toBe(12);
  });

  it('mergeRunIntoRecords 合并 bestDps', () => {
    const prev = { ...DEFAULT_LOCAL_RECORDS, bestDps: 10 };
    const next = mergeRunIntoRecords(prev, 0, 0, 30);
    expect(next.bestDps).toBe(30);
  });

  it('computeReturnHint 无刷新时返回 null', () => {
    const prev = { ...DEFAULT_LOCAL_RECORDS, bestScore: 100 };
    const next = { ...prev };
    expect(computeReturnHint(prev, next)).toBeNull();
  });

  it('computeReturnHint 单项刷新', () => {
    const prev = { ...DEFAULT_LOCAL_RECORDS, bestScore: 10 };
    const next = { ...prev, bestScore: 99 };
    expect(computeReturnHint(prev, next)).toEqual({
      newBestScore: true,
      newBestCombo: false,
      newBestDps: false,
    });
  });

  it('computeReturnHint 多项刷新', () => {
    const prev = { ...DEFAULT_LOCAL_RECORDS };
    const next = mergeRunIntoRecords(prev, 50, 12, 8);
    expect(computeReturnHint(prev, next)).toEqual({
      newBestScore: true,
      newBestCombo: true,
      newBestDps: true,
    });
  });
});
