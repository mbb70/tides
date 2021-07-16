import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import tidesReducer from '../features/tides/tidesSlice';

export const store = configureStore({
  reducer: {
    tides: tidesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
