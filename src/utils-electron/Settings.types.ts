import { PriorityList } from '../utils/PriorityList';

export enum Setting {
  NewProjectDefaultAuthor = 'NewProjectDefaultAuthor',
  NewProjectDefaultLocationDirPath = 'NewProjectDefaultLocationDirPath',
  NewProjectDefaultRomFilePath = 'NewProjectDefaultRomFilePath',
  PatchAskConfirmationBeforeApply = 'AskConfirmationBeforeApplyingPatch',
  RecentProjects = 'RecentProjects',
  RecentProjectsMaxCount = 'RecentProjectsMaxCount',
  ToolEditorExePath = 'ToolEditorExePath',
  ToolEmulatorExePath = 'ToolEmulatorExePath',
}

export type SettingsStore = {
  [Setting.NewProjectDefaultAuthor]: string;
  [Setting.NewProjectDefaultLocationDirPath]: string;
  [Setting.NewProjectDefaultRomFilePath]: string;
  [Setting.PatchAskConfirmationBeforeApply]: boolean;
  [Setting.RecentProjects]: PriorityList<string>;
  [Setting.RecentProjectsMaxCount]: number;
  [Setting.ToolEditorExePath]: string;
  [Setting.ToolEmulatorExePath]: string;
};
