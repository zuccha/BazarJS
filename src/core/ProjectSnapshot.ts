import { z } from 'zod';
import { $IResource, IResource } from '../core-interfaces/IResource';
import { $DateTime } from '../utils/DateTime';
import { $EitherErrorOr, EitherErrorOr } from '../utils/EitherErrorOr';
import { $ErrorReport, ErrorReport } from '../utils/ErrorReport';
import { $Patch, Patch } from './Patch';

const { $FileSystem } = window.api;

// Resource

const ProjectSnapshotInfoSchema = z.object({
  creationDate: z.string().refine($DateTime.isISODate),
});

export type ProjectSnapshotInfo = z.infer<typeof ProjectSnapshotInfoSchema>;

const $Resource = $IResource.implement({
  label: 'project snapshot',
  infoSchema: ProjectSnapshotInfoSchema,
});

// ProjectSnapshot

export interface ProjectSnapshot extends IResource<ProjectSnapshotInfo> {
  patches: Patch[];
}

const PATCHES_DIR_NAME = 'patches';

export const $ProjectSnapshot = {
  // Constructors

  create: ({
    locationDirPath,
    name,
  }: {
    locationDirPath: string;
    name: string;
  }): EitherErrorOr<ProjectSnapshot> => {
    const errorPrefix = 'Could not create project snapshot';
    let error: ErrorReport | undefined;

    // Resource

    const info = { creationDate: new Date().toISOString() };
    const resourceOrError = $Resource.create(locationDirPath, name, info);
    if (resourceOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to create resource`;
      return $EitherErrorOr.error(resourceOrError.error.extend(errorMessage));
    }
    const resource = resourceOrError.value;

    // Patches

    const patches: Patch[] = [];
    const patchesDirectory = $Resource.path(resource, PATCHES_DIR_NAME);
    if ((error = $FileSystem.createDirectory(patchesDirectory))) {
      $Resource.remove(resource);
      const errorMessage = `${errorPrefix}: failed to create patches directory`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Instantiate snapshot

    return $EitherErrorOr.value({ ...resource, patches });
  },

  open: ({
    directoryPath,
  }: {
    directoryPath: string;
  }): EitherErrorOr<ProjectSnapshot> => {
    const errorPrefix = 'Could not open project snapshot';

    // Resource

    const resourceOrError = $Resource.open(directoryPath);
    if (resourceOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to open project snapshot info`;
      return $EitherErrorOr.error(resourceOrError.error.extend(errorMessage));
    }
    const resource = resourceOrError.value;

    // Patches

    const patches: Patch[] = [];
    const patchesDirPath = $Resource.path(resource, PATCHES_DIR_NAME);
    const patchNames = $FileSystem.getDirNames(patchesDirPath);
    for (const patchName of patchNames) {
      const patchDirPath = $FileSystem.join(patchesDirPath, patchName);
      const patchOrError = $Patch.open({ directoryPath: patchDirPath });
      if (patchOrError.isError) {
        const errorMessage = `${errorPrefix}: failed to open patch "${patchName}"`;
        return $EitherErrorOr.error(patchOrError.error.extend(errorMessage));
      }
      patches.push(patchOrError.value);
    }

    // Instantiate snapshot

    return $EitherErrorOr.value({ ...resource, patches });
  },

  // Methods

  ...$Resource.inherit<ProjectSnapshot>(),

  // Patches

  getPatches: (snapshot: ProjectSnapshot): Patch[] => snapshot.patches,

  addPatchFromDirectory: (
    snapshot: ProjectSnapshot,
    {
      name,
      sourceDirPath,
      mainFilePath,
    }: {
      name: string;
      sourceDirPath: string;
      mainFilePath: string;
    },
  ): EitherErrorOr<ProjectSnapshot> => {
    const errorPrefix = 'Could not add patch to project snapshot';

    if (snapshot.patches.some((patch) => patch.info.name === name)) {
      const errorMessage = `${errorPrefix}: patch with name "${name}" already exists`;
      return $EitherErrorOr.error($ErrorReport.make(errorMessage));
    }

    const patchOrError = $Patch.createFromDirectory({
      locationDirPath: $Resource.path(snapshot, PATCHES_DIR_NAME),
      name,
      sourceDirPath,
      mainFilePath,
    });
    if (patchOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to create patch "${name}"`;
      return $EitherErrorOr.error($ErrorReport.make(errorMessage));
    }

    const patches = [...snapshot.patches, patchOrError.value];

    return $EitherErrorOr.value({ ...snapshot, patches });
  },

  removePatch: (
    snapshot: ProjectSnapshot,
    patchName: string,
  ): EitherErrorOr<ProjectSnapshot> => {
    const errorPrefix = 'Could not remove patch from project snapshot';

    const patch = snapshot.patches.find(
      (patch) => patch.info.name === patchName,
    );

    if (!patch) {
      const errorMessage = `${errorPrefix}: patch "${patchName}" does not exist`;
      return $EitherErrorOr.error($ErrorReport.make(errorMessage));
    }

    const error = $Patch.remove(patch);
    if (error) {
      const errorMessage = `${errorPrefix}: failed to remove patch "${patchName}"`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    const patches = snapshot.patches.filter(
      (patch) => patch.info.name !== patchName,
    );

    return $EitherErrorOr.value({ ...snapshot, patches });
  },
};
