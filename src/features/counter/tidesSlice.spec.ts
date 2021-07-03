import { data } from './data'
import counterReducer, {
  TidesState,
  setTime,
} from './tidesSlice';

describe('tides reducer', () => {
  const initialState: TidesState = {
    data: data,
    time: Date.now(),
  };

  it('should handle set time', () => {
    const time = Date.now();
    const actual = counterReducer(initialState, setTime({ time }));
    expect(actual.time).toEqual(time);
  });
});
