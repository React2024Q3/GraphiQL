import { KeyValuePair, KeyValuePairVar } from '@/types&interfaces/types';
import recordToLS from '@/utils/recordToLS';
import { describe, expect, it, vi } from 'vitest';

describe('recordToLS', () => {
  it('should call saveVarToLS with correctly formatted pairs', () => {
    const saveVarToLS = vi.fn();

    const pairs: KeyValuePair[] = [
      { key: 'key1', value: 'value1', editable: false },
      { key: 'key2', value: 'value2', editable: true },
      { key: 'key3', value: 'value3', editable: false },
    ];

    const expectedVarPairs: KeyValuePairVar[] = [
      { key: 'key1', value: 'value1' },
      { key: 'key3', value: 'value3' },
    ];

    recordToLS(pairs, saveVarToLS);

    expect(saveVarToLS).toHaveBeenCalledWith(expectedVarPairs);
  });

  it('should handle empty pairs array', () => {
    const saveVarToLS = vi.fn();
    const pairs: KeyValuePair[] = [];

    recordToLS(pairs, saveVarToLS);

    expect(saveVarToLS).toHaveBeenCalledWith([]);
  });

  it('should handle pairs where all are editable', () => {
    const saveVarToLS = vi.fn();
    const pairs: KeyValuePair[] = [
      { key: 'key1', value: 'value1', editable: true },
      { key: 'key2', value: 'value2', editable: true },
    ];

    recordToLS(pairs, saveVarToLS);

    expect(saveVarToLS).toHaveBeenCalledWith([]);
  });

  it('should handle pairs where none are editable', () => {
    const saveVarToLS = vi.fn();
    const pairs: KeyValuePair[] = [
      { key: 'key1', value: 'value1', editable: false },
      { key: 'key2', value: 'value2', editable: false },
    ];

    const expectedVarPairs: KeyValuePairVar[] = [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ];

    recordToLS(pairs, saveVarToLS);

    expect(saveVarToLS).toHaveBeenCalledWith(expectedVarPairs);
  });
});
