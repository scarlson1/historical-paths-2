import { Divider, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import { reduce, sum } from 'lodash';
import { Fragment, useMemo } from 'react';

import type { GetEventsResponse } from 'api';
import type { EventYears } from 'types';

const categorySummary: { label: string; yearKey: keyof EventYears }[] = [
  {
    label: 'Tropical Storms',
    yearKey: 'ts',
  },
  {
    label: 'Minor Hurricanes',
    yearKey: 'h',
  },
  {
    label: 'Major Hurricanes',
    yearKey: 'mh',
  },
];

export function CategoryCount({
  eventYears,
  yearRange,
}: {
  eventYears?: GetEventsResponse['eventYears'];
  yearRange: number[];
}) {
  const { categoryTotals, totalCount } = useMemo(() => {
    if (!eventYears) {
      return {
        categoryTotals: { ts: null, h: null, mh: null },
        totalCount: null,
      };
    }

    const categoryTotals = reduce<EventYears, any>(
      eventYears,
      (result, value, key) => {
        result[key] = value.filter(
          (year) => year >= yearRange[0] && year <= yearRange[1]
        ).length;
        return result;
      },
      {}
    );

    const totalCount = sum(Object.values(categoryTotals));

    return { categoryTotals, totalCount };
  }, [eventYears, yearRange]);

  return (
    <Grid container rowSpacing={1} columnSpacing={2}>
      {categorySummary.map(({ label, yearKey }) => (
        <Fragment key={yearKey}>
          <Grid xs={9}>
            <Typography textAlign='left' noWrap>{`${label}:`}</Typography>
          </Grid>
          <Grid xs={3}>
            <Typography
              variant='body1'
              fontWeight='fontWeightBold'
              textAlign='right'
            >
              {categoryTotals[yearKey] ?? '--'}
            </Typography>
          </Grid>
        </Fragment>
      ))}
      <Grid xs={12}>
        <Divider />
      </Grid>
      <Grid xs={9}>
        <Typography textAlign='left' noWrap>
          Total:
        </Typography>
      </Grid>
      <Grid xs={3}>
        <Typography
          variant='body1'
          fontWeight='fontWeightBold'
          textAlign='right'
        >
          {totalCount ?? '--'}
        </Typography>
      </Grid>
    </Grid>
  );
}
