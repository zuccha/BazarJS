import { z } from 'zod';
import { $IResource, IResource } from '../core-interfaces/IResource';
import { $EitherErrorOr, EitherErrorOr } from '../utils/EitherErrorOr';
import { $ErrorReport, ErrorReport } from '../utils/ErrorReport';
import { Patch } from './Patch';
import { $ProjectSnapshot, ProjectSnapshot } from './ProjectSnapshot';

const { $FileSystem } = window.api;

// Resource

const ProjectInfoSchema = z.object({
  name: z.string(),
  author: z.string(),
});

export type ProjectInfo = z.infer<typeof ProjectInfoSchema>;

const $Resource = $IResource.implement({
  label: 'project',
  infoSchema: ProjectInfoSchema,
});

// Project

export interface Project extends IResource<ProjectInfo> {
  latest: ProjectSnapshot;
  backups: ProjectSnapshot[];
}

const ROM_FILE_NAME = 'rom.smc';
const LATEST_DIR_NAME = 'latest';
const BACKUPS_DIR_NAME = 'backups';

export const $Project = {
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

    const info = { name, author };
    const resourceOrError = $Resource.create(locationDirPath, name, info);
    if (resourceOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to create resource`;
      return $EitherErrorOr.error(resourceOrError.error.extend(errorMessage));
    }
    const resource = resourceOrError.value;

    // Copy ROM file
    if (
      (error = $FileSystem.copyFile(
        romFilePath,
        $FileSystem.join(resource.directoryPath, ROM_FILE_NAME),
      ))
    ) {
      $Resource.remove(resource);
      const errorMessage = `${errorPrefix}: failed to copy ROM file`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Create latest snapshot
    const latest = $ProjectSnapshot.create({
      locationDirPath: resource.directoryPath,
      name: LATEST_DIR_NAME,
    });
    if (latest.isError) {
      $Resource.remove(resource);
      const errorMessage = `${errorPrefix}: failed to create latest snapshot`;
      return $EitherErrorOr.error(latest.error.extend(errorMessage));
    }

    // Create backups
    const backupsDirectory = $Resource.path(resource, BACKUPS_DIR_NAME);
    const backups: ProjectSnapshot[] = [];
    if ((error = $FileSystem.createDirectory(backupsDirectory))) {
      $Resource.remove(resource);
      const errorMessage = `${errorPrefix}: failed to create backups directory`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Create project
    return $EitherErrorOr.value({
      ...resource,
      latest: latest.value,
      backups,
    });
  },

  open: ({
    directoryPath,
  }: {
    directoryPath: string;
  }): EitherErrorOr<Project> => {
    const errorPrefix = 'Could not open project';
    let error: ErrorReport | undefined;

    const resourceOrError = $Resource.open(directoryPath);
    if (resourceOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to open project info`;
      return $EitherErrorOr.error(resourceOrError.error.extend(errorMessage));
    }
    const resource = resourceOrError.value;

    const romFilePath = $Resource.path(resource, ROM_FILE_NAME);
    if ((error = $FileSystem.validateExistsFile(romFilePath))) {
      const errorMessage = `${errorPrefix}: ROM file does not exist`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    const latestDirectoryPath = $Resource.path(resource, LATEST_DIR_NAME);
    const latest = $ProjectSnapshot.open({
      directoryPath: latestDirectoryPath,
    });
    if (latest.isError) {
      const errorMessage = `${errorPrefix}: failed to open latest snapshot`;
      return $EitherErrorOr.error(latest.error.extend(errorMessage));
    }

    const backups: ProjectSnapshot[] = [];

    return $EitherErrorOr.value({
      ...resource,
      latest: latest.value,
      backups,
    });
  },

  // Methods

  ...$Resource.inherit<Project>(),

  getPatches: (project: Project): Patch[] => {
    return project.latest.patches;
  },

  addPatchFromDirectory: (
    project: Project,
    {
      name,
      sourceDirPath,
      mainFilePath,
    }: {
      name: string;
      sourceDirPath: string;
      mainFilePath: string;
    },
  ): EitherErrorOr<Project> => {
    const errorPrefix = 'Could not add patch to project';

    const latestOrError = $ProjectSnapshot.addPatchFromDirectory(
      project.latest,
      {
        name,
        sourceDirPath,
        mainFilePath,
      },
    );
    if (latestOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to create patch "${name}" for latest snapshot`;
      return $EitherErrorOr.error($ErrorReport.make(errorMessage));
    }

    return $EitherErrorOr.value({ ...project, latest: latestOrError.value });
  },
};
