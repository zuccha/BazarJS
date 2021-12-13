import { Setting } from '../utils-electron/Settings.types';
import { $EitherErrorOr, EitherErrorOr } from '../utils/EitherErrorOr';
import { ErrorReport } from '../utils/ErrorReport';

const { $FileSystem, $Settings } = window.api;

// #region Types

interface ToolCustom {
  exePath: string;
}

interface ToolCustomOptions {
  name: string;
  settingKey: Setting;
}

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
  custom: {
    editor: ToolCustom;
    emulator: ToolCustom;
  };
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

const EDITOR_OPTIONS: ToolCustomOptions = {
  name: 'editor',
  settingKey: Setting.ToolEditorExePath,
};

const EMULATOR_OPTIONS: ToolCustomOptions = {
  name: 'emulator',
  settingKey: Setting.ToolEmulatorExePath,
};

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

const makeSetCustom = (
  key: keyof Toolchain['custom'],
  options: ToolCustomOptions,
): ((toolchain: Toolchain, exePath: string) => EitherErrorOr<Toolchain>) => {
  return (toolchain: Toolchain, exePath: string): EitherErrorOr<Toolchain> => {
    const toolCustom = toolchain.custom[key];
    const error = $Settings.set(options.settingKey, exePath);
    if (error) {
      const errorMessage = `Failed set tool "${options.name}"`;
      return $EitherErrorOr.error(error.extend(errorMessage));
    }
    return $EitherErrorOr.value({
      ...toolchain,
      custom: {
        ...toolchain.custom,
        [key]: {
          ...toolCustom,
          exePath,
        },
      },
    });
  };
};

const readEmbedded = ({
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

const downloadEmbedded = async ({
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

const makeReadEmbedded = (
  key: keyof Toolchain['embedded'],
  options: ToolEmbeddedOptions,
): ((toolchain: Toolchain) => EitherErrorOr<Toolchain>) => {
  return (toolchain: Toolchain): EitherErrorOr<Toolchain> => {
    const toolEmbedded = readEmbedded(options);
    return $EitherErrorOr.value({
      ...toolchain,
      embedded: {
        ...toolchain.embedded,
        [key]: toolEmbedded,
      },
    });
  };
};

const makeDownloadEmbedded = (
  key: keyof Toolchain['embedded'],
  options: ToolEmbeddedOptions,
): ((toolchain: Toolchain) => Promise<EitherErrorOr<Toolchain>>) => {
  return async (toolchain: Toolchain): Promise<EitherErrorOr<Toolchain>> => {
    const toolEmbedded = toolchain.embedded[key];
    if (toolEmbedded.status === 'installed') {
      return $EitherErrorOr.value(toolchain);
    }

    const errorOrToolEmbedded = await downloadEmbedded(options);
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
    custom: {
      editor: { exePath: $Settings.get(Setting.ToolEditorExePath, '') },
      emulator: { exePath: $Settings.get(Setting.ToolEmulatorExePath, '') },
    },
    embedded: {
      lunarMagic: readEmbedded(LUNAR_MAGIC_OPTIONS),
      asar: readEmbedded(ASAR_OPTIONS),
      flips: readEmbedded(FLIPS_OPTIONS),
      gps: readEmbedded(GPS_OPTIONS),
      pixi: readEmbedded(PIXI_OPTIONS),
      uberAsm: readEmbedded(UBER_ASM_OPTIONS),
    },
  }),

  // #endregion Constructors

  // #region Custom

  setEditor: makeSetCustom('editor', EDITOR_OPTIONS),

  setEmulator: makeSetCustom('emulator', EMULATOR_OPTIONS),

  // #endregion Custom

  // #region Embedded

  readLunarMagic: makeReadEmbedded('lunarMagic', LUNAR_MAGIC_OPTIONS),
  downloadLunarMagic: makeDownloadEmbedded('lunarMagic', LUNAR_MAGIC_OPTIONS),

  readAsar: makeReadEmbedded('asar', ASAR_OPTIONS),
  downloadAsar: makeDownloadEmbedded('asar', ASAR_OPTIONS),

  readFlips: makeReadEmbedded('flips', FLIPS_OPTIONS),
  downloadFlips: makeDownloadEmbedded('flips', FLIPS_OPTIONS),

  readGps: makeReadEmbedded('gps', GPS_OPTIONS),
  downloadGps: makeDownloadEmbedded('gps', GPS_OPTIONS),

  readPixi: makeReadEmbedded('pixi', PIXI_OPTIONS),
  downloadPixi: makeDownloadEmbedded('pixi', PIXI_OPTIONS),

  readUberAsm: makeReadEmbedded('uberAsm', UBER_ASM_OPTIONS),
  downloadUberAsm: makeDownloadEmbedded('uberAsm', UBER_ASM_OPTIONS),

  // #region Embedded
};
