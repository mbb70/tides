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

/**
 * Binary Search, adapted from https://stackoverflow.com/a/29018745
 * Returns the index of the next tide based on time
 * @param data  list of tide data points
 * @param time  epoch timestamp in milliseconds
 * @returns index of next tide
 */
function nextTideIndex(data: DataEntry[], time: number) {
  let min = 0;
  let max = data.length - 1;
  while (min <= max) {
    let midpoint = (max + min) >> 1; // just a divide by 2
    var error = time - data[midpoint].t;
    if (error > 0) {
        min = midpoint + 1;
    } else if (error < 0) {
        max = midpoint - 1;
    }
  }
  return min;
}

export const nextTideIndexSelector = createSelector(dataSelector, timeSelector, (data, time) => {
  return nextTideIndex(data, time);
});
export const nextTideSelector = createSelector(dataSelector, nextTideIndexSelector, (data, nextTideIndex) => {
  return data[nextTideIndex];
});
export const prevTideSelector = createSelector(dataSelector, nextTideIndexSelector, (data, nextTideIndex) => {
  return data[nextTideIndex - 1];
});

/**
 * Estimate tide height at a given time by constructing a cosine curve between the previous
 * and following tide points
 * @param time time of interest
 * @param data list of data points
 * @param nextIndex index of the next tide in data
 * @returns estimated tide height at time
 */
export function tideEstimate(time: number, data: DataEntry[], nextIndex: number) {
  let { t: x1, v: y1 } = data[nextIndex - 1];
  let { t: x2, v: y2 } = data[nextIndex];
  const t = time - x1;
  const offset = (y2 + y1)/2.0;
  const amp = (y2 - y1)/2.0;
  const freq = 1.0/(2*(x2 - x1));
  return -1.0*(amp*Math.cos(2*Math.PI*freq*t) - offset);
}

export const estCurrentTideSelector = createSelector(dataSelector, nextTideIndexSelector, timeSelector, (data, nextIndex, time) => {
  return tideEstimate(time, data, nextIndex);
});

function minutesToMillis(minutes: number) {
  return minutes*60*1000;
}
function hoursToMillis(hours: number) {
  return minutesToMillis(hours*60);
}

/**
 * 26 Hours of Tide Estimates in 15 minute increments, 7 hours behind and 19 hours ahead
 * Full Tide Period is 24 Hours 50 Minutes (50 extra minutes to account for travel of the moon)
 * So 26 hours should give just over 1 full period (2 highs, 2 lows) in view at all times
 */
export const tideEstimates = createSelector(dataSelector, timeSelector, (data, time) => {
  const interval = minutesToMillis(15);
  let timeOffset = time - hoursToMillis(7);
  let estimates: DataEntry[] = [];
  while (timeOffset < time + hoursToMillis(19)) {
    estimates.push({ type: 'L', t: timeOffset, v: tideEstimate(timeOffset, data, nextTideIndex(data, timeOffset)) });
    timeOffset += interval;
  }
  return estimates;
});

/**
 * Returns the next 8 tides
 */
export const nextTidesSelector = createSelector(dataSelector, nextTideIndexSelector, (data, index) => {
  return data.slice(index , index + 8);
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
