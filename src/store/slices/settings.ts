import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import {
  SettingBoolean,
  SettingNumber,
  SettingPriorityList,
  SettingsStore,
  SettingString,
} from '../../utils-electron/Settings.types';
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
  (dispatch: Dispatch<PayloadAction<BooleanAction>>) => {
    $Settings.setBoolean(key, value);
    dispatch({ type: 'settings/setBoolean', payload: { key, value } });
  };

type NumberAction = { key: SettingNumber; value: number };
export const setSettingNumber =
  (key: SettingNumber, value: number) =>
  (dispatch: Dispatch<PayloadAction<NumberAction>>) => {
    $Settings.setNumber(key, value);
    dispatch({ type: 'settings/setNumber', payload: { key, value } });
  };

type StringAction = { key: SettingString; value: string };
export const setSettingString =
  (key: SettingString, value: string) =>
  (dispatch: Dispatch<PayloadAction<StringAction>>) => {
    $Settings.setString(key, value);
    dispatch({ type: 'settings/setString', payload: { key, value } });
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
  ) => {
    const key = SettingPriorityList.RecentProjects;
    const recentProjects = getState().settings[key];
    const value = $PriorityList.prioritize(recentProjects, dirPath);
    $Settings.setPriorityList(key, value);
    dispatch({ type: 'settings/setPriorityList', payload: { key, value } });
  };

export const removeRecentProject =
  (dirPath: string) =>
  (
    dispatch: Dispatch<PayloadAction<PriorityListAction>>,
    getState: () => AppState,
  ) => {
    const key = SettingPriorityList.RecentProjects;
    const recentProjects = getState().settings[key];
    const value = $PriorityList.remove(recentProjects, dirPath);
    $Settings.setPriorityList(key, value);
    dispatch({ type: 'settings/setPriorityList', payload: { key, value } });
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
