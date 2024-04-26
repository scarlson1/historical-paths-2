import { WrongLocationRounded } from '@mui/icons-material';
import { Button, Stack, StackProps } from '@mui/material';
import { useCallback } from 'react';

import { useFilterStore, useLocationStore } from 'context';
import { MarkerModeButton } from './MarkerModeButton';

interface ControlProps extends Partial<StackProps> {
  options?: any; // TODO: show/hide controls
}

export const Controls = ({ options, ...props }: ControlProps) => {
  const { coordinates: coords, clearLocation } = useLocationStore();

  const resetFilters = useFilterStore((state) => state.resetFilters);

  const handleReset = useCallback(() => {
    clearLocation();
    resetFilters();
  }, []);

  return (
    <Stack spacing={1} direction='column' alignItems='flex-end' {...props}>
      {/* <Tooltip title={markerMode ? 'exit edit mode' : 'new location'}> */}
      <MarkerModeButton />
      {/* </Tooltip> */}
      <Button
        onClick={handleReset}
        aria-label='toggle cursor mode'
        // size='small'
        variant='contained'
        color='inherit'
        disabled={!coords}
        sx={{
          mx: 1,
          maxHeight: 30,
          minWidth: 34,
          maxWidth: 40,
          m: 0.5,
        }}
      >
        <WrongLocationRounded fontSize='small' />
      </Button>

      {/* <MapStyleControl initStyle='' color='standard' /> */}
    </Stack>
  );
};
