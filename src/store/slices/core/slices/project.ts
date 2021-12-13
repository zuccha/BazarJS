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

export const hasProject = projectApi.exists;

// #region Constructors

export const createProjectFromSource = projectApi.createConstructor(
  $Project.createFromSource,
);
export const openProject = projectApi.createConstructor($Project.open);

// #endregion Constructors

// #region Info

export const getProjectInfo = projectApi.createQuery($Project.getInfo);
export const setProjectInfo = projectApi.createMutation($Project.setInfo);

// #endregion Info

// #region Generics

export const openInLunarMagic = projectApi.createMutation(
  $Project.openInLunarMagic,
);

export const launchInEmulator = projectApi.createMutation(
  $Project.launchInEmulator,
);

// #endregion Generics

// #region Patches

export const getPatches = projectApi.createQuery($Project.getPatches);
export const addPatchFromDirectory = projectApi.createMutation(
  $Project.addPatchFromDirectory,
);
export const addPatchFromFile = projectApi.createMutation(
  $Project.addPatchFromFile,
);
export const removePatch = projectApi.createMutation($Project.removePatch);

// #endregion Patches
