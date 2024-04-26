// import { Position } from 'deck.gl';
import { z } from 'zod';

import { Coordinates } from 'types';

export const proxyCircle = z.object({
  coordinates: z.array(z.number()).min(2).max(3), // missing Float32/64Array types
  miles: z.number(),
  name: z.string(),
  details: z.string(),
});

export type ProxyCircle = z.infer<typeof proxyCircle>;

// export interface ProxyCircle {
//   coordinates: Position;
//   miles: number;
//   name: string;
//   details: string;
// }

export const getProxyCircles = ({ latitude, longitude }: Coordinates): ProxyCircle[] => {
  return [
    {
      coordinates: [longitude, latitude],
      miles: 150,
      name: '150 Miles',
      details: 'Category 5',
    },
    {
      coordinates: [longitude, latitude],
      miles: 125,
      name: '125 Miles',
      details: 'Category 3 & 4',
    },
    {
      coordinates: [longitude, latitude],
      miles: 100,
      name: '100 Miles',
      details: 'Category 1 & 2',
    },
    {
      coordinates: [longitude, latitude],
      miles: 50,
      name: '50 Miles',
      details: 'Tropical Storms',
    },
  ];
};
