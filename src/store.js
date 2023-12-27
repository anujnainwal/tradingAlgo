import { configureStore } from '@reduxjs/toolkit'
import BackTestSlice from './features/Backtest/BackTestSlice';

export const store = configureStore({
    reducer: { BackTestSlice },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });