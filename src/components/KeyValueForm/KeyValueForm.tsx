'use client';

import React, { useState } from 'react';

import { KeyValuePair } from '@/types&interfaces/types';
import { Box, Button, Grid, TextField } from '@mui/material';

type KeyValueFormProps = {
  onPairsChange: (pairs: KeyValuePair[]) => void;
  title: string;
};

export default function KeyValueForm({ onPairsChange, title }: KeyValueFormProps) {
  const [pairs, setPairs] = useState<KeyValuePair[]>([{ key: '', value: '', editable: true }]);

  const handleAddPair = () => {
    const lastPair = pairs[pairs.length - 1];
    if (lastPair.key.trim() !== '' && lastPair.value.trim() !== '') {
      const updatedPairs = pairs.map((pair, index) =>
        index === pairs.length - 1 ? { ...pair, editable: false } : pair
      );
      onPairsChange(updatedPairs);
      setPairs([...updatedPairs, { key: '', value: '', editable: true }]);
    } else {
      alert('Please fill both key and value fields.');
    }
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
          <Grid container item spacing={2} key={index} alignItems='center'>
            <Grid item xs={5}>
              <TextField
                label='Key'
                value={pair.key}
                onChange={(e) => handleChange(index, 'key', e.target.value)}
                fullWidth
                disabled={!pair.editable}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label='Value'
                value={pair.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                fullWidth
                disabled={!pair.editable}
              />
            </Grid>
            <Grid item xs={2}>
              {pair.editable ? (
                <Button variant='outlined' color='primary' onClick={handleAddPair}>
                  Add
                </Button>
              ) : (
                <Button variant='outlined' color='error' onClick={() => handleRemovePair(index)}>
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
