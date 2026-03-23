import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LOCAL_RECORDS,
  mergeRunIntoRecords,
} from '../assets/scripts/localRecordsCore';

describe('localRecordsCore', () => {
  it('mergeRunIntoRecords 取较高分与连击', () => {
    const prev = { ...DEFAULT_LOCAL_RECORDS, bestScore: 100, bestCombo: 5 };
    const next = mergeRunIntoRecords(prev, 50, 20);
    expect(next.bestScore).toBe(100);
    expect(next.bestCombo).toBe(20);
  });

  it('mergeRunIntoRecords 刷新纪录', () => {
    const prev = { ...DEFAULT_LOCAL_RECORDS };
    const next = mergeRunIntoRecords(prev, 999, 12);
    expect(next.bestScore).toBe(999);
    expect(next.bestCombo).toBe(12);
  });
});
