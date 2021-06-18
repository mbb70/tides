import React from 'react';

import { useAppSelector } from '../../app/hooks';
import { DataEntry } from './data';
import {
  selectTime,
  nextLowTide,
  nextHighTide,
  followingLowTide,
  followingHighTide,
  averageHighTide,
  averageLowTide,
} from './tidesSlice';

function prettyTimeDelta(deltaMillis: number) {
  const delta = deltaMillis / 1000;
  if (delta < 60) return `${delta.toFixed()} seconds`
  let minutes = Math.floor(delta / 60);
  let seconds = delta % 60;
  if (minutes < 60) return `${minutes.toFixed()} minutes ${seconds.toFixed()} seconds`
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60; 
  if (hours < 24) return `${hours.toFixed()} hours ${minutes.toFixed()} minutes`
  let days = Math.floor(hours / 24);
  hours = hours % 60; 
  return `${days.toFixed()} days ${hours.toFixed()} hours`
}

function prettyTimeGivenCurrentTime(epochTime: number, currentEpochTime: number) {
  const daysFromNow = Math.abs(epochTime - currentEpochTime)/1000/60/60/24;
  const time = new Date(epochTime);
  let hours = time.getHours();
  const ampm = hours < 12 ? 'AM' : 'PM';
  if (hours > 12) hours -= 12;
  let minutes = time.getMinutes().toFixed();
  if (minutes.length === 1) minutes = `0${minutes}`;

  if (daysFromNow <= 1) return `${hours}:${minutes} ${ampm}`

  const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfTheWeek[time.getDay()];
  if (daysFromNow <= 7) return `${dayOfWeek} ${hours}:${time.getMinutes()} ${ampm}`
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const month = months[time.getMonth()];
  return `${month} ${time.getDate()} ${dayOfWeek} ${hours}:${time.getMinutes()} ${ampm}`
}

function HighLowCard(props: { className: string, time: number, title: string, tide: DataEntry, avg: number }) {
  const offAvg = props.tide.v - props.avg;
  const aboveBelow = offAvg > 0 ? 'above' : 'below';
  const note = Math.abs(offAvg) > 1 ? `${Math.abs(offAvg).toFixed(1)} ft. ${aboveBelow} average` : undefined;
  return (
    <div className={`sm:w-1/2 p-2 my-2 mx-4 sm:my-4 rounded-xl bg-blue-200 ${props.className}`}>
      <div className="text-4xl mb-3 text-center">{props.title}</div>
      <div className="container flex text-center">
        <div className="text-xl p-2 rounded-xl w-1/2 mr-1 bg-blue-300">
          <span>{prettyTimeGivenCurrentTime(props.tide.t, props.time)}</span>
        </div>
        <div className="text-xl p-2 rounded-xl w-1/2 ml-1 bg-blue-300">
          <span>{props.tide.v.toFixed(1)} ft</span>
        </div>
      </div>
      <div className="md:flex">
        <div className={`text-xl p-2 ${note ? 'md:w-1/2 md:mr-1' : 'w-full'} rounded-xl mt-2 bg-blue-300 text-center`}>
          <span>{prettyTimeDelta(props.tide.t - props.time)}</span>
        </div>
        {note && (
          <div className="text-xl p-2 md:w-1/2 md:ml-1 rounded-xl mt-2 bg-blue-300 text-center">
            <span>{note}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function HighLow() {
  const time = useAppSelector(selectTime);
  const low = useAppSelector(nextLowTide);
  const high = useAppSelector(nextHighTide);
  const low2 = useAppSelector(followingLowTide);
  const high2 = useAppSelector(followingHighTide);
  const averageLow = useAppSelector(averageLowTide);
  const averageHigh = useAppSelector(averageHighTide);

  return (
    <div>
      <div className="flex flex-col sm:flex-row">
        <HighLowCard className="sm:mr-2" title="Next Low" time={time} tide={low} avg={averageLow}/>
        <HighLowCard className="sm:ml-2" title="Next High" time={time} tide={high} avg={averageHigh} />
      </div>
      <div className="flex flex-col sm:flex-row">
        <HighLowCard className="sm:mr-2" title="2nd Low" time={time} tide={low2} avg={averageLow}/>
        <HighLowCard className="sm:ml-2" title="2nd High" time={time} tide={high2} avg={averageHigh} />
      </div>
    </div>
  );
}
