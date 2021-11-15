import { configureStore } from '@reduxjs/toolkit';
import * as navigation from './navigation';
import * as project from './project';

const store = configureStore({
  reducer: {
    navigation: navigation.reducer,
    project: project.reducer,
  },
});

export default store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
