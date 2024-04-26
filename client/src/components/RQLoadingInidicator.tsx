import { Box, CircularProgress } from '@mui/material';
import { useIsFetching } from '@tanstack/react-query';

export function RQLoadingIndicator() {
  const isFetching = useIsFetching();

  return isFetching ? (
    <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
      {/* <div>Queries are fetching in the background...</div> */}
      <CircularProgress size={24} color='primary' />
    </Box>
  ) : null;
}
