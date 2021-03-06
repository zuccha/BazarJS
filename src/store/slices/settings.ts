import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { Setting, SettingsStore } from '../../utils-electron/Settings.types';
import { ErrorReport } from '../../utils/ErrorReport';
import { $PriorityList } from '../../utils/PriorityList';

type SettingsState = Omit<
  SettingsStore,
  // These settings are handled by the toolchain
  Setting.ToolEditorExePath | Setting.ToolEmulatorExePath
>;

type LocalSetting = keyof SettingsState;

type AppState = { settings: SettingsState };

const { $Settings } = window.api;

// Types

type SetSettingActionPayload<S extends LocalSetting> = PayloadAction<{
  key: S;
  value: SettingsState[S];
}>;

const SetSettingActionType = 'settings/set';

// Selectors

export const getSetting =
  <S extends LocalSetting>(key: S) =>
  (state: AppState): SettingsState[S] =>
    state.settings[key];

// Thunks

export const setSetting =
  <S extends LocalSetting>(key: S, value: SettingsStore[S]) =>
  (dispatch: Dispatch<SetSettingActionPayload<S>>): ErrorReport | undefined => {
    const error = $Settings.set(key, value);
    if (!error) {
      dispatch({ type: SetSettingActionType, payload: { key, value } });
    }
    return error;
  };

export const prioritizeRecentProject =
  (dirPath: string) =>
  (
    dispatch: Dispatch<SetSettingActionPayload<Setting.RecentProjects>>,
    getState: () => AppState,
  ): ErrorReport | undefined => {
    const key = Setting.RecentProjects;
    const recentProjects = getState().settings[key];
    const value = $PriorityList.prioritize(recentProjects, dirPath);
    const error = $Settings.set(key, value);
    if (!error) {
      dispatch({ type: SetSettingActionType, payload: { key, value } });
    }
    return error;
  };

export const removeRecentProject =
  (dirPath: string) =>
  (
    dispatch: Dispatch<SetSettingActionPayload<Setting.RecentProjects>>,
    getState: () => AppState,
  ): ErrorReport | undefined => {
    const key = Setting.RecentProjects;
    const recentProjects = getState().settings[key];
    const value = $PriorityList.remove(recentProjects, dirPath);
    const error = $Settings.set(key, value);
    if (!error) {
      dispatch({ type: SetSettingActionType, payload: { key, value } });
    }
    return error;
  };

// Slice

export const initialState: SettingsState = {
  NewProjectDefaultAuthor: $Settings.get(Setting.NewProjectDefaultAuthor, ''),
  NewProjectDefaultLocationDirPath: $Settings.get(
    Setting.NewProjectDefaultLocationDirPath,
    '',
  ),
  NewProjectDefaultRomFilePath: $Settings.get(
    Setting.NewProjectDefaultRomFilePath,
    '',
  ),
  RecentProjectsMaxCount: $Settings.get(Setting.RecentProjectsMaxCount, 6),
  AskConfirmationBeforeApplyingPatch: $Settings.get(
    Setting.PatchAskConfirmationBeforeApply,
    true,
  ),
  RecentProjects: $Settings.get(
    Setting.RecentProjects,
    $PriorityList.create([], 6),
  ),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: {
    [SetSettingActionType]: <S extends LocalSetting>(
      state: SettingsState,
      action: SetSettingActionPayload<S>,
    ) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const reducer = settingsSlice.reducer;
