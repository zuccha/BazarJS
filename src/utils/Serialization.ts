import { ZodType } from 'zod';
import { $EitherErrorOr, EitherErrorOr } from './EitherErrorOr';
import { $ErrorReport, ErrorReport } from './ErrorReport';

const { $FileSystem } = window.api;

export const $Serialization = {
  load: <T>(path: string, schema: ZodType<T>): EitherErrorOr<T> => {
    const errorPrefix = 'Could not load';

    const dataOrError = $FileSystem.loadJson(path);
    if (dataOrError.isError) {
      const errorMessage = `${errorPrefix}: failed to load file`;
      return $EitherErrorOr.error(dataOrError.error.extend(errorMessage));
    }

    const data = schema.safeParse(dataOrError.value);
    if (!data.success) {
      const errorMessage = `${errorPrefix}: data is not valid`;
      return $EitherErrorOr.error($ErrorReport.make(errorMessage));
    }

    return $EitherErrorOr.value(data.data);
  },

  save: <T>(path: string, data: T): ErrorReport | undefined => {
    const error = $FileSystem.saveJson(path, data);
    if (error) {
      const errorMessage = `Could not save data`;
      return error.extend(errorMessage);
    }
  },
};
