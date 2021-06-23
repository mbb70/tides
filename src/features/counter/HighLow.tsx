import React from 'react';

import { useAppSelector } from '../../app/hooks';
import { DataEntry } from './data';
import {
  selectTime,
  averageHighTide,
  averageLowTide,
  nextTidesSelector,
} from './tidesSlice';

function prettyTimeDelta(deltaMillis: number) {
  const delta = Math.abs(deltaMillis / 1000);
  const ago = deltaMillis < 0 ? 'ago' : '';
  if (delta < 60) return `${delta.toFixed()} seconds ${ago}`
  let minutes = Math.floor(delta / 60);
  let seconds = delta % 60;
  if (minutes < 60) return `${minutes.toFixed()} minutes ${seconds.toFixed()} seconds ${ago}`
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60; 
  if (hours < 24) return `${hours.toFixed()} hours ${minutes.toFixed()} minutes ${ago}`
  let days = Math.floor(hours / 24);
  hours = hours % 60; 
  return `${days.toFixed()} days ${hours.toFixed()} hours ${ago}`
}

function prettyTimeGivenCurrentTime(epochTime: number, currentEpochTime: number) {
  const daysFromNow = Math.abs(epochTime - currentEpochTime)/1000/60/60/24;
  const time = new Date(epochTime);
  let hours = time.getHours();
  const ampm = hours < 12 ? 'AM' : 'PM';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  let minutes = time.getMinutes().toFixed();
  if (minutes.length === 1) minutes = `0${minutes}`;

  if (daysFromNow <= 1) return `${hours}:${minutes} ${ampm}`

  const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfTheWeek[time.getDay()];
  if (daysFromNow <= 7) return `${dayOfWeek} ${hours}:${minutes} ${ampm}`
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const month = months[time.getMonth()];
  return `${month} ${time.getDate()} ${dayOfWeek} ${hours}:${minutes} ${ampm}`
}

function cardColors(type: 'H' | 'L', offAvg: number) {
  // Do not simplify this, needs explicit classnames
  // for tailwindcss tree shaking to find them
  if (offAvg < -2) {
    return {
      L: ['bg-yellow-400', 'bg-yellow-500'],
      H: ['bg-blue-50', 'bg-blue-100'],
    }[type]
  } else if (offAvg < -1) {
    return {
      L: ['bg-yellow-300', 'bg-yellow-400'],
      H: ['bg-blue-100', 'bg-blue-200'],
    }[type]
  } else if (offAvg < 1) {
    return {
      L: ['bg-yellow-200', 'bg-yellow-300'],
      H: ['bg-blue-200', 'bg-blue-300'],
    }[type]
  } else if (offAvg < 2) {
    return {
      L: ['bg-yellow-100', 'bg-yellow-200'],
      H: ['bg-blue-300', 'bg-blue-400'],
    }[type]
  }
  return {
    L: ['bg-yellow-50', 'bg-yellow-100'],
    H: ['bg-blue-400', 'bg-blue-500'],
  }[type]
}

function HighLowCard(props: { title: string, tide: DataEntry, avg: number }) {
  const time = useAppSelector(selectTime);
  const offAvg = props.tide.v - props.avg;
  const aboveBelow = offAvg > 0 ? 'above' : 'below';
  const note = Math.abs(offAvg) > 1 ? `${Math.abs(offAvg).toFixed(1)} ft. ${aboveBelow} average` : undefined;
  const [bgColor, pillColor] = cardColors(props.tide.type, offAvg);
  return (
    <div className="w-full sm:w-1/2 md:w-1/4 p-2">
      <div className={`h-full p-2 rounded-xl ${bgColor}`}>
        <div className="text-4xl mb-3 text-center">{props.title}</div>
        <div className="container flex text-center">
          <div className={`text-xl p-2 rounded-xl w-1/2 mr-1 ${pillColor}`}>
            <span>{prettyTimeGivenCurrentTime(props.tide.t, time)}</span>
          </div>
          <div className={`text-xl p-2 rounded-xl w-1/2 ml-1 ${pillColor}`}>
            <span>{props.tide.v.toFixed(1)} ft</span>
          </div>
        </div>
        <div className="md:flex">
          <div className={`text-xl p-2 ${note ? 'md:w-1/2 md:mr-1' : 'w-full'} rounded-xl mt-2 ${pillColor} text-center`}>
            <span>{prettyTimeDelta(props.tide.t - time)}</span>
          </div>
          {note && (
            <div className={`text-xl p-2 md:w-1/2 md:ml-1 rounded-xl mt-2 ${pillColor} text-center`}>
              <span>{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function numericSuffix(index: number) {
  let suffix = 'st';
  if (index === 2) {
    suffix = 'nd';
  } else if (index === 3) {
    suffix = 'rd';
  } else {
    suffix = 'th';
  }
  return suffix;
}

function tideTitle(tide: DataEntry, index: number) {
  const isHigh = tide.type === 'H';
  let title = isHigh ? 'High' : 'Low';
  if (index === 0) {
    title = `Previous: ${title}`
  } else if (index === 1) {
    title = `Next: ${title}`;
  } else {
    title = `${index}${numericSuffix(index)}: ${title}`
  }
  return title;
}

export function HighLow() {
  const tides = useAppSelector(nextTidesSelector);
  const averageLow = useAppSelector(averageLowTide);
  const averageHigh = useAppSelector(averageHighTide);

  return (
    <div className="flex flex-wrap px-2">
      {tides.map((tide, key) => {
        const avg = tide.type === 'H' ? averageHigh : averageLow;
        const title = tideTitle(tide, key);
        return <HighLowCard key={key} {...{ title, tide, avg }} />;
      })}
    </div>
  );
}
