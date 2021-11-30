import { createSlice } from '@reduxjs/toolkit';
import { $Project, Project } from '../../../../core/Project';
import createOptionalApi from '../../../utils/createOptionalApi';

type ProjectState = Project | null;
type AppState = { core: { project: ProjectState } };

export const initialState: ProjectState = null as ProjectState;

const selectState = (state: AppState) => state.core.project;

const projectApi = createOptionalApi({
  id: 'project',
  selectState,
});

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(projectApi.id, projectApi.reduce);
  },
});

export const reducer = projectSlice.reducer;

export const getProjectInfo = projectApi.createQuery($Project.getInfo);
export const setProjectInfo = projectApi.createMutation($Project.setInfo);
export const createProjectFromSource = projectApi.createConstructor(
  $Project.createFromSource,
);
export const openProject = projectApi.createConstructor($Project.open);
