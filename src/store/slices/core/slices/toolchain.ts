import { createSlice } from '@reduxjs/toolkit';
import { $Toolchain, Toolchain } from '../../../../core/Toolchain';
import createApi from '../../../utils/createApi';

type ToolchainState = Toolchain;
type AppState = { core: { toolchain: ToolchainState } };

export const initialState: ToolchainState = $Toolchain.create();

const selectState = (state: AppState) => state.core.toolchain;

const toolchainApi = createApi({
  id: 'toolchain',
  selectState,
});

const toolchainSlice = createSlice({
  name: 'toolchain',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(toolchainApi.id, toolchainApi.reduce);
  },
});

export const reducer = toolchainSlice.reducer;

// #region Generics

export const getToolchain = toolchainApi.createQuery((toolchain) => toolchain);

// #endregion Generics

// #region Patches

export const readLunarMagic = toolchainApi.createMutation(
  $Toolchain.readLunarMagic,
);
export const downloadLunarMagic = toolchainApi.createMutationAsync(
  $Toolchain.downloadLunarMagic,
);

// #endregion Patches
