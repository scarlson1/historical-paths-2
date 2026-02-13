import { httpsCallable } from 'firebase/functions';
import type { Functions } from 'firebase/functions';

export interface GetLastEventResponse {
  // [key: string]: any;
  iso_time: string | null;
  year: number | null;
  name: string | null;
}

export const getLastEventDate = (functions: Functions) =>
  httpsCallable<any, GetLastEventResponse>(functions, 'getlasteventdate')({});
