import { Box, CircularProgress } from '@mui/material';

export function LoadingSpinner() {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 160px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress size={28} />
    </Box>
  );
}
