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

interface ToolEmbeddedOptions {
  name: string;
  directoryName: string;
  exeName: string;
  version: string;
  downloadUrl: string;
}

export interface Toolchain {
  embedded: {
    lunarMagic: ToolEmbedded;
    asar: ToolEmbedded;
    flips: ToolEmbedded;
    gps: ToolEmbedded;
    pixi: ToolEmbedded;
    uberAsm: ToolEmbedded;
  };
}

// #endregion Types

// #region Constants

const TOOLCHAIN_DIR_PATH = $FileSystem.join(
  $FileSystem.getDataDirPath(),
  'toolchain',
);

const LUNAR_MAGIC_OPTIONS: ToolEmbeddedOptions = {
  name: 'Lunar Magic',
  directoryName: 'LunarMagic',
  exeName: 'Lunar Magic.exe',
  version: '3.31',
  downloadUrl: 'https://dl.smwcentral.net/28429/lm331.zip',
};

const ASAR_OPTIONS: ToolEmbeddedOptions = {
  name: 'Asar',
  directoryName: 'Asar',
  exeName: 'asar.exe',
  version: '1.81',
  downloadUrl: 'https://dl.smwcentral.net/25953/asar181.zip',
};

const FLIPS_OPTIONS: ToolEmbeddedOptions = {
  name: 'Flips',
  directoryName: 'Flips',
  exeName: 'flips.exe',
  version: '1.31',
  downloadUrl: 'https://dl.smwcentral.net/11474/floating.zip',
};

const GPS_OPTIONS: ToolEmbeddedOptions = {
  name: 'GPS',
  directoryName: 'GPS',
  exeName: 'gps.exe',
  version: '1.4.21',
  downloadUrl: 'https://dl.smwcentral.net/25810/GPS%20%28V1.4.21%29.zip',
};

const PIXI_OPTIONS: ToolEmbeddedOptions = {
  name: 'PIXI',
  directoryName: 'PIXI',
  exeName: 'pixi.exe',
  version: '1.32',
  downloadUrl: 'https://dl.smwcentral.net/26026/pixi_v1.32.zip',
};

const UBER_ASM_OPTIONS: ToolEmbeddedOptions = {
  name: 'UberASM',
  directoryName: 'UberASM',
  exeName: 'UberASMTool.exe',
  version: '1.4',
  downloadUrl: 'https://dl.smwcentral.net/19982/UberASMTool14.zip',
};

// #endregion Constants

const read = ({
  directoryName,
  exeName,
  version,
}: ToolEmbeddedOptions): ToolEmbedded => {
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

const download = async ({
  directoryName,
  exeName,
  version,
  downloadUrl,
}: ToolEmbeddedOptions): Promise<EitherErrorOr<ToolEmbedded>> => {
  let error: ErrorReport | undefined;
  const directoryPath = $FileSystem.join(TOOLCHAIN_DIR_PATH, directoryName);
  const versionPath = $FileSystem.join(directoryPath, version);
  const exePath = $FileSystem.join(versionPath, exeName);
  const zipPath = $FileSystem.join(directoryPath, `${version}.zip`);

  error = await $FileSystem.downloadFile(zipPath, downloadUrl);
  if (error) {
    const errorMessage = 'Failed to download';
    return $EitherErrorOr.error(error.extend(errorMessage));
  }

  error = $FileSystem.unzip(zipPath, versionPath);
  if (error) {
    $FileSystem.removePath(zipPath);
    const errorMessage = 'Failed to unzip';
    return $EitherErrorOr.error(error.extend(errorMessage));
  }

  $FileSystem.removePath(zipPath);

  return $EitherErrorOr.value({
    status: 'installed',
    exePath,
    directoryPath,
  });
};

const makeRead = (
  key: keyof Toolchain['embedded'],
  options: ToolEmbeddedOptions,
): ((toolchain: Toolchain) => EitherErrorOr<Toolchain>) => {
  return (toolchain: Toolchain): EitherErrorOr<Toolchain> => {
    const toolEmbedded = read(options);
    return $EitherErrorOr.value({
      ...toolchain,
      embedded: {
        ...toolchain.embedded,
        [key]: toolEmbedded,
      },
    });
  };
};

const makeDownload = (
  key: keyof Toolchain['embedded'],
  options: ToolEmbeddedOptions,
): ((toolchain: Toolchain) => Promise<EitherErrorOr<Toolchain>>) => {
  return async (toolchain: Toolchain): Promise<EitherErrorOr<Toolchain>> => {
    const toolEmbedded = toolchain.embedded[key];
    if (toolEmbedded.status === 'installed') {
      return $EitherErrorOr.value(toolchain);
    }

    const errorOrToolEmbedded = await download(options);
    if (errorOrToolEmbedded.isError) {
      const errorMessage = `Failed to download ${options.name}`;
      return $EitherErrorOr.error(
        errorOrToolEmbedded.error.extend(errorMessage),
      );
    }

    return $EitherErrorOr.value({
      ...toolchain,
      embedded: {
        ...toolchain.embedded,
        [key]: errorOrToolEmbedded.value,
      },
    });
  };
};

export const $Toolchain = {
  // #region Constructors

  create: (): Toolchain => ({
    embedded: {
      lunarMagic: read(LUNAR_MAGIC_OPTIONS),
      asar: read(ASAR_OPTIONS),
      flips: read(FLIPS_OPTIONS),
      gps: read(GPS_OPTIONS),
      pixi: read(PIXI_OPTIONS),
      uberAsm: read(UBER_ASM_OPTIONS),
    },
  }),

  // #endregion Constructors

  // #region Embedded

  readLunarMagic: makeRead('lunarMagic', LUNAR_MAGIC_OPTIONS),
  downloadLunarMagic: makeDownload('lunarMagic', LUNAR_MAGIC_OPTIONS),

  readAsar: makeRead('asar', ASAR_OPTIONS),
  downloadAsar: makeDownload('asar', ASAR_OPTIONS),

  readFlips: makeRead('flips', FLIPS_OPTIONS),
  downloadFlips: makeDownload('flips', FLIPS_OPTIONS),

  readGps: makeRead('gps', GPS_OPTIONS),
  downloadGps: makeDownload('gps', GPS_OPTIONS),

  readPixi: makeRead('pixi', PIXI_OPTIONS),
  downloadPixi: makeDownload('pixi', PIXI_OPTIONS),

  readUberAsm: makeRead('uberAsm', UBER_ASM_OPTIONS),
  downloadUberAsm: makeDownload('uberAsm', UBER_ASM_OPTIONS),

  // #region Embedded
};
