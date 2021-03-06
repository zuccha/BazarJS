import { z } from 'zod';
import { $IResource, IResource } from '../core-interfaces/IResource';
import { $EitherErrorOr, EitherErrorOr } from '../utils/EitherErrorOr';
import { ErrorReport } from '../utils/ErrorReport';

const { $FileSystem } = window.api;

// Resource

const PatchInfoSchema = z.object({
  name: z.string(),
  mainFileRelativePath: z.string(),
});

export type PatchInfo = z.infer<typeof PatchInfoSchema>;

const $Resource = $IResource.implement({
  label: 'patch',
  infoSchema: PatchInfoSchema,
});

// Patch

export type Patch = IResource<PatchInfo>;

export const $Patch = {
  // Constructor

  createFromDirectory: ({
    locationDirPath,
    name,
    sourceDirPath,
    mainFilePath,
  }: {
    locationDirPath: string;
    name: string;
    sourceDirPath: string;
    mainFilePath: string;
  }): EitherErrorOr<Patch> => {
    const errorPrefix = 'Could not create patch';
    let error: ErrorReport | undefined;

    // Resource

    const mainFileRelativePath = $FileSystem.computeRelativePath(
      sourceDirPath,
      mainFilePath,
    );
    const info = { name, mainFileRelativePath };
    const resourceOrError = $Resource.create(locationDirPath, name, info);
    if (resourceOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to create resource`;
      return $EitherErrorOr.error(resourceOrError.error.extend(errorMessage));
    }
    const resource = resourceOrError.value;

    // Validate

    if ((error = $FileSystem.validateExistsDir(sourceDirPath))) {
      const errorMessage = `${errorPrefix}: source directory does not exist`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    if ((error = $FileSystem.validateExistsFile(mainFilePath))) {
      $Resource.remove(resource);
      const errorMessage = `${errorPrefix}: main file does not exist`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    if (
      (error = $FileSystem.validateContainsFile(sourceDirPath, mainFilePath))
    ) {
      $Resource.remove(resource);
      const errorMessage = `${errorPrefix}: main file is not in source directory`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Copy files

    if (
      (error = $FileSystem.copyDirectory(sourceDirPath, resource.directoryPath))
    ) {
      $Resource.remove(resource);
      const errorMessage = `${errorPrefix}: failed to copy patch files`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Instantiate patch

    return $EitherErrorOr.value(resource);
  },

  createFromFile: ({
    locationDirPath,
    name,
    filePath,
  }: {
    locationDirPath: string;
    name: string;
    filePath: string;
  }): EitherErrorOr<Patch> => {
    const errorPrefix = 'Could not create patch';
    let error: ErrorReport | undefined;

    // Resource

    const mainFileRelativePath = $FileSystem.basename(filePath);
    const info = { name, mainFileRelativePath };
    const resourceOrError = $Resource.create(locationDirPath, name, info);
    if (resourceOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to create resource`;
      return $EitherErrorOr.error(resourceOrError.error.extend(errorMessage));
    }
    const resource = resourceOrError.value;

    // Validate

    if ((error = $FileSystem.validateExistsFile(filePath))) {
      $Resource.remove(resource);
      const errorMessage = `${errorPrefix}: file does not exist`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Copy files

    const mainFilePath = $FileSystem.join(
      resource.directoryPath,
      mainFileRelativePath,
    );
    if ((error = $FileSystem.copyFile(filePath, mainFilePath))) {
      $Resource.remove(resource);
      const errorMessage = `${errorPrefix}: failed to copy patch file`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    // Instantiate patch

    return $EitherErrorOr.value(resource);
  },

  open: ({
    directoryPath,
  }: {
    directoryPath: string;
  }): EitherErrorOr<Patch> => {
    const errorPrefix = 'Could not open patch';

    const resourceOrError = $Resource.open(directoryPath);
    if (resourceOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to open patch info`;
      return $EitherErrorOr.error(resourceOrError.error.extend(errorMessage));
    }
    const resource = resourceOrError.value;

    // Instantiate snapshot
    return $EitherErrorOr.value({ ...resource });
  },

  remove: (patch: Patch): ErrorReport | undefined => {
    const error = $Resource.remove(patch);
    if (error) {
      const errorMessage = 'Could not remove patch: failed to remove resource';
      return error.extend(errorMessage);
    }
    return undefined;
  },

  // Methods

  ...$Resource.inherit<Patch>(),
};
