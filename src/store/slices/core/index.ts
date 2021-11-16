import { combineReducers } from 'redux';
import * as project from './slices/project';

export const reducer = combineReducers({
  project: project.reducer,
});
