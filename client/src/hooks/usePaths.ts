import { useQuery } from '@tanstack/react-query';
import { useFunctions } from 'reactfire';

import { GetEventsResponse, getEvents } from 'api';
import { useLocationStore } from 'context';

// TODO: use suspense hook or onError

const STALE_TIME = 15 * 60 * 1000; // 15 mins
const GC_TIME = 30 * 60 * 1000; // 30 mins

export const usePaths = () => {
  const functions = useFunctions();
  const coords = useLocationStore((state) => state.coordinates);

  return useQuery<GetEventsResponse>({
    queryKey: ['paths', coords],
    queryFn: async () => {
      // throw instead ?? should always be defined ?? (enabled: !!coords)
      // if (!coords)
      //   return {
      //     events: [],
      //     eventYears: {
      //       ts: [],
      //       h: [],
      //       mh: [],
      //     },
      //   };
      if (!coords) throw new Error('Database query missing coordinates');
      const { data } = await getEvents(functions, coords);

      return data;
    },
    enabled: !!coords,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};
