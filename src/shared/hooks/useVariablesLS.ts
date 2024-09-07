import { useEffect, useState } from 'react';

import { KeyValuePair } from '@/types&interfaces/types';

import { REST_VAR_LS } from '../constants';

export default function useVariables(): [KeyValuePair[], (varPair: KeyValuePair) => void] {
  const [vars, setVars] = useState<KeyValuePair[]>([]);

  const saveVarToLS = (newVar: KeyValuePair) => {
    const newListVars = [newVar, ...vars];
    setVars(newListVars);
    if (typeof window !== 'undefined') {
      localStorage.setItem(REST_VAR_LS, JSON.stringify(newListVars));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const listLS = localStorage.getItem(REST_VAR_LS);
      if (listLS) setVars(JSON.parse(listLS));
    }
  }, []);

  return [vars, saveVarToLS];
}
