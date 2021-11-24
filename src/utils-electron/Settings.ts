import Store from 'electron-store';
import { $ErrorReport, ErrorReport } from '../utils/ErrorReport';
import { Setting, SettingsStore } from './Settings.types';

const store = new Store<SettingsStore>();

export const $Settings = {
  get: <S extends Setting>(
    key: S,
    defaultValue: SettingsStore[S],
  ): SettingsStore[S] => {
    try {
      return store.get(key, defaultValue);
    } catch {
      return defaultValue;
    }
  },
  set: <S extends Setting>(
    key: S,
    value: SettingsStore[S],
  ): ErrorReport | undefined => {
    try {
      value ? store.set(key, value) : store.delete(key);
    } catch {
      return $ErrorReport.make(`Settings: failed to set ${key} to ${value}`);
    }
  },
};
