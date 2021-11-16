import Store from 'electron-store';
import {
  SettingBoolean,
  SettingNumber,
  SettingsStore,
  SettingString,
} from './Settings.types';

const store = new Store<SettingsStore>();

export const $Settings = {
  getBoolean: (key: SettingBoolean, defaultValue: boolean = false): boolean => {
    return store.get(key, defaultValue);
  },

  getNumber: (key: SettingNumber, defaultValue: number = 0): number => {
    return store.get(key, defaultValue);
  },

  getString: (key: SettingString, defaultValue: string = ''): string => {
    return store.get(key, defaultValue);
  },

  setBoolean: (key: SettingBoolean, value: boolean): void => {
    store.set(key, value);
  },

  setNumber: (key: SettingNumber, value: number): void => {
    store.set(key, value);
  },

  setString: (key: SettingString, value: string): void => {
    store.set(key, value);
  },
};
