import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { DataEntry, data } from './data'

export interface TidesState {
  data: DataEntry[];
  time: number;
}

const initialState: TidesState = {
  data: data,
  time: Date.now(),
};

export const tidesSlice = createSlice({
  name: 'tides',
  initialState,
  reducers: {
    setTime: (state, action: PayloadAction<{ time: number }>) => {
      state.time = action.payload.time;
    },
  },
});

export const { setTime } = tidesSlice.actions;

export const dataSelector = (state: RootState) => state.tides.data;
export const timeSelector = (state: RootState) => state.tides.time;

export const nextTideIndex = createSelector(dataSelector, timeSelector, (data, time) => {
  return data.findIndex((entry) => time < entry.t);
});
export const prevTideSelector = createSelector(dataSelector, nextTideIndex, (data, nextTideIndex) => {
  return data[nextTideIndex - 1];
});
export const nextTideSelector = createSelector(dataSelector, nextTideIndex, (data, nextTideIndex) => {
  return data[nextTideIndex];
});
export const estCurrentTideSelector = createSelector(prevTideSelector, nextTideSelector, timeSelector, (prev, next, time) => {
  return prev.v + (time - prev.t) / (next.t - prev.t) * (next.v - prev.v);
});

/**
 * Returns the previous tide and the next 12, expecting the UI to remove either the first
 * or last, depending on how recent the previous tide was.
 */
export const nextTidesSelector = createSelector(dataSelector, nextTideIndex, (data, index) => {
  return data.slice(index - 1, index + 12);
})

export const averageLowTide = createSelector(dataSelector, (data) => {
  const lows = data.filter((e) => e.type === 'L' );
  return lows.reduce(((sum, e) => sum + e.v), 0) / lows.length;
});

export const averageHighTide = createSelector(dataSelector, (data) => {
  const highs = data.filter((e) => e.type === 'H' );
  return highs.reduce(((sum, e) => sum + e.v), 0) / highs.length;
});

export default tidesSlice.reducer;
