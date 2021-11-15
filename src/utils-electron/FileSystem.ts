import fs from 'fs';
import path from 'path';
import { $ErrorReport, ErrorReport } from '../utils/ErrorReport';

export const $FileSystem = {
  copyFile: (sourcePath: string, targetPath: string) => {
    try {
      fs.copyFileSync(sourcePath, targetPath);
    } catch (error) {
      return $ErrorReport.make(
        `Failed to copy file from "${sourcePath}" to "${targetPath}"`,
      );
    }
  },

  createDirectory: (path: string): ErrorReport | undefined => {
    try {
      fs.mkdirSync(path);
    } catch {
      return $ErrorReport.make(`Failed to create directory "${path}"`);
    }
  },

  join: path.join,

  removePath: (path: string): ErrorReport | undefined => {
    try {
      fs.rmSync(path, { recursive: true });
    } catch {
      return $ErrorReport.make(`Failed to delete path "${path}"`);
    }
  },

  validateExistsDir: (path: string): ErrorReport | undefined => {
    const errorPrefix = 'Directory does not exist';
    return !path
      ? $ErrorReport.make(`${errorPrefix}: path is empty`)
      : !fs.existsSync(path)
      ? $ErrorReport.make(`${errorPrefix}: path "${path}" does not exist`)
      : !fs.lstatSync(path).isDirectory()
      ? $ErrorReport.make(`${errorPrefix}: path "${path}" is not a directory`)
      : undefined;
  },

  validateExistsFile: (path: string): ErrorReport | undefined => {
    const errorPrefix = 'File does not exist';
    return !path
      ? $ErrorReport.make(`${errorPrefix}: path is empty`)
      : !fs.existsSync(path)
      ? $ErrorReport.make(`${errorPrefix}: path "${path}" does not exist`)
      : !fs.lstatSync(path).isFile()
      ? $ErrorReport.make(`${errorPrefix}: path "${path}" is not a file`)
      : undefined;
  },

  validateHasExtension: (
    path: string,
    extension: string,
  ): ErrorReport | undefined => {
    const errorPrefix = 'File does not have extension';
    return !path
      ? $ErrorReport.make(`${errorPrefix}: path is empty`)
      : !path.endsWith(extension)
      ? $ErrorReport.make(
          `${errorPrefix}: path "${path}" does not have extension "${extension}"`,
        )
      : undefined;
  },

  validateIsValidName: (name: string): ErrorReport | undefined => {
    const errorPrefix = 'Name is not valid';
    return !name
      ? $ErrorReport.make(`${errorPrefix}: name is empty`)
      : !/^[a-zA-Z0-9_]+$/.test(name)
      ? $ErrorReport.make(
          `${errorPrefix}: name "${name}" contains invalid characters`,
        )
      : undefined;
  },

  validateNotExists: (path: string): ErrorReport | undefined => {
    const errorPrefix = 'Path already exists';
    return !path
      ? $ErrorReport.make(`${errorPrefix}: path is empty`)
      : fs.existsSync(path)
      ? $ErrorReport.make(`${errorPrefix}: path "${path}" already exist`)
      : undefined;
  },
};
