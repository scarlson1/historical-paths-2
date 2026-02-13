import { Slider } from '@mui/material';
import type { SliderProps } from '@mui/material';
import { useCallback, useState } from 'react';
import type { SyntheticEvent } from 'react';

import { FilterValues, FilterValuesZ, useFilterStore } from 'context';

interface RangeFilterProps extends Omit<SliderProps, 'value'> {
  field: keyof FilterValues; // keyof T
}

export function RangeFilter({ field, ...props }: RangeFilterProps) {
  const yearRange = useFilterStore((state) => state[field]);
  const updateFilters = useFilterStore((state) => state.updateFilters);
  const [range, setRange] = useState(yearRange);

  const updateRangeDisplay = useCallback((_: Event, newValues: number | number[]) => {
    if (Array.isArray(newValues)) setRange(newValues);
  }, []);

  const updateRange = useCallback((_: SyntheticEvent | Event, newValues: number | number[]) => {
    const valSchema = FilterValuesZ.pick({ [field]: true });
    const update = { [field]: newValues };
    if (valSchema.safeParse(update).success) {
      // @ts-ignore
      updateFilters(update);
    } else {
      console.log(`New values did not pass zod validation`, newValues);
    }
    // if (Array.isArray(newValues)) updateFilters({ [field]: newValues });
  }, []);

  return (
    <Slider
      value={range}
      onChange={updateRangeDisplay}
      onChangeCommitted={updateRange}
      color='primary'
      valueLabelDisplay='auto'
      sx={{
        '& .MuiSlider-thumb': {
          top: '50%',
          transform: 'translateY(-50%)',
        },
        '& span[data-index="1"]': {
          ml: '-16px',
        },
      }}
      {...props}
    />
  );
}
