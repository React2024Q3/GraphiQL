import { useEffect, useState } from 'react';

import { KeyValuePairVar } from '@/types&interfaces/types';

import { REST_VAR_LS } from '../constants';

export default function useVariablesLS(): [
  KeyValuePairVar[],
  (updateVars: KeyValuePairVar[]) => void,
] {
  const [vars, setVars] = useState<KeyValuePairVar[]>([]);

  const saveVarToLS = (updateVars: KeyValuePairVar[]) => {
    setVars(updateVars);
    if (typeof window !== 'undefined') {
      localStorage.setItem(REST_VAR_LS, JSON.stringify(updateVars));
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
