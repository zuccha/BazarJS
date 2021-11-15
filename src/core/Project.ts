import { $EitherErrorOr, EitherErrorOr } from '../utils/EitherErrorOr';
import { ErrorReport } from '../utils/ErrorReport';
import { ProjectSnapshot } from './ProjectSnapshot';

const { $FileSystem } = window.api;

export interface Project {
  name: string;
  // latestSnapshot: ProjectSnapshot;
  backupSnapshots: ProjectSnapshot[];

  directory: string;
}

export const $Project = {
  /**
   * Create a project from source.
   */
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
        $FileSystem.join(directory, 'rom.smc'),
      ))
    ) {
      $FileSystem.removePath(directory);
      const errorMessage = `${errorPrefix}: failed to copy ROM file`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    return $EitherErrorOr.value({
      name,
      backupSnapshots: [],
      directory,
    });
  },

  /**
   * Get name.
   */
  getName: (project: Project): string => project.name,

  /**
   * Set name.
   */
  setName: (project: Project, name: string): EitherErrorOr<Project> => {
    return $EitherErrorOr.value({
      ...project,
      name,
    });
  },
};
