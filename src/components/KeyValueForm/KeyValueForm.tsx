'use client';

import React, { useEffect, useState } from 'react';

import useVariablesLS from '@/shared/hooks/useVariablesLS';
import { KeyValuePair } from '@/types&interfaces/types';
import recordToLS from '@/utils/recordToLS';
import { Box, Button, Grid2, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';

type KeyValueFormProps = {
  onPairsChange: (pairs: KeyValuePair[]) => void;
  title: string;
  initPairs?: KeyValuePair[];
  isVars?: boolean;
  height: string;
};

const createNewPair = (): KeyValuePair => ({
  key: '',
  value: '',
  editable: true,
});

export default function KeyValueForm({
  onPairsChange,
  title,
  initPairs,
  isVars,
  height,
}: KeyValueFormProps) {
  const [pairs, setPairs] = useState<KeyValuePair[]>([createNewPair()]);
  const [error, setError] = useState<string | null>(null);
  const [_, saveVarToLS] = useVariablesLS();
  const t = useTranslations();

  useEffect(() => {
    if (initPairs && initPairs.length) {
      setPairs([...initPairs, createNewPair()]);
    }
  }, [initPairs]);

  const handleAddPair = () => {
    const lastPair = pairs[pairs.length - 1];
    if (lastPair.key.trim() !== '' && lastPair.value.trim() !== '') {
      setError(null);
      if (pairs.find(({ key, editable }) => key === lastPair.key.trim() && !editable)) {
        setError('errors.delete-same-key');
        return;
      }
      const updatedPairs = pairs.map((pair, index) =>
        index === pairs.length - 1 ? { ...pair, editable: false } : pair
      );
      setPairs([...updatedPairs, createNewPair()]);
      onPairsChange(updatedPairs);
      if (isVars) recordToLS(updatedPairs, saveVarToLS);
    } else {
      setError(t('errors.fill-key-value'));
    }
  };

  const handleChange = (index: number, field: 'key' | 'value', newValue: string) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: newValue };
    setPairs(newPairs);
  };

  const handleRemovePair = (index: number) => {
    const delPair = pairs.find((_, i) => i === index);
    if (delPair) delPair.editable = true;
    const newPairs = pairs.filter((p) => !p.editable);
    setPairs([...newPairs, createNewPair()]);
    onPairsChange(newPairs);
    if (isVars) recordToLS(newPairs, saveVarToLS);
  };

  return (
    <Box sx={{ width: '100%' }} style={{ maxHeight: `${height}`, overflow: 'hidden' }}>
      <h3>{title}</h3>
      <Grid2 columns={12} container spacing={2} mt={1}>
        {pairs.map((pair, index) => (
          <Grid2 sx={{ width: '100%' }} container spacing={2} key={index} alignItems='top'>
            <Grid2 size={4.5}>
              <TextField
                label={t('client.key')}
                value={pair.key}
                onChange={(e) => handleChange(index, 'key', e.target.value)}
                fullWidth
                disabled={!pair.editable}
                error={Boolean(error && pair.editable && pair.key.trim() === '')}
                helperText={
                  error && pair.editable && pair.key.trim() === '' ? t('errors.fill-in-key') : ''
                }
              />
            </Grid2>
            <Grid2 size={4.5}>
              <TextField
                label={t('client.value')}
                value={pair.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                fullWidth
                disabled={!pair.editable}
                error={Boolean(error && pair.editable && pair.value.trim() === '')}
                helperText={
                  error && pair.editable && pair.value.trim() === ''
                    ? t('errors.fill-in-value')
                    : ''
                }
              />
            </Grid2>
            <Grid2 size={1}>
              {pair.editable ? (
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={handleAddPair}
                  sx={{ height: '56px' }}
                >
                  {t('buttons.add')}
                </Button>
              ) : (
                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => handleRemovePair(index)}
                  sx={{ height: '56px' }}
                >
                  {t('buttons.delete')}
                </Button>
              )}
            </Grid2>
            {error && pair.editable && (
              <p style={{ color: 'red', fontSize: '0.8rem', paddingTop: '0' }}>{error}</p>
            )}
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
