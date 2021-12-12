import ChildProcess from 'child_process';
import { $EitherErrorOr, EitherErrorOr } from '../utils/EitherErrorOr';
import { $ErrorReport } from '../utils/ErrorReport';

export const $Shell = {
  run: (command: string, args: string[]): EitherErrorOr<string> => {
    const child = ChildProcess.spawnSync(command, args);
    return child.status === 0
      ? $EitherErrorOr.value(child.stdout.toString())
      : child.stderr
      ? $EitherErrorOr.error($ErrorReport.make(child.stderr.toString()))
      : $EitherErrorOr.error(
          $ErrorReport.make(`Command "${command}" not found`),
        );
  },
};
