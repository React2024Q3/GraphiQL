import { REST_VAR_LS } from '@/shared/constants';
import useVariablesLS from '@/shared/hooks/useVariablesLS';
import { KeyValuePairVar } from '@/types&interfaces/types';
import { act, renderHook } from '@testing-library/react';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    clear() {
      store = {};
    },
  };
})();

describe('useVariablesLS', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with an empty list if localStorage is empty', () => {
    const { result } = renderHook(() => useVariablesLS());
    const [vars] = result.current;

    expect(vars).toEqual([]);
  });

  it('should load the variables from localStorage if it exists', () => {
    const mockVars: KeyValuePairVar[] = [
      { key: 'var1', value: 'value1' },
      { key: 'var2', value: 'value2' },
    ];
    window.localStorage.setItem(REST_VAR_LS, JSON.stringify(mockVars));

    const { result } = renderHook(() => useVariablesLS());
    const [vars] = result.current;

    expect(vars).toEqual(mockVars);
  });

  it('should save new variables to localStorage and update the list', () => {
    const { result } = renderHook(() => useVariablesLS());
    const [, saveVarToLS] = result.current;

    const newVars: KeyValuePairVar[] = [
      { key: 'var1', value: 'value1' },
      { key: 'var2', value: 'value2' },
    ];

    act(() => {
      saveVarToLS(newVars);
    });

    expect(result.current[0]).toEqual(newVars);
    expect(window.localStorage.getItem(REST_VAR_LS)).toEqual(JSON.stringify(newVars));
  });

  it('should update the existing variables in localStorage', () => {
    const mockVars: KeyValuePairVar[] = [
      { key: 'var1', value: 'value1' },
      { key: 'var2', value: 'value2' },
    ];
    window.localStorage.setItem(REST_VAR_LS, JSON.stringify(mockVars));

    const { result } = renderHook(() => useVariablesLS());
    const [, saveVarToLS] = result.current;

    const updatedVars: KeyValuePairVar[] = [
      { key: 'var1', value: 'newValue1' },
      { key: 'var3', value: 'value3' },
    ];

    act(() => {
      saveVarToLS(updatedVars);
    });

    expect(result.current[0]).toEqual(updatedVars);
    expect(window.localStorage.getItem(REST_VAR_LS)).toEqual(JSON.stringify(updatedVars));
  });
});
