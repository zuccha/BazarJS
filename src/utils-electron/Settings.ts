import Store from 'electron-store';
import { PriorityList } from '../utils/PriorityList';
import {
  SettingBoolean,
  SettingNumber,
  SettingPriorityList,
  SettingsStore,
  SettingString,
} from './Settings.types';

const store = new Store<SettingsStore>();

export const $Settings = {
  // Boolean

  getBoolean: (key: SettingBoolean, defaultValue: boolean = false): boolean => {
    return store.get(key, defaultValue);
  },

  setBoolean: (key: SettingBoolean, value: boolean): void => {
    store.set(key, value);
  },

  // Number

  getNumber: (key: SettingNumber, defaultValue: number = 0): number => {
    return store.get(key, defaultValue);
  },

  setNumber: (key: SettingNumber, value: number): void => {
    store.set(key, value);
  },

  // PriorityList

  getPriorityList: (
    key: SettingPriorityList,
    defaultValue: PriorityList<string> = { items: [], size: 6 },
  ): PriorityList<string> => {
    return store.get(key, defaultValue);
  },

  setPriorityList: (
    key: SettingPriorityList,
    value: PriorityList<string>,
  ): void => {
    store.set(key, value);
  },

  // String

  getString: (key: SettingString, defaultValue: string = ''): string => {
    return store.get(key, defaultValue);
  },

  setString: (key: SettingString, value: string): void => {
    store.set(key, value);
  },
};
