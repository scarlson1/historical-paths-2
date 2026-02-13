import { EditLocationAltRounded, LocationDisabledRounded } from '@mui/icons-material';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';

import { useLocationStore } from 'context';

// type MarkerModeButtonProps = Omit<IconButtonProps, 'onClick'>;
type MarkerModeButtonProps = Omit<ButtonProps, 'onClick'>;

export const MarkerModeButton = (props: MarkerModeButtonProps) => {
  const { markerMode, setMarkerMode } = useLocationStore();

  return (
    <Button
      onClick={() => setMarkerMode(!markerMode)}
      aria-label='toggle cursor mode'
      // size='small'
      variant='contained'
      color='inherit'
      {...props}
      sx={{
        mx: 1,
        // borderRadius: 0.5,
        maxHeight: 30,
        minWidth: 34,
        maxWidth: 40,
        m: 0.5,
        // color: 'text.secondary',
      }}
    >
      {markerMode ? (
        <LocationDisabledRounded fontSize='small' />
      ) : (
        <EditLocationAltRounded fontSize='small' />
      )}
    </Button>
  );

  // return (
  //   <IconButton
  //     onClick={() => setMarkerMode(!markerMode)}
  //     aria-label='toggle cursor mode'
  //     size='small'
  //     color='primary'
  //     {...props}
  //     sx={{
  //       background: (theme) => theme.palette.background.paper,
  //       '[data-mui-color-scheme="dark"] &': {
  //         background: (theme) => theme.palette.primaryDark[700],
  //       },
  //       ...(props?.sx || {}),
  //     }}
  //   >
  //     {markerMode ? (
  //       <LocationDisabledRounded fontSize='inherit' />
  //     ) : (
  //       <EditLocationAltRounded fontSize='inherit' />
  //     )}
  //   </IconButton>
  // );
};
