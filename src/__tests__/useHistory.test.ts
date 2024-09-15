import { HISTORY_LS } from '@/shared/constants';
import useHistoryLS from '@/shared/hooks/useHistoryLS';
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

describe('useHistoryLS', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with an empty list if localStorage is empty', () => {
    const { result } = renderHook(() => useHistoryLS());
    const [listUrl] = result.current;

    expect(listUrl).toEqual([]);
  });

  it('should load the list from localStorage if it exists', () => {
    const mockUrls = ['http://example.com', 'http://example.org'];
    window.localStorage.setItem(HISTORY_LS, JSON.stringify(mockUrls));

    const { result } = renderHook(() => useHistoryLS());
    const [listUrl] = result.current;

    expect(listUrl).toEqual(mockUrls);
  });

  it('should save new URL to localStorage and update the list', () => {
    const { result } = renderHook(() => useHistoryLS());
    const [listUrl, saveUrlToLS] = result.current;

    act(() => {
      saveUrlToLS('http://new-url.com');
    });

    const updatedList = ['http://new-url.com', ...listUrl];

    expect(result.current[0]).toEqual(updatedList);
    expect(window.localStorage.getItem(HISTORY_LS)).toEqual(JSON.stringify(updatedList));
  });

  it('should prepend new URLs to the list', () => {
    const mockUrls = ['http://example.com', 'http://example.org'];
    window.localStorage.setItem(HISTORY_LS, JSON.stringify(mockUrls));

    const { result } = renderHook(() => useHistoryLS());
    const [, saveUrlToLS] = result.current;

    act(() => {
      saveUrlToLS('http://new-url.com');
    });

    const updatedList = ['http://new-url.com', ...mockUrls];

    expect(result.current[0]).toEqual(updatedList);
    expect(window.localStorage.getItem(HISTORY_LS)).toEqual(JSON.stringify(updatedList));
  });
});
