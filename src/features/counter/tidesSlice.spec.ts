import { data } from './data'
import counterReducer, {
  TidesState,
  setTideIndex,
  setTime,
  dataSelector,
  nextTideIndex,
  nextTideSelector,
  timeSelector,
} from './tidesSlice';

describe('tides reducer', () => {
  const initialState: TidesState = {
    data: data,
    time: Date.now(),
    highlow: { low: { title: 'Low', key: 'L', index: 0 }, high: { title: 'High', key: 'L', index: 0 } }
  };

  it('should handle set time', () => {
    const time = Date.now();
    const actual = counterReducer(initialState, setTime({ time }));
    expect(actual.time).toEqual(time);
  });

  it('should find next tide', () => {
    const rootState = { tides: initialState };
    const data = dataSelector(rootState);
    const nextTideIdx = nextTideIndex(rootState);
    const nextTide = nextTideSelector(rootState);
  })

  it('should handle setTide', () => {
    const actual = counterReducer(initialState, setTideIndex({ highlow: 'low', index: 2 }));
    expect(actual.highlow.low.index).toEqual(2);
  });
});
