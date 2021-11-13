import { configureStore } from '@reduxjs/toolkit';
import * as navigation from './navigation';

const store = configureStore({
  reducer: {
    navigation: navigation.reducer,
  },
});

export default store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
