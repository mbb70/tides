import { data } from './data'
import tidesReducer, {
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
    const actual = tidesReducer(initialState, setTime({ time }));
    expect(actual.time).toEqual(time);
  });
});
