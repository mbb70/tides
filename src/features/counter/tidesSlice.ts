import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { DataEntry, data } from './data'

export interface HighLow {
  title: 'High' | 'Low';
  key: 'L' | 'H';
  index: number;
}

export interface TidesState {
  data: DataEntry[];
  time: number;
  highlow: { low: HighLow, high: HighLow };
}

const initialState: TidesState = {
  data: data,
  time: Date.now(),
  highlow: { low: { title: 'Low', key: 'L', index: 0 }, high: { title: 'High', key: 'H', index: 0 } }
};

export const tidesSlice = createSlice({
  name: 'tides',
  initialState,
  reducers: {
    setTideIndex: (state, action: PayloadAction<{ highlow: 'low' | 'high', index: number }>) => {
      state.highlow[action.payload.highlow].index = action.payload.index;
    },
    setTime: (state, action: PayloadAction<{ time: number }>) => {
      state.time = action.payload.time;
    },
  },
});

export const { setTideIndex, setTime } = tidesSlice.actions;

export const selectTime = (state: RootState) => state.tides.time;

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
export const nextTidesSelector = createSelector(dataSelector, nextTideIndex, (data, index) => {
  return data.slice(index - 1, index + 11);
})

export const lowTides = createSelector(dataSelector, (data) => {
  return data.filter((e) => e.type === 'L');
});
export const lowestTide = createSelector(lowTides, (data) => {
  return data.reduce(((min, e) => Math.min(min, e.v)), 100);
});
export const averageLowTide = createSelector(lowTides, (data) => {
  return data.reduce(((sum, e) => sum + e.v), 0) / data.length;
});

export const highTides = createSelector(dataSelector, (data) => {
  return data.filter((e) => e.type === 'H');
});
export const highestTide = createSelector(highTides, (data) => {
  return data.reduce(((max, e) => Math.max(max, e.v)), 0);
});
export const averageHighTide = createSelector(highTides, (data) => {
  return data.reduce(((sum, e) => sum + e.v), 0) / data.length;
});

export default tidesSlice.reducer;
