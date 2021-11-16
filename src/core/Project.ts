import { z } from 'zod';
import { $EitherErrorOr, EitherErrorOr } from '../utils/EitherErrorOr';
import { $ErrorReport, ErrorReport } from '../utils/ErrorReport';
import { ProjectSnapshot } from './ProjectSnapshot';

const { $FileSystem } = window.api;

const ProjectConfigSchema = z.object({
  name: z.string(),
});

type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

export interface Project {
  name: string;
  // latestSnapshot: ProjectSnapshot;
  backupSnapshots: ProjectSnapshot[];

  directory: string;
}

export const $Project = {
  // Constants

  ROM_FILE_NAME: 'rom.smc',
  CONFIG_FILE_NAME: 'config.json',

  // Constructors

  createFromSource: ({
    name,
    locationDirPath,
    romFilePath,
  }: {
    name: string;
    locationDirPath: string;
    romFilePath: string;
  }): EitherErrorOr<Project> => {
    const errorPrefix = 'Could not create project';
    let error: ErrorReport | undefined;

    const directory = $FileSystem.join(locationDirPath, name);

    if ((error = $FileSystem.validateIsValidName(name))) {
      const errorMessage = `${errorPrefix}: name is not valid`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    if ((error = $FileSystem.validateExistsDir(locationDirPath))) {
      const errorMessage = `${errorPrefix}: location does not exist`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    if ((error = $FileSystem.validateNotExists(directory))) {
      const errorMessage = `${errorPrefix}: project already exists`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    if ((error = $FileSystem.validateExistsFile(romFilePath))) {
      const errorMessage = `${errorPrefix}: ROM file does not exist`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    if ((error = $FileSystem.createDirectory(directory))) {
      const errorMessage = `${errorPrefix}: failed to create directory`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    if (
      (error = $FileSystem.copyFile(
        romFilePath,
        $FileSystem.join(directory, $Project.ROM_FILE_NAME),
      ))
    ) {
      $FileSystem.removePath(directory);
      const errorMessage = `${errorPrefix}: failed to copy ROM file`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    if ((error = $Project.saveConfig(directory, { name }))) {
      const errorMessage = `${errorPrefix}: failed to save config`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    return $EitherErrorOr.value({
      name,
      backupSnapshots: [],
      directory,
    });
  },

  open: ({ directory }: { directory: string }): EitherErrorOr<Project> => {
    const errorPrefix = 'Could not open project';
    let error: ErrorReport | undefined;

    if ((error = $FileSystem.validateExistsDir(directory))) {
      const errorMessage = `${errorPrefix}: directory does not exist`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    const romFilePath = $FileSystem.join(directory, $Project.ROM_FILE_NAME);
    if ((error = $FileSystem.validateExistsFile(romFilePath))) {
      const errorMessage = `${errorPrefix}: ROM file does not exist`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    const config = $Project.loadConfig(directory);
    if (config.isError) {
      const errorMessage = `${errorPrefix}: failed to load config`;
      return $EitherErrorOr.error(config.error.extend(errorMessage));
    }

    return $EitherErrorOr.value({
      name: config.value.name,
      backupSnapshots: [],
      directory,
    });
  },

  // Methods

  getName: (project: Project): string => project.name,

  setName: (project: Project, name: string): EitherErrorOr<Project> => {
    return $EitherErrorOr.value({
      ...project,
      name,
    });
  },

  // Utils

  loadConfig: (directory: string): EitherErrorOr<ProjectConfig> => {
    const errorPrefix = 'Could not load project config';

    const configFilePath = $FileSystem.join(
      directory,
      $Project.CONFIG_FILE_NAME,
    );
    const configOrError = $FileSystem.loadJson(configFilePath);
    if (configOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to load config file`;
      return $EitherErrorOr.error(configOrError.error.extend(errorMessage));
    }

    const config = ProjectConfigSchema.safeParse(configOrError.value);
    if (!config.success) {
      const errorMessage = `${errorPrefix}: config object is not valid`;
      return $EitherErrorOr.error($ErrorReport.make(errorMessage));
    }

    return $EitherErrorOr.value(config.data);
  },

  saveConfig: (
    directory: string,
    config: ProjectConfig,
  ): ErrorReport | undefined => {
    const configFilePath = $FileSystem.join(
      directory,
      $Project.CONFIG_FILE_NAME,
    );
    const error = $FileSystem.saveJson(configFilePath, config);
    if (error) {
      const errorMessage = `Could not save project config`;
      return error.extend(errorMessage);
    }
  },
};
