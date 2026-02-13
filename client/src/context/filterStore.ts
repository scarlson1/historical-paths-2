import z from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';

import { MAX_YEAR, MIN_YEAR } from '../constants';

// connect to state with url: https://docs.pmnd.rs/zustand/guides/connect-to-state-with-url-hash
// could add filters for category, etc. ??

export const FilterValuesZ = z.object({
  yearRange: z.array(z.number().int().gte(MIN_YEAR).lte(MAX_YEAR)).length(2),
});

export type FilterValues = z.infer<typeof FilterValuesZ>;

const FilterActionsZ = z.object({
  updateFilters: z.function().args(FilterValuesZ.partial()),
  resetFilters: z.function(),
});

export type FilterActions = z.infer<typeof FilterActionsZ>;

export type FilterState = FilterValues & FilterActions;

const getUrlSearch = () => {
  return window.location.search.slice(1);
};

const persistentStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(getUrlSearch());
    const storedValue = searchParams.get(key);
    return JSON.parse(storedValue as string);
  },
  setItem: (key, val): void => {
    const searchParams = new URLSearchParams(getUrlSearch());
    searchParams.set(key, JSON.stringify(val));
    window.history.replaceState(null, '', `?${searchParams.toString()}`);
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(getUrlSearch());
    searchParams.delete(key);
    window.location.search = searchParams.toString();
  },
};

const storageOptions = {
  name: 'filterStore',
  storage: createJSONStorage<FilterState>(() => persistentStorage),
};

export const useFilterStore = create(
  persist<FilterState>(
    (set) => ({
      yearRange: [MIN_YEAR, MAX_YEAR],
      updateFilters: (updates) => set((state) => ({ ...state, ...updates })),
      resetFilters: () =>
        set((prev) => ({
          ...prev,
          yearRange: [MIN_YEAR, MAX_YEAR],
        })),
    }),
    storageOptions
  )
);

// ----- IMPLEMENTATION WITHOUT URL SEARCH SYNC -----

// import { MAX_YEAR, MIN_YEAR } from 'elements';
// import z from 'zod';
// import { create } from 'zustand';

// // could add filters for category, etc.

// export const FilterValuesZ = z.object({
//   yearRange: z.array(z.number().int().gte(MIN_YEAR).lte(MAX_YEAR)).length(2),
// });

// export type FilterValues = z.infer<typeof FilterValuesZ>;

// const FilterActionsZ = z.object({
//   updateFilters: z.function().args(FilterValuesZ.partial()),
// });

// export type FilterActions = z.infer<typeof FilterActionsZ>;

// export type FilterState = FilterValues & FilterActions;

// export const useFilterStore = create<FilterState>((set) => ({
//   yearRange: [1974, 2023],
//   updateFilters: (updates) => set((state) => ({ ...state, ...updates })),
//   // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
// }));
