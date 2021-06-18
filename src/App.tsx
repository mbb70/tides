import React from 'react';
import { Now } from './features/counter/Now';
import { Tick } from './features/counter/Tick';
import { HighLow } from './features/counter/HighLow';

function App() {
  return (
    <div>
      <Tick />
      <Now />
      <HighLow />
    </div>
  );
}

export default App;
