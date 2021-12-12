import AdmZip from 'adm-zip';
import FS from 'fs';
import HTTPS from 'https';
import OS from 'os';
import Path from 'path';
import { $EitherErrorOr, EitherErrorOr } from '../utils/EitherErrorOr';
import { $ErrorReport, ErrorReport } from '../utils/ErrorReport';

export const $FileSystem = {
  basename: Path.basename,

  computeRelativePath: (basePath: string, targetPath: string): string => {
    const normalizedBasePath = Path.normalize(basePath);
    const normalizedTargetPath = Path.normalize(targetPath);
    return normalizedTargetPath.startsWith(normalizedBasePath)
      ? normalizedTargetPath.replace(normalizedBasePath, '')
      : normalizedTargetPath;
  },

  copyDirectory: (
    sourceDirPath: string,
    targetDirPath: string,
    isRecursive: boolean = false,
  ): ErrorReport | undefined => {
    try {
      // Create directory if it doesn't exist.
      const sourceDitExist = FS.existsSync(sourceDirPath);
      if (!sourceDitExist) {
        FS.mkdirSync(sourceDirPath);
      }

      // Copy files.
      const fileNames = $FileSystem.getFileNames(sourceDirPath);
      for (const fileName of fileNames) {
        const sourceFilePath = Path.join(sourceDirPath, fileName);
        const targetFilePath = Path.join(targetDirPath, fileName);
        FS.copyFileSync(sourceFilePath, targetFilePath);
      }

      if (isRecursive) {
        const subDirNames = $FileSystem.getDirNames(sourceDirPath);
        for (const subDirName of subDirNames) {
          const sourceSubDirPath = Path.join(sourceDirPath, subDirName);
          const targetSubDirPath = Path.join(targetDirPath, subDirName);
          const maybeError = $FileSystem.copyDirectory(
            sourceSubDirPath,
            targetSubDirPath,
            true,
          );
          if (maybeError) {
            return maybeError;
          }
        }
      }
    } catch (error) {
      return $ErrorReport.make(
        `Copy directory failed: failed to copy directory "${sourceDirPath}" to "${targetDirPath}"`,
      );
    }
  },

  copyFile: (sourcePath: string, targetPath: string) => {
    try {
      FS.copyFileSync(sourcePath, targetPath);
    } catch (error) {
      return $ErrorReport.make(
        `Failed to copy file from "${sourcePath}" to "${targetPath}"`,
      );
    }
  },

  createDirectory: (path: string): ErrorReport | undefined => {
    try {
      FS.mkdirSync(path);
    } catch {
      return $ErrorReport.make(`Failed to create directory "${path}"`);
    }
  },

  downloadFile: async (
    filePath: string,
    url: string,
  ): Promise<ErrorReport | undefined> => {
    return new Promise((resolve) => {
      HTTPS.get(url, (response) => {
        if (response.statusCode !== 200) {
          resolve($ErrorReport.make(`Failed to download file "${url}"`));
          return;
        }
        FS.mkdirSync(Path.dirname(filePath), { recursive: true });
        const file = FS.createWriteStream(filePath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(undefined);
        });
      });
    });
  },

  getDirNames: (directoryPath: string): string[] => {
    const filesAndDirs = FS.readdirSync(directoryPath);
    return filesAndDirs.filter((name) =>
      FS.statSync(Path.join(directoryPath, name)).isDirectory(),
    );
  },

  getDataDirPath: (): string => {
    const appdataPath =
      process.env.APPDATA ?? Path.join(OS.homedir(), 'AppData', 'Roaming');
    return OS.platform() === 'win32'
      ? Path.join(appdataPath, 'Bazar')
      : Path.join(OS.homedir(), 'Library', 'Application Support', 'Bazar');
  },

  getFileNames: (directoryPath: string): string[] => {
    const filesAndDirs = FS.readdirSync(directoryPath);
    return filesAndDirs.filter(
      (name) => !FS.statSync(Path.join(directoryPath, name)).isDirectory(),
    );
  },

  join: Path.join,

  loadJson: (path: string): EitherErrorOr<unknown> => {
    try {
      return $EitherErrorOr.value(JSON.parse(FS.readFileSync(path, 'utf8')));
    } catch {
      const errorMessage = `Failed to load JSON file "${path}"`;
      return $EitherErrorOr.error($ErrorReport.make(errorMessage));
    }
  },

  removePath: (path: string): ErrorReport | undefined => {
    try {
      FS.rmSync(path, { recursive: true });
    } catch {
      return $ErrorReport.make(`Failed to delete path "${path}"`);
    }
  },

  saveJson: (path: string, data: unknown): ErrorReport | undefined => {
    try {
      FS.writeFileSync(path, JSON.stringify(data, null, 2));
    } catch (error) {
      return $ErrorReport.make(`Failed to save JSON file "${path}"`);
    }
  },

  unzip: (zipPath: string, targetPath: string): ErrorReport | undefined => {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(targetPath, true);
    return undefined;
  },

  validateExistsDir: (path: string): ErrorReport | undefined => {
    const errorPrefix = 'Directory does not exist';
    return !path
      ? $ErrorReport.make(`${errorPrefix}: path is empty`)
      : !FS.existsSync(path)
      ? $ErrorReport.make(`${errorPrefix}: path "${path}" does not exist`)
      : !FS.lstatSync(path).isDirectory()
      ? $ErrorReport.make(`${errorPrefix}: path "${path}" is not a directory`)
      : undefined;
  },

  validateExistsFile: (path: string): ErrorReport | undefined => {
    const errorPrefix = 'File does not exist';
    return !path
      ? $ErrorReport.make(`${errorPrefix}: path is empty`)
      : !FS.existsSync(path)
      ? $ErrorReport.make(`${errorPrefix}: path "${path}" does not exist`)
      : !FS.lstatSync(path).isFile()
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

  validateContainsFile: (
    directoryPath: string,
    filePath: string,
  ): ErrorReport | undefined => {
    const normalizedFilePath = Path.normalize(filePath);
    const normalizedDirectoryPath = Path.normalize(directoryPath);
    return normalizedFilePath.startsWith(normalizedDirectoryPath)
      ? undefined
      : $ErrorReport.make(
          `Directory "${normalizedDirectoryPath}" does not contain file "${normalizedFilePath}"`,
        );
  },

  validateIsValidName: (name: string): ErrorReport | undefined => {
    const errorPrefix = 'Name is not valid';
    return !name
      ? $ErrorReport.make(`${errorPrefix}: name is empty`)
      : !/^[a-zA-Z0-9_.-]+$/.test(name)
      ? $ErrorReport.make(
          `${errorPrefix}: name "${name}" contains invalid characters`,
        )
      : undefined;
  },

  validateNotExists: (path: string): ErrorReport | undefined => {
    const errorPrefix = 'Path already exists';
    return !path
      ? $ErrorReport.make(`${errorPrefix}: path is empty`)
      : FS.existsSync(path)
      ? $ErrorReport.make(`${errorPrefix}: path "${path}" already exist`)
      : undefined;
  },
};
