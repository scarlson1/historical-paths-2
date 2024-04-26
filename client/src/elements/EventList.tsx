import { Box, Chip, List, ListItem, ListItemSecondaryAction, Typography } from '@mui/material';
import { capitalize } from 'lodash';
import { useMemo } from 'react';

import { GetEventsResponse } from 'api';
import { useLocationStore } from 'context';

export function EventList({
  eventProfiles,
  yearRange,
}: {
  eventProfiles: GetEventsResponse['events'];
  yearRange: number[];
}) {
  const highlightedIndex = useLocationStore((state) => state.highlightedIndex);
  const setHighlightedIndex = useLocationStore((state) => state.setHighlightedIndex);

  const filteredProfiles = useMemo(() => {
    return eventProfiles.filter(
      (event) => event.year >= yearRange[0] && event.year <= yearRange[1]
    );
  }, [eventProfiles, yearRange]);

  return (
    <List>
      {filteredProfiles.map((event, index) => (
        <ListItem
          dense
          key={event.id}
          onMouseEnter={() => setHighlightedIndex(index)}
          onMouseLeave={() => setHighlightedIndex(-1)}
          sx={{
            cursor: 'pointer',
            px: 1,
          }}
        >
          <Box
            sx={{
              color: index === highlightedIndex ? 'primary.main' : 'text.primary',
              fontWeight: index === highlightedIndex ? 'fontWeightMedium' : 'fontWeightRegular',
            }}
          >
            {capitalize(event.name)}
            <Typography variant='subtitle2' color='textSecondary' component='span'>
              {` - ${event.year}`}
            </Typography>
          </Box>
          <ListItemSecondaryAction>
            {/* TODO: set color depending on category to match category point on map */}
            <Chip
              label={`cat. ${event.category}`}
              size='small'
              variant='outlined'
              color='secondary'
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}
