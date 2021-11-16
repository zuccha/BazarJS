import { configureStore } from '@reduxjs/toolkit';
import * as navigation from './slices/navigation';
import * as core from './slices/core';

const store = configureStore({
  reducer: {
    core: core.reducer,
    navigation: navigation.reducer,
  },
});

export default store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
