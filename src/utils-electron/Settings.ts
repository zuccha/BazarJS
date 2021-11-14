import Store from 'electron-store';
import { SettingBoolean, SettingNumber, SettingString } from './Settings.types';

const store = new Store();

export const $Settings = {
  getBoolean: (key: SettingBoolean, defaultValue: boolean = false): boolean => {
    const value = store.get(key);
    return typeof value === 'boolean' ? value : defaultValue;
  },

  getNumber: (key: SettingNumber, defaultValue: number = 0): number => {
    const value = store.get(key);
    return typeof value === 'number' ? value : defaultValue;
  },

  getString: (key: SettingString, defaultValue: string = ''): string => {
    const value = store.get(key);
    return typeof value === 'string' ? value : defaultValue;
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
