import { useSuspenseQuery } from '@tanstack/react-query';
import { useFunctions } from 'reactfire';

import { getLastEventDate } from 'api';

// TODO: use suspense hook or onError

const STALE_TIME = 20 * 60 * 1000; // 15 mins
const GC_TIME = 30 * 60 * 1000; // 30 mins

export const useLastEventDate = () => {
  const functions = useFunctions();

  return useSuspenseQuery({
    queryKey: ['lastEventDate'],
    queryFn: async () => {
      const { data } = await getLastEventDate(functions);

      return data;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};
