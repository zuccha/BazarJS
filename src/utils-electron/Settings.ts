import Store from 'electron-store';
import { $ErrorReport, ErrorReport } from '../utils/ErrorReport';
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
    try {
      return store.get(key, defaultValue);
    } catch {
      return defaultValue;
    }
  },

  setBoolean: (
    key: SettingBoolean,
    value: boolean,
  ): ErrorReport | undefined => {
    try {
      store.set(key, value);
    } catch {
      return $ErrorReport.make(`Settings: failed to set ${key} to ${value}`);
    }
  },

  // Number

  getNumber: (key: SettingNumber, defaultValue: number = 0): number => {
    try {
      return store.get(key, defaultValue);
    } catch {
      return defaultValue;
    }
  },

  setNumber: (key: SettingNumber, value: number): ErrorReport | undefined => {
    try {
      store.set(key, value);
    } catch {
      return $ErrorReport.make(`Settings: failed to set ${key} to ${value}`);
    }
  },

  // PriorityList

  getPriorityList: (
    key: SettingPriorityList,
    defaultValue: PriorityList<string> = { items: [], size: 6 },
  ): PriorityList<string> => {
    try {
      return store.get(key, defaultValue);
    } catch {
      return defaultValue;
    }
  },

  setPriorityList: (
    key: SettingPriorityList,
    value: PriorityList<string>,
  ): ErrorReport | undefined => {
    try {
      store.set(key, value);
    } catch {
      return $ErrorReport.make(`Settings: failed to set ${key} to ${value}`);
    }
  },

  // String

  getString: (key: SettingString, defaultValue: string = ''): string => {
    try {
      return store.get(key, defaultValue);
    } catch {
      return defaultValue;
    }
  },

  setString: (key: SettingString, value: string): ErrorReport | undefined => {
    try {
      value ? store.set(key, value) : store.delete(key);
    } catch {
      return $ErrorReport.make(`Settings: failed to set ${key} to ${value}`);
    }
  },
};
