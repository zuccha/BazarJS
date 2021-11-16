import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import {
  SettingBoolean,
  SettingNumber,
  SettingsStore,
  SettingString,
} from '../../utils-electron/Settings.types';

type SettingsState = SettingsStore;
type AppState = { settings: SettingsState };

const { $Settings } = window.api;

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

// Slice

export const initialState: SettingsState = {
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
    'settings/setString': (state, action: PayloadAction<StringAction>) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const reducer = settingsSlice.reducer;

// Selectors

export const getSettingBoolean = (key: SettingBoolean) => (state: AppState) =>
  state.settings[key];

export const getSettingNumber = (key: SettingNumber) => (state: AppState) =>
  state.settings[key];

export const getSettingString = (key: SettingString) => (state: AppState) =>
  state.settings[key];
