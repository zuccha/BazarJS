import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import {
  SettingBoolean,
  SettingNumber,
  SettingPriorityList,
  SettingsStore,
  SettingString,
} from '../../utils-electron/Settings.types';
import { ErrorReport } from '../../utils/ErrorReport';
import { $PriorityList, PriorityList } from '../../utils/PriorityList';

type SettingsState = SettingsStore;
type AppState = { settings: SettingsState };

const { $Settings } = window.api;

// Selectors

export const getSettingBoolean = (key: SettingBoolean) => (state: AppState) =>
  state.settings[key];

export const getSettingNumber = (key: SettingNumber) => (state: AppState) =>
  state.settings[key];

export const getSettingString = (key: SettingString) => (state: AppState) =>
  state.settings[key];

export const getRecentProjects = () => (state: AppState) =>
  state.settings[SettingPriorityList.RecentProjects];

// Thunks

type BooleanAction = { key: SettingBoolean; value: boolean };
export const setSettingBoolean =
  (key: SettingBoolean, value: boolean) =>
  (
    dispatch: Dispatch<PayloadAction<BooleanAction>>,
  ): ErrorReport | undefined => {
    const error = $Settings.setBoolean(key, value);
    if (!error) {
      dispatch({ type: 'settings/setBoolean', payload: { key, value } });
    }
    return error;
  };

type NumberAction = { key: SettingNumber; value: number };
export const setSettingNumber =
  (key: SettingNumber, value: number) =>
  (
    dispatch: Dispatch<PayloadAction<NumberAction>>,
  ): ErrorReport | undefined => {
    const error = $Settings.setNumber(key, value);
    if (!error) {
      dispatch({ type: 'settings/setNumber', payload: { key, value } });
    }
    return error;
  };

type StringAction = { key: SettingString; value: string };
export const setSettingString =
  (key: SettingString, value: string) =>
  (
    dispatch: Dispatch<PayloadAction<StringAction>>,
  ): ErrorReport | undefined => {
    const error = $Settings.setString(key, value);
    if (!error) {
      dispatch({ type: 'settings/setString', payload: { key, value } });
    }
    return error;
  };

type PriorityListAction = {
  key: SettingPriorityList;
  value: PriorityList<string>;
};
export const prioritizeRecentProject =
  (dirPath: string) =>
  (
    dispatch: Dispatch<PayloadAction<PriorityListAction>>,
    getState: () => AppState,
  ): ErrorReport | undefined => {
    const key = SettingPriorityList.RecentProjects;
    const recentProjects = getState().settings[key];
    const value = $PriorityList.prioritize(recentProjects, dirPath);
    const error = $Settings.setPriorityList(key, value);
    if (!error) {
      dispatch({ type: 'settings/setPriorityList', payload: { key, value } });
    }
    return error;
  };

export const removeRecentProject =
  (dirPath: string) =>
  (
    dispatch: Dispatch<PayloadAction<PriorityListAction>>,
    getState: () => AppState,
  ): ErrorReport | undefined => {
    const key = SettingPriorityList.RecentProjects;
    const recentProjects = getState().settings[key];
    const value = $PriorityList.remove(recentProjects, dirPath);
    const error = $Settings.setPriorityList(key, value);
    if (!error) {
      dispatch({ type: 'settings/setPriorityList', payload: { key, value } });
    }
    return error;
  };

// Slice

export const initialState: SettingsState = {
  NewProjectDefaultAuthor: $Settings.getString(
    SettingString.NewProjectDefaultAuthor,
  ),
  NewProjectDefaultLocationDirPath: $Settings.getString(
    SettingString.NewProjectDefaultLocationDirPath,
  ),
  NewProjectDefaultRomFilePath: $Settings.getString(
    SettingString.NewProjectDefaultRomFilePath,
  ),
  RecentProjectsMaxCount: $Settings.getNumber(
    SettingNumber.RecentProjectsMaxCount,
  ),
  AskConfirmationBeforeApplyingPatch: $Settings.getBoolean(
    SettingBoolean.AskConfirmationBeforeApplyingPatch,
  ),
  RecentProjects: $Settings.getPriorityList(SettingPriorityList.RecentProjects),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: {
    'settings/setBoolean': (state, action: PayloadAction<BooleanAction>) => {
      state[action.payload.key] = action.payload.value;
    },
    'settings/setNumber': (state, action: PayloadAction<NumberAction>) => {
      state[action.payload.key] = action.payload.value;
    },
    'settings/setPriorityList': (
      state,
      action: PayloadAction<PriorityListAction>,
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    'settings/setString': (state, action: PayloadAction<StringAction>) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const reducer = settingsSlice.reducer;
