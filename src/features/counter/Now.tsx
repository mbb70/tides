import React from 'react';

import { useAppSelector } from '../../app/hooks';
import {
  selectTime,
  estCurrentTideSelector,
  prevTideSelector,
  nextTideSelector,
} from './tidesSlice';

function cap(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function round(n: number) {
  const floor = Math.floor(n);
  const ceil = Math.ceil(n);
  return ceil - n < n - floor ? ceil : floor;
}

export function Now() {
  const time = useAppSelector(selectTime);
  const estCurrentTide = useAppSelector(estCurrentTideSelector);
  const prevTide = useAppSelector(prevTideSelector);
  const nextTide = useAppSelector(nextTideSelector);

  const sincePrevTide = time - prevTide.t;
  const tillNextTide = nextTide.t - time;
  const closestTide = sincePrevTide > tillNextTide ? nextTide : prevTide;
  const timeToClosest = time - closestTide.t;

  let description = '';

  const closestTideName = closestTide.type === 'H' ? 'high' : 'low';
  const absMinutestToClosest = round(Math.abs(timeToClosest) / 1000 / 60);
  let s = absMinutestToClosest === 1 ? '' : 's';
  const awayAgo = timeToClosest < 0 ? 'away' : 'ago';
  const pastBefore = timeToClosest < 0 ? 'before' : 'past';
  if (absMinutestToClosest < 15) {
    description = `Just ${pastBefore} ${closestTideName} tide (${absMinutestToClosest} minute${s} ${awayAgo})`
  } else if (absMinutestToClosest < 60) {
    description = `${cap(pastBefore)} ${closestTideName} tide (${absMinutestToClosest} minute${s} ${awayAgo})`
  } else {
    const absHoursToClosest = round(absMinutestToClosest / 60);
    s = absHoursToClosest === 1 ? '' : 's';
    const wasIs = timeToClosest < 0 ? 'is' : 'was';
    const comingGoing = nextTide.type === 'L' ? 'going out' : 'coming in'
    description = `Tide is ${comingGoing} (${closestTideName} ${wasIs} ${absHoursToClosest} hour${s} ${awayAgo})`
  }

  return (
    <div className="px-4">
      <div className="text-center mb-4">
        <span className="text-6xl sm:text-8xl text-blue-200">Tide {estCurrentTide.toFixed(1)} ft</span>
      </div>
      <div className="flex my-2">
        <div className="text-xl text-center py-2 px-3 rounded-xl w-full bg-blue-300">
          <span>{description}</span>
        </div>
      </div>
    </div>
  );
}
