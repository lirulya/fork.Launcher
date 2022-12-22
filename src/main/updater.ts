import { app, dialog } from "electron";
import got from "got";
import { CdnService } from "./cdnService";
import { Constants } from "./constants";
import fs from "fs";
import path from "path";
import { mainWindow } from "..";
import crypto from "crypto";
import PQueue from "p-queue";

type FileManifest = {
  path: string;
  hash: string;
};

type VersionManifest = {
  version: string;
  systems: {
    windows: boolean;
    macos: boolean;
    linux: boolean;
  };
  base: Array<FileManifest>;
  windows: Array<FileManifest>;
  macos: Array<FileManifest>;
  linux: Array<FileManifest>;
};

export namespace Updater {
  let versionManifest: VersionManifest;

  function isPlatformSupported() {
    let platformSupported;

    switch (process.platform) {
      case "win32":
        platformSupported = versionManifest.systems.windows;
        break;
      case "darwin":
        platformSupported = versionManifest.systems.macos;
        break;
      case "linux":
        platformSupported = versionManifest.systems.linux;
        break;
      default:
        platformSupported = false;
        break;
    }
    return platformSupported;
  }

  export async function startUpdate() {
    mainWindow.webContents.send("setRepairVisible", false);
    versionManifest = await got.get(`${Constants.CDN_URL}/versions/${CdnService.manifest.gameVersion}.json`).json();

    if (!isPlatformSupported()) {
      dialog.showErrorBox(
        "Système non supporté",
        "La version actuelle du client de jeu ne supporte pas votre système d'exploitation.\nNous vous invitons à nous rejoindre sur Discord pour plus d'informations."
      );
      app.quit();
      return;
    }

    const filesToCheck: Array<FileManifest> = [];

    switch (process.platform) {
      case "win32":
        filesToCheck.push(...versionManifest.base, ...versionManifest.windows);
        break;
      case "darwin":
        filesToCheck.push(...versionManifest.base, ...versionManifest.macos);
        break;
      case "linux":
        filesToCheck.push(...versionManifest.base, ...versionManifest.linux);
        break;
    }

    checkFiles(filesToCheck);
  }

  async function checkFiles(files: Array<FileManifest>) {
    if (!fs.existsSync(Constants.GAME_PATH)) {
      fs.mkdirSync(Constants.GAME_PATH);
      downloadFiles(files);
      return;
    }

    mainWindow.webContents.send("itemsLoadedUpdate", 0);
    mainWindow.webContents.send("itemsTotalUpdate", files.length - 1);

    const filesToDownload: Array<FileManifest> = [];
    for (let i = 0; i < files.length; i++) {
      mainWindow.webContents.send("itemsLoadedUpdate", i);
      const file = files[i];
      const filePath = path.join(Constants.GAME_PATH, file.path);
      if (!fs.existsSync(filePath)) {
        filesToDownload.push(file);
        continue;
      }

      const fileBuf = fs.readFileSync(filePath);
      const fileHash = crypto.createHash("md5").update(fileBuf).digest("hex");
      if (fileHash !== file.hash) {
        filesToDownload.push(file);
      }
    }

    if (filesToDownload.length > 0) {
      downloadFiles(filesToDownload);
    } else {
      updateDone();
    }
  }

  async function downloadAndSave(fileUrl: string, filePath: string) {
    try {
      const fileBuf = await got.get(fileUrl).buffer();
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }
      fs.writeFileSync(filePath, fileBuf);
    } catch (err) {
      console.error(err);
      dialog.showErrorBox(
        "Une erreur est survenue",
        "Erreur lors du téléchargement d'un fichier !\nVérifiez votre connexion internet et réessayez.\n\nSi le problème persiste, contactez nous sur Discord."
      );
      app.quit();
    }
  }

  async function downloadFiles(files: Array<FileManifest>) {
    mainWindow.webContents.send("downloadStarted", files.length);

    const queue = new PQueue({ concurrency: 2 });

    for (const file of files) {
      const filePath = path.join(Constants.GAME_PATH, file.path);
      const fileUrl = `${Constants.CDN_URL}/files/${file.hash.substring(0, 2)}/${file.hash}`;
      queue.add(() => downloadAndSave(fileUrl, filePath));
    }

    queue.on("active", () => {
      mainWindow.webContents.send("itemsLoadedUpdate", files.length - queue.size);
    });

    queue.on("idle", () => {
      updateDone();
    });
  }

  async function updateDone() {
    fs.writeFileSync(path.join(Constants.GAME_PATH, "version.dat"), versionManifest.version);
    mainWindow.webContents.send("upToDate");
    mainWindow.webContents.send("setRepairVisible", true);
  }
}
