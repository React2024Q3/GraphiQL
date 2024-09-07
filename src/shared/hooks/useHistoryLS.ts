import { useEffect, useState } from 'react';

import { HISTORY_LS } from '../constants';

export default function useHistoryLS(): [string[], (url: string) => void] {
  const [listUrl, setListUrl] = useState<string[]>([]);

  const saveUrlToLS = (newUrl: string) => {
    const newListUrl = [newUrl, ...listUrl];
    setListUrl(newListUrl);
    if (typeof window !== 'undefined') {
      localStorage.setItem(HISTORY_LS, JSON.stringify(newListUrl));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const listLS = localStorage.getItem(HISTORY_LS);
      if (listLS) setListUrl(JSON.parse(listLS));
    }
  }, []);

  return [listUrl, saveUrlToLS];
}
