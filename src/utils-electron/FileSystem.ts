import fs from 'fs';
import path from 'path';
import { $ErrorReport, ErrorReport } from '../utils/ErrorReport';

export const $FileSystem = {
  join: path.join,

  validateExistsDir: (path: string): ErrorReport | undefined => {
    return !path
      ? $ErrorReport.make('Path is empty')
      : !fs.existsSync(path)
      ? $ErrorReport.make(`Path "${path}" does not exist`)
      : !fs.lstatSync(path).isDirectory()
      ? $ErrorReport.make(`Path "${path}" is not a directory`)
      : undefined;
  },

  validateExistsFile: (path: string): ErrorReport | undefined => {
    return !path
      ? $ErrorReport.make('Path is empty')
      : !fs.existsSync(path)
      ? $ErrorReport.make(`Path "${path}" does not exist`)
      : !fs.lstatSync(path).isFile()
      ? $ErrorReport.make(`Path "${path}" is not a file`)
      : undefined;
  },

  validateHasExtension: (
    path: string,
    extension: string,
  ): ErrorReport | undefined => {
    return !path
      ? $ErrorReport.make('Path is empty')
      : !path.endsWith(extension)
      ? $ErrorReport.make(
          `Path "${path}" does not have extension "${extension}"`,
        )
      : undefined;
  },

  validateIsValidName: (name: string): ErrorReport | undefined => {
    return !name
      ? $ErrorReport.make('Name is empty')
      : !/^[a-zA-Z0-9_]+$/.test(name)
      ? $ErrorReport.make(`Name "${name}" contains invalid characters`)
      : undefined;
  },

  validateNotExists: (path: string): ErrorReport | undefined => {
    return !path
      ? $ErrorReport.make('Path is empty')
      : fs.existsSync(path)
      ? $ErrorReport.make(`Path "${path}" already exist`)
      : undefined;
  },
};
