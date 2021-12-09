import { z } from 'zod';
import { $IResource, IResource } from '../core-interfaces/IResource';
import { $DateTime } from '../utils/DateTime';
import { $EitherErrorOr, EitherErrorOr } from '../utils/EitherErrorOr';

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
  // patches: Patch[];
}

export const $ProjectSnapshot = {
  // Inheritance

  ...$Resource.Instance,

  // Constructors

  create: ({
    locationDirPath,
    name,
  }: {
    locationDirPath: string;
    name: string;
  }): EitherErrorOr<ProjectSnapshot> => {
    const errorPrefix = 'Could not create project snapshot';

    const info = { creationDate: new Date().toISOString() };
    const resourceOrError = $Resource.Ctor.create(locationDirPath, name, info);
    if (resourceOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to create resource`;
      return $EitherErrorOr.error(resourceOrError.error.extend(errorMessage));
    }

    // Instantiate snapshot
    const resource = resourceOrError.value;
    return $EitherErrorOr.value({ ...resource });
  },

  open: ({
    directory,
  }: {
    directory: string;
  }): EitherErrorOr<ProjectSnapshot> => {
    const errorPrefix = 'Could not create project snapshot';

    const resourceOrError = $Resource.Ctor.open(directory);
    if (resourceOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to create info`;
      return $EitherErrorOr.error(resourceOrError.error.extend(errorMessage));
    }
    const resource = resourceOrError.value;

    // Instantiate snapshot
    return $EitherErrorOr.value({ ...resource });
  },
};
