import { KeyValuePair, KeyValuePairVar } from '@/types&interfaces/types';

export default function recordToLS(
  pairs: KeyValuePair[],
  saveVarToLS: (varPairs: KeyValuePairVar[]) => void
) {
  const varPairs = pairs.filter((pair) => !pair.editable).map(({ key, value }) => ({ key, value }));
  saveVarToLS(varPairs);
}
