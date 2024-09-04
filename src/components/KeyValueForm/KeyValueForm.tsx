'use client';

import React, { useEffect, useState } from 'react';

import { KeyValuePair } from '@/types&interfaces/types';
import { Box, Button, Grid, TextField } from '@mui/material';

type KeyValueFormProps = {
  onPairsChange: (pairs: KeyValuePair[]) => void;
  title: string;
  initPairs?: KeyValuePair[];
};

const initPair = { key: '', value: '', editable: true };

export default function KeyValueForm({ onPairsChange, title, initPairs }: KeyValueFormProps) {
  const [pairs, setPairs] = useState<KeyValuePair[]>([{...initPair}]);
  const [errors, setErrors] = useState<{ keyError: boolean; valueError: boolean }>({
    keyError: false,
    valueError: false,
  });

  useEffect(() => {
    if (initPairs && initPairs.length) {
      setPairs([...initPairs, {...initPair}]);
    }
  }, [initPairs]);

  const handleAddPair = () => {
    const lastPair = pairs[pairs.length - 1];
    const keyError = lastPair.key.trim() === '';
    const valueError = lastPair.value.trim() === '';

    if (keyError || valueError) {
      setErrors({ keyError, valueError });
      return;
    }

    const updatedPairs = pairs.map((pair, index) =>
      index === pairs.length - 1 ? { ...pair, editable: false } : pair
    );
    onPairsChange(updatedPairs);
    setPairs([...updatedPairs, { key: '', value: '', editable: true }]);
    setErrors({ keyError: false, valueError: false });
  };

  const handleChange = (index: number, field: 'key' | 'value', newValue: string) => {
    const newPairs = [...pairs];
    newPairs[index][field] = newValue;
    setPairs(newPairs);
  };

  const handleRemovePair = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
    onPairsChange(newPairs);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <h3>{title}</h3>
      <Grid container spacing={2} mt={1}>
        {pairs.map((pair, index) => (
          <Grid container item spacing={2} key={index} alignItems="center">
            <Grid item xs={5}>
              <TextField
                label="Key"
                value={pair.key}
                onChange={(e) => handleChange(index, 'key', e.target.value)}
                fullWidth
                disabled={!pair.editable}
                error={errors.keyError && index === pairs.length - 1}
                helperText={errors.keyError && index === pairs.length - 1 ? 'Please fill in the key' : ''}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Value"
                value={pair.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                fullWidth
                disabled={!pair.editable}
                error={errors.valueError && index === pairs.length - 1}
                helperText={errors.valueError && index === pairs.length - 1 ? 'Please fill in the value' : ''}
              />
            </Grid>
            <Grid item xs={2}>
              {pair.editable ? (
                <Button variant="outlined" color="primary" onClick={handleAddPair}>
                  Add
                </Button>
              ) : (
                <Button variant="outlined" color="error" onClick={() => handleRemovePair(index)}>
                  Del
                </Button>
              )}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
