import React from 'react';
import { Now } from './features/tides/Now';
import { Tick } from './features/tides/Tick';
import { HighLow } from './features/tides/HighLow';

function App() {
  return (
    <>
      <Tick />
      <Now />
      <HighLow />
    </>
  );
}

export default App;
