module.exports = {
  packagerConfig: {
    name: 'Bazar',
    executableName: 'Bazar',
    icon: 'assets/icon',
    extraResource: ['assets'],
  },
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack/main.webpack.js',
        renderer: {
          config: './webpack/renderer.webpack.js',
          entryPoints: [
            {
              html: './public/index.html',
              js: './src/index.tsx',
              name: 'main_window',
              preload: {
                js: './electron/bridge.ts',
              },
            },
          ],
        },
      },
    ],
  ],
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'Bazar',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
