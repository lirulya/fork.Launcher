/**
 * TODO: Rewrite this config to ESM
 * But currently electron-builder doesn't support ESM configs
 * @see https://github.com/develar/read-config-file/issues/10
 */

/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = async function () {
  const { getVersion } = await import("./version/getVersion.mjs");

  return {
    appId: "com.arena-returns.launcher",
    productName: "Arena Returns Launcher",
    copyright: "Copyright © 2023 Arena Returns",
    compression: "maximum",
    asar: true,
    directories: {
      output: "dist",
      buildResources: "buildResources",
    },
    files: ["packages/**/dist/**"],
    extraMetadata: {
      version: getVersion(),
    },

    // Windows build
    win: {
      target: {
        target: "nsis-web",
        arch: "ia32",
      },
    },
    nsisWeb: {
      oneClick: false,
      perMachine: false,
      allowElevation: true,
      allowToChangeInstallationDirectory: true,
      menuCategory: true,
      createDesktopShortcut: "always",
      createStartMenuShortcut: true,
      artifactName: "ArenaReturnsLauncher-Setup.${ext}",
      appPackageUrl: "https://launcher.arena-returns.com/download/nsis",
    },

    // Linux build
    linux: {
      target: {
        target: "appimage",
        arch: ["ia32", "x64"],
      },
      category: "Game",
    },
  };
};
