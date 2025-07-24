import { ChevronLeftRounded, ChevronRightRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Divider,
  List,
  ListItem,
  Skeleton,
  Slide,
  Typography,
} from '@mui/material';
import { Suspense, useState } from 'react';

import { useFilterStore } from 'context';
import { usePaths } from 'hooks';
import { ErrorBoundary } from 'react-error-boundary';
import { MAX_YEAR, MIN_YEAR } from '../constants';
import { CategoryCount } from './CategoryCount';
import { EventList } from './EventList';
import { LastEventDate } from './LastEventDate';
import { RangeFilter } from './RangeFilter';

// combine paths hook with filters ??
// useEffect to update zustand any time filter changes ??
// or store filtered data in the filter store ?? update in zustand action handler ??
// how would filtered data be cleared when location is cleared/changed ?? bad DX ??

// TODO: check if data loaded instead of has location ??

export const EventsSummary = ({ hasLocation }: { hasLocation: boolean }) => {
  const [open, setOpen] = useState(true); // initialize from url param??
  const yearRange = useFilterStore((state) => state.yearRange);

  // pass data as props instead ??
  const { data, isLoading } = usePaths();
  // isLoading === isFetching && isPending (first fetch is loading)
  // console.log('loading: ', isLoading, data);

  return (
    <>
      <Slide in={open && hasLocation} direction='right'>
        <Box
          sx={{
            position: 'absolute', // { sm: 'relative', md: 'absolute' },
            top: 60,
            left: 8,
            // mt: 4,
            // ml: 2,
            width: 276,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box flex={1}>
            <Card raised>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',

                  // height: 'calc(45vh - 56px)',
                  height: '50vh',
                  minHeight: 340,
                  maxHeight: 500,
                  p: { xs: 2, sm: 3, md: 4 },
                }}
              >
                <Box flex={0}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'nowrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pb: { xs: 1, sm: 1.5, md: 2 },
                    }}
                  >
                    <Typography variant='h5'>Summary</Typography>
                    <Typography>{`(${yearRange[0]} - ${yearRange[1]})`}</Typography>
                  </Box>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}></Box>
                </Box>
                <Box flex={0} sx={{ pb: { xs: 2, md: 4 } }}>
                  <CategoryCount
                    eventYears={data?.eventYears}
                    yearRange={yearRange}
                  />
                </Box>
                <Box
                  flex={1}
                  sx={{
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    '&::-webkit-scrollbar': {
                      width: '5px',
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      WebkitBorderRadius: '100px',
                    },
                    '&::-webkit-scrollbar-hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.09)',
                    },
                    '&::-webkit-scrollbar-thumb:vertical': {
                      background: '#dadada',
                      WebkitBorderRadius: '100px',
                    },
                    '&::-webkit-scrollbar-thumb:vertical:active': {
                      background: 'rgba(0, 0, 0, 0.6)',
                      WebkitBorderRadius: '100px',
                    },
                  }}
                >
                  {isLoading && !data ? <EventListLoading count={5} /> : null}
                  {data ? (
                    <EventList
                      eventProfiles={data.events}
                      yearRange={yearRange}
                    />
                  ) : null}
                </Box>
                <Box flex={0}>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    id='range-slider'
                    align='center'
                    variant='overline'
                    gutterBottom
                  >
                    Year Range
                  </Typography>
                  <Box
                    sx={{
                      px: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <RangeFilter
                      field='yearRange'
                      min={MIN_YEAR}
                      max={MAX_YEAR}
                    />
                  </Box>
                </Box>

                <ErrorBoundary fallback={null}>
                  <Suspense>
                    <LastEventDate
                      sx={{ fontSize: '10px', mt: { xs: -2, sm: 0 } }}
                    />
                  </Suspense>
                </ErrorBoundary>
              </Box>
            </Card>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              mr: -10,
              visibility: hasLocation ? 'visible' : 'hidden',
            }}
          >
            {/* use clsx or react spring to animate icon (transform 180) ?? */}
            {/* ex: https://jfelix.info/blog/using-react-spring-to-animate-svg-icons-dark-mode-toggle */}
            {/* <IconButton
              onClick={() => setOpen((prev) => !prev)}
              color='primary'
              size='small'
              aria-label={open ? 'hide' : 'show'}
              sx={{
                background: (theme) => theme.palette.background.paper,
                '[data-mui-color-scheme="dark"] &': {
                  background: (theme) => theme.palette.primaryDark[700],
                },
              }}
            >
              {open ? (
                <ChevronLeftRounded fontSize='inherit' />
              ) : (
                <ChevronRightRounded fontSize='inherit' />
              )}
            </IconButton> */}
            <Button
              onClick={() => setOpen((prev) => !prev)}
              variant='contained'
              color='inherit'
              sx={{
                mx: 1,
                maxHeight: 30,
                minWidth: 30,
                maxWidth: 30,
                m: 0.5,
                color: 'primary.main',
              }}
              aria-label={open ? 'hide' : 'show'}
            >
              {open ? (
                <ChevronLeftRounded fontSize='small' />
              ) : (
                <ChevronRightRounded fontSize='small' />
              )}
            </Button>
          </Box>
        </Box>
      </Slide>
    </>
  );
};

function EventListLoading({ count = 5 }: { count?: number }) {
  let arr = new Array(count).fill(null);

  return (
    <List>
      {arr.map((_, i) => (
        <ListItem
          key={`event-list-skeleton-${i}`}
          dense
          sx={{
            px: 1,
          }}
        >
          <Skeleton variant='rounded' height={18} width='100%' sx={{ my: 1 }} />
        </ListItem>
      ))}
    </List>
  );
}
