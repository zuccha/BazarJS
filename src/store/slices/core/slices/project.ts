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

export const getProjectConfig = projectApi.createQuery($Project.getConfig);
export const setProjectName = projectApi.createMutation($Project.setName);
export const createProjectFromSource = projectApi.createConstructor(
  $Project.createFromSource,
);
export const openProject = projectApi.createConstructor($Project.open);
