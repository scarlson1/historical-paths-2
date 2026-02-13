import { httpsCallable } from 'firebase/functions';
import type { Functions } from 'firebase/functions';
import type { Coordinates, EventYears, InitialEvent } from 'types';

export type GetEventsRequest = Coordinates;
export interface GetEventsResponse {
  [key: string]: any;
  events: InitialEvent[];
  eventYears: EventYears;
}

export const getEvents = (functions: Functions, args: GetEventsRequest) =>
  httpsCallable<GetEventsRequest, GetEventsResponse>(functions, 'eventsv2')(args);
