import { z } from 'zod';
import { $DateTime } from '../utils/DateTime';
import { $EitherErrorOr, EitherErrorOr } from '../utils/EitherErrorOr';
import { $ErrorReport, ErrorReport } from '../utils/ErrorReport';

const { $FileSystem } = window.api;

const ProjectSnapshotInfoSchema = z.object({
  creationDate: z.string().refine($DateTime.isISODate),
});

export type ProjectSnapshotInfo = z.infer<typeof ProjectSnapshotInfoSchema>;

export interface ProjectSnapshot {
  info: ProjectSnapshotInfo;
  directory: string;
}

export const $ProjectSnapshot = {
  // Constants

  INFO_FILE_NAME: 'info.json',

  // Constructors

  create: ({
    name,
    locationDirPath,
  }: {
    name: string;
    locationDirPath: string;
  }): EitherErrorOr<ProjectSnapshot> => {
    const errorPrefix = 'Could not create project snapshot';
    let error: ErrorReport | undefined;

    const directory = $FileSystem.join(locationDirPath, name);

    // Validation
    if ((error = $FileSystem.validateNotExists(directory))) {
      const errorMessage = `${errorPrefix}: snapshot already exists`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Create directory
    if ((error = $FileSystem.createDirectory(directory))) {
      const errorMessage = `${errorPrefix}: failed to create directory`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Create info file
    const info = { creationDate: new Date().toISOString() };
    if ((error = $ProjectSnapshot.saveInfo(directory, info))) {
      $FileSystem.removePath(directory);
      const errorMessage = `${errorPrefix}: failed to save info`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Instantiate snapshot
    return $EitherErrorOr.value({ info, directory });
  },

  open: ({
    directory,
  }: {
    directory: string;
  }): EitherErrorOr<ProjectSnapshot> => {
    const errorPrefix = 'Could not open project snapshot';
    let error: ErrorReport | undefined;

    if ((error = $FileSystem.validateExistsDir(directory))) {
      const errorMessage = `${errorPrefix}: directory does not exist`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    const info = $ProjectSnapshot.loadInfo(directory);
    if (info.isError) {
      const errorMessage = `${errorPrefix}: failed to load info`;
      return $EitherErrorOr.error(info.error.extend(errorMessage));
    }

    return $EitherErrorOr.value({ info: info.value, directory });
  },

  // Methods

  getInfo: (project: ProjectSnapshot): ProjectSnapshotInfo => project.info,

  setInfo: (
    project: ProjectSnapshot,
    info: ProjectSnapshotInfo,
  ): EitherErrorOr<ProjectSnapshot> => {
    const error = $ProjectSnapshot.saveInfo(project.directory, info);
    return error
      ? $EitherErrorOr.error(error)
      : $EitherErrorOr.value({ ...project, info });
  },

  // Utils

  loadInfo: (directory: string): EitherErrorOr<ProjectSnapshotInfo> => {
    const errorPrefix = 'Could not load project snapshot info';

    const infoFilePath = $FileSystem.join(
      directory,
      $ProjectSnapshot.INFO_FILE_NAME,
    );
    const infoOrError = $FileSystem.loadJson(infoFilePath);
    if (infoOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to load info file`;
      return $EitherErrorOr.error(infoOrError.error.extend(errorMessage));
    }

    const info = ProjectSnapshotInfoSchema.safeParse(infoOrError.value);
    if (!info.success) {
      const errorMessage = `${errorPrefix}: info object is not valid`;
      return $EitherErrorOr.error($ErrorReport.make(errorMessage));
    }

    return $EitherErrorOr.value(info.data);
  },

  saveInfo: (
    directory: string,
    info: ProjectSnapshotInfo,
  ): ErrorReport | undefined => {
    const infoFilePath = $FileSystem.join(
      directory,
      $ProjectSnapshot.INFO_FILE_NAME,
    );
    const error = $FileSystem.saveJson(infoFilePath, info);
    if (error) {
      const errorMessage = `Could not save project snapshot info`;
      return error.extend(errorMessage);
    }
  },
};
