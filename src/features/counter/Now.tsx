import React from 'react';

import { useAppSelector } from '../../app/hooks';
import {
  timeSelector,
  estCurrentTideSelector,
  prevTideSelector,
  nextTideSelector,
} from './tidesSlice';

function cap(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function tideBgColor(height: number){
  if (height < -2) {
    return 'bg-yellow-500';
  } else if (height < -1) {
    return 'bg-yellow-400';
  } else if (height < 0) {
    return 'bg-yellow-300';
  } else if (height < 1) {
    return 'bg-yellow-200';
  } else if (height < 2) {
    return 'bg-yellow-100';
  } else if (height < 3) {
    return 'bg-blue-100';
  } else if (height < 4) {
    return 'bg-blue-200';
  } else if (height < 5) {
    return 'bg-blue-300';
  } else {
    return 'bg-blue-400';
  }
}

export function Now() {
  const time = useAppSelector(timeSelector);
  const estCurrentTide = useAppSelector(estCurrentTideSelector);
  const prevTide = useAppSelector(prevTideSelector);
  const nextTide = useAppSelector(nextTideSelector);

  const sincePrevTide = time - prevTide.t;
  const tillNextTide = nextTide.t - time;
  const closestTide = sincePrevTide > tillNextTide ? nextTide : prevTide;
  const timeToClosest = time - closestTide.t;

  let description = '';

  const closestTideName = closestTide.type === 'H' ? 'high' : 'low';
  const absMinutestToClosest = Math.round(Math.abs(timeToClosest) / 1000 / 60);
  let s = absMinutestToClosest === 1 ? '' : 's';
  const awayAgo = timeToClosest < 0 ? 'away' : 'ago';
  const pastBefore = timeToClosest < 0 ? 'before' : 'past';
  if (absMinutestToClosest < 15) {
    description = `Just ${pastBefore} ${closestTideName} tide (${absMinutestToClosest} minute${s} ${awayAgo})`
  } else if (absMinutestToClosest < 60) {
    description = `${cap(pastBefore)} ${closestTideName} tide (${absMinutestToClosest} minute${s} ${awayAgo})`
  } else {
    const absHoursToClosest = Math.round(absMinutestToClosest / 60);
    s = absHoursToClosest === 1 ? '' : 's';
    const wasIs = timeToClosest < 0 ? 'is' : 'was';
    const comingGoing = nextTide.type === 'L' ? 'going out' : 'coming in'
    description = `Tide is ${comingGoing} (${closestTideName} ${wasIs} ${absHoursToClosest} hour${s} ${awayAgo})`
  }

  const bgColor = tideBgColor(estCurrentTide);
  return (
    <div className="px-4 pt-2">
      <div className="text-center mb-4">
        <span className="text-6xl text-blue-200">Tide {estCurrentTide.toFixed(1)} ft</span>
      </div>
      <div className="flex my-2">
        <div className={`text-xl text-center py-2 px-3 rounded-xl w-full ${bgColor}`}>
          <span>{description}</span>
        </div>
      </div>
    </div>
  );
}
