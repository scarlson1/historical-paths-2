import { Functions, httpsCallable } from 'firebase/functions';
import { Coordinates, EventYears, InitialEvent } from 'types';

export type GetEventsRequest = Coordinates;
export interface GetEventsResponse {
  [key: string]: any;
  events: InitialEvent[];
  eventYears: EventYears;
}

export const getEvents = (functions: Functions, args: GetEventsRequest) =>
  httpsCallable<GetEventsRequest, GetEventsResponse>(functions, 'eventsv2')(args);
