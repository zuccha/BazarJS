import { $EitherErrorOr, EitherErrorOr } from '../utils/EitherErrorOr';
import { ErrorReport } from '../utils/ErrorReport';

const { $FileSystem } = window.api;

// #region Types

type ToolEmbedded =
  | {
      status: 'installed';
      exePath: string;
      directoryPath: string;
    }
  | { status: 'not-installed' };

export interface Toolchain {
  lunarMagic: ToolEmbedded;
}

// #endregion Types

// #region Constants

const TOOLCHAIN_DIR_PATH = $FileSystem.join(
  $FileSystem.getDataDirPath(),
  'toolchain',
);

const LUNAR_MAGIC = {
  directoryName: 'LunarMagic',
  exeName: 'Lunar Magic.exe',
  version: '3.0.0',
  downloadUrl: 'https://dl.smwcentral.net/28429/lm331.zip',
};

// #endregion Constants

const read = ({
  directoryName,
  exeName,
  version,
}: {
  directoryName: string;
  exeName: string;
  version: string;
}): ToolEmbedded => {
  const directoryPath = $FileSystem.join(TOOLCHAIN_DIR_PATH, directoryName);
  if ($FileSystem.validateExistsDir(directoryPath)) {
    return { status: 'not-installed' };
  }
  const exePath = $FileSystem.join(directoryPath, version, exeName);
  if ($FileSystem.validateExistsFile(exePath)) {
    return { status: 'not-installed' };
  }
  return { status: 'installed', exePath, directoryPath };
};

export const $Toolchain = {
  // #region Constructors

  create: (): Toolchain => ({
    lunarMagic: read(LUNAR_MAGIC),
  }),

  // #endregion Constructors

  // #region Lunar Magic

  readLunarMagic: (toolchain: Toolchain): EitherErrorOr<Toolchain> => {
    return $EitherErrorOr.value({
      ...toolchain,
      lunarMagic: read(LUNAR_MAGIC),
    });
  },

  downloadLunarMagic: async (
    toolchain: Toolchain,
  ): Promise<EitherErrorOr<Toolchain>> => {
    let error: ErrorReport | undefined;

    const { lunarMagic } = toolchain;
    if (lunarMagic.status === 'installed') {
      return $EitherErrorOr.value(toolchain);
    }

    const { directoryName, exeName, version, downloadUrl } = LUNAR_MAGIC;
    const directoryPath = $FileSystem.join(TOOLCHAIN_DIR_PATH, directoryName);
    const versionPath = $FileSystem.join(directoryPath, version);
    const exePath = $FileSystem.join(versionPath, exeName);
    const zipPath = $FileSystem.join(directoryPath, `${version}.zip`);

    error = await $FileSystem.downloadFile(zipPath, downloadUrl);
    if (error) {
      const errorMessage = 'Failed to download Lunar Magic';
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    error = $FileSystem.unzip(zipPath, versionPath);
    if (error) {
      $FileSystem.removePath(zipPath);
      const errorMessage = 'Failed to unzip Lunar Magic';
      return $EitherErrorOr.error(error.extend(errorMessage));
    }

    $FileSystem.removePath(zipPath);

    return $EitherErrorOr.value({
      ...toolchain,
      lunarMagic: {
        status: 'installed',
        exePath,
        directoryPath,
      },
    });
  },

  // #region Lunar Magic
};
