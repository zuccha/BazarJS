import { PriorityList } from '../utils/PriorityList';

export enum SettingString {
  NewProjectDefaultLocationDirPath = 'NewProjectDefaultLocationDirPath',
  NewProjectDefaultRomFilePath = 'NewProjectDefaultRomFilePath',
}

export enum SettingNumber {
  RecentProjectsMaxCount = 'RecentProjectsMaxCount',
}

export enum SettingBoolean {
  AskConfirmationBeforeApplyingPatch = 'AskConfirmationBeforeApplyingPatch',
}

export enum SettingPriorityList {
  RecentProjects = 'RecentProjects',
}

export type SettingsStore = {
  [SettingString.NewProjectDefaultLocationDirPath]: string;
  [SettingString.NewProjectDefaultRomFilePath]: string;
  [SettingNumber.RecentProjectsMaxCount]: number;
  [SettingBoolean.AskConfirmationBeforeApplyingPatch]: boolean;
  [SettingPriorityList.RecentProjects]: PriorityList<string>;
};
