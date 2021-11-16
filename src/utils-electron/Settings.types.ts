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

export type SettingsStore = {
  [SettingString.NewProjectDefaultLocationDirPath]: string;
  [SettingString.NewProjectDefaultRomFilePath]: string;
  [SettingNumber.RecentProjectsMaxCount]: number;
  [SettingBoolean.AskConfirmationBeforeApplyingPatch]: boolean;
};
