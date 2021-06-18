import React from 'react';
import { Now } from './features/counter/Now';
import { Tick } from './features/counter/Tick';
import { HighLow } from './features/counter/HighLow';
import { useAppSelector } from './app/hooks';

function App() {
  return (
    <div>
      <Tick />
      <div className="container h-full flex bg-gray-600 text-gray-800">
        <div className="container flex-grow">
          <Now />
          <HighLow />
        </div>
      </div>
    </div>
  );
}

export default App;
