import { z } from 'zod';
import { $EitherErrorOr, EitherErrorOr } from '../utils/EitherErrorOr';
import { $ErrorReport, ErrorReport } from '../utils/ErrorReport';
import { $ProjectSnapshot, ProjectSnapshot } from './ProjectSnapshot';

const { $FileSystem } = window.api;

const ProjectInfoSchema = z.object({
  name: z.string(),
  author: z.string(),
});

export type ProjectInfo = z.infer<typeof ProjectInfoSchema>;

export interface Project {
  info: ProjectInfo;
  directory: string;

  latest: ProjectSnapshot;
  backups: ProjectSnapshot[];
}

export const $Project = {
  // Constants

  ROM_FILE_NAME: 'rom.smc',
  INFO_FILE_NAME: 'info.json',
  LATEST_SNAPSHOT_DIR_NAME: 'latest',
  BACKUPS_DIR_NAME: 'backups',

  // Constructors

  createFromSource: ({
    name,
    author,
    locationDirPath,
    romFilePath,
  }: {
    name: string;
    author: string;
    locationDirPath: string;
    romFilePath: string;
  }): EitherErrorOr<Project> => {
    const errorPrefix = 'Could not create project';
    let error: ErrorReport | undefined;

    const directory = $FileSystem.join(locationDirPath, name);

    // Validation
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

    // Create directory
    if ((error = $FileSystem.createDirectory(directory))) {
      const errorMessage = `${errorPrefix}: failed to create directory`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Copy ROM file
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

    // Create info file
    const info = { name, author };
    if ((error = $Project.saveInfo(directory, info))) {
      $FileSystem.removePath(directory);
      const errorMessage = `${errorPrefix}: failed to save info`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Create latest snapshot
    const latest = $ProjectSnapshot.create({
      name: $Project.LATEST_SNAPSHOT_DIR_NAME,
      locationDirPath: directory,
    });
    if (latest.isError) {
      $FileSystem.removePath(directory);
      const errorMessage = `${errorPrefix}: failed to create latest snapshot`;
      return $EitherErrorOr.error(latest.error.extend(errorMessage));
    }

    // Create backups
    const backupsDirectory = $FileSystem.join(
      directory,
      $Project.BACKUPS_DIR_NAME,
    );
    const backups: ProjectSnapshot[] = [];
    if ((error = $FileSystem.createDirectory(backupsDirectory))) {
      $FileSystem.removePath(directory);
      const errorMessage = `${errorPrefix}: failed to create backups directory`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Create project
    return $EitherErrorOr.value({
      info,
      directory,
      latest: latest.value,
      backups,
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

    const info = $Project.loadInfo(directory);
    if (info.isError) {
      const errorMessage = `${errorPrefix}: failed to load info`;
      return $EitherErrorOr.error(info.error.extend(errorMessage));
    }

    const latestDirectory = $FileSystem.join(
      directory,
      $Project.LATEST_SNAPSHOT_DIR_NAME,
    );
    const latest = $ProjectSnapshot.open({ directory: latestDirectory });
    if (latest.isError) {
      const errorMessage = `${errorPrefix}: failed to open latest snapshot`;
      return $EitherErrorOr.error(latest.error.extend(errorMessage));
    }

    const backups: ProjectSnapshot[] = [];

    return $EitherErrorOr.value({
      info: info.value,
      directory,
      latest: latest.value,
      backups,
    });
  },

  // Methods

  getInfo: (project: Project): ProjectInfo => project.info,

  setInfo: (project: Project, info: ProjectInfo): EitherErrorOr<Project> => {
    const error = $Project.saveInfo(project.directory, info);
    return error
      ? $EitherErrorOr.error(error)
      : $EitherErrorOr.value({ ...project, info });
  },

  // Utils

  loadInfo: (directory: string): EitherErrorOr<ProjectInfo> => {
    const errorPrefix = 'Could not load project info';

    const infoFilePath = $FileSystem.join(directory, $Project.INFO_FILE_NAME);
    const infoOrError = $FileSystem.loadJson(infoFilePath);
    if (infoOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to load info file`;
      return $EitherErrorOr.error(infoOrError.error.extend(errorMessage));
    }

    const info = ProjectInfoSchema.safeParse(infoOrError.value);
    if (!info.success) {
      const errorMessage = `${errorPrefix}: info object is not valid`;
      return $EitherErrorOr.error($ErrorReport.make(errorMessage));
    }

    return $EitherErrorOr.value(info.data);
  },

  saveInfo: (directory: string, info: ProjectInfo): ErrorReport | undefined => {
    const infoFilePath = $FileSystem.join(directory, $Project.INFO_FILE_NAME);
    const error = $FileSystem.saveJson(infoFilePath, info);
    if (error) {
      const errorMessage = `Could not save project info`;
      return error.extend(errorMessage);
    }
  },
};
