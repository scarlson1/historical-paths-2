import { z } from 'zod';
import { create } from 'zustand';
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware';

import { Coordinates } from 'types';
import { getProxyCircles } from 'utils';

// include marker mode state ?? or separate store ?? (click count, marker mode, etc.);
// could use slice pattern ?? https://docs.pmnd.rs/zustand/guides/typescript#slices-pattern
// https://docs.pmnd.rs/zustand/guides/slices-pattern

// connect to state with url: https://docs.pmnd.rs/zustand/guides/connect-to-state-with-url-hash

// TODO: use tanstack router for url typing & reading / updating search params
// https://tanstack.com/router/latest/docs/framework/react/guide/search-params#enter-validation--typescript

const getUrlSearch = () => {
  return window.location.search.slice(1);
};

const persistentStorage: StateStorage = {
  getItem: (key): string => {
    // if (getUrlSearch()) {
    const searchParams = new URLSearchParams(getUrlSearch());
    const storedValue = searchParams.get(key);
    return JSON.parse(storedValue as string);
    // else {
    //   return JSON.parse(localStorage.getItem(key) as string)
    // }
  },
  setItem: (key, val): void => {
    // if (getUrlSearch()) {
    const searchParams = new URLSearchParams(getUrlSearch());
    searchParams.set(key, JSON.stringify(val));
    window.history.replaceState(null, '', `?${searchParams.toString()}`);
    // }
    // localStorage.setItem(key, JSON.stringify(val));
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(getUrlSearch());
    searchParams.delete(key);
    window.location.search = searchParams.toString();
  },
};

// TODO: better validation / ensure coord numbers
const coordinates = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const locationValues = z.object({
  coordinates: coordinates.nullable().catch(null),
  proxyCircles: z.array(z.any()).catch([]), // TODO: type
  highlightedIndex: z.number().catch(-1),
  markerMode: z.boolean().catch(true),
});
export type LocationValues = z.infer<typeof locationValues>;

export const locationActions = z.object({
  updateCoords: z.function().args(coordinates.nullable()),
  clearLocation: z.function(),
  setHighlightedIndex: z.function().args(z.number()),
  setMarkerMode: z.function().args(z.boolean()),
});
export type LocationActions = z.infer<typeof locationActions>;

export type LocationStore = LocationValues & LocationActions;

const storageOptions = {
  name: 'locationStore',
  storage: createJSONStorage<LocationStore>(() => persistentStorage),
};

export const useLocationStore = create(
  persist<LocationStore>(
    (set) => ({
      coordinates: null,
      proxyCircles: [],
      highlightedIndex: -1,
      markerMode: true,
      updateCoords: (newCoords: Coordinates | null) =>
        set({
          coordinates: newCoords,
          proxyCircles: newCoords ? getProxyCircles(newCoords) : [],
          markerMode: false,
        }),
      clearLocation: () => set({ coordinates: null, proxyCircles: [], markerMode: true }),
      setHighlightedIndex: (val: number) => set({ highlightedIndex: val }),
      setMarkerMode: (val: boolean) => set({ markerMode: val }),
    }),
    storageOptions
  )
);

// --------- non URL sync implementation

// import { create } from 'zustand';

// import { Coordinates } from 'types';
// import { getProxyCircles } from 'utils';

// // include marker mode state ?? or separate store ?? (click count, marker mode, etc.);
// // could use slice pattern ?? https://docs.pmnd.rs/zustand/guides/typescript#slices-pattern
// // https://docs.pmnd.rs/zustand/guides/slices-pattern

// // TODO: connect to state with url: https://docs.pmnd.rs/zustand/guides/connect-to-state-with-url-hash

// export interface LocationState {
//   coordinates: Coordinates | null;
//   proxyCircles: ReturnType<typeof getProxyCircles>;
//   highlightedIndex: number;
//   updateCoords: (newCoords: Coordinates) => void;
//   clearCoords: () => void;
//   setHighlightedIndex: (val: number) => void;
//   markerMode: boolean;
//   setMarkerMode: (val: boolean) => void;
// }

// export const useLocationStore = create<LocationState>((set) => ({
//   coordinates: null,
//   proxyCircles: [],
//   highlightedIndex: -1,
//   markerMode: true,
//   // set in url ??
//   updateCoords: (newCoords: Coordinates) =>
//     set({ coordinates: newCoords, proxyCircles: getProxyCircles(newCoords), markerMode: false }),
//   clearCoords: () => set({ coordinates: null, proxyCircles: [] }),
//   setHighlightedIndex: (val: number) => set({ highlightedIndex: val }),
//   setMarkerMode: (val: boolean) => set({ markerMode: val }),
// }));
// // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
