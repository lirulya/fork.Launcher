import path from "path";
import fs from "fs";
import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import { Constants } from "./constants";
import { CdnService } from "./cdnService";
import { Updater } from "./updater";
import { exec } from "child_process";

export namespace IPC {
  export function registerEvents(mainWindow: BrowserWindow) {
    ipcMain.on("close", () => {
      app.quit();
    });

    ipcMain.on("minimize", () => {
      mainWindow.minimize();
    });

    ipcMain.on("repair", () => {
      dialog
        .showMessageBox(mainWindow, {
          type: "question",
          buttons: ["Réparer", "Annuler"],
          title: "Réparation",
          message: "Voulez-vous réparer le client de jeu ?",
          detail: "Cette opération va vérifier tous les fichiers du jeu et télécharger ceux posant problème.",
        })
        .then((result) => {
          if (result.response === 0) {
            mainWindow.webContents.send("repairStarted");
          }
        });
    });

    ipcMain.on("openUrl", (_event, url: string) => {
      // Quick security check to make sure we are opening links
      if (!url.startsWith("https://")) {
        return;
      }
      shell.openExternal(url);
    });

    ipcMain.on("startUpdate", (_event) => {
      Updater.startUpdate();
    });

    ipcMain.on("launchGame", (_event) => {
      switch (process.platform) {
        case "win32":
          exec("start DofusArena.exe", { cwd: Constants.GAME_PATH });
          break;
      }
    });
  }

  export function registerHandlers(mainWindow: BrowserWindow) {
    ipcMain.handle("isUpdateNeeded", async () => {
      const versionFile = path.join(Constants.GAME_PATH, "version.dat");
      if (!fs.existsSync(Constants.GAME_PATH) || !fs.existsSync(versionFile)) {
        return true;
      }
      const localVersion = fs.readFileSync(versionFile, "utf-8");
      if (localVersion === CdnService.manifest.gameVersion) {
        mainWindow.webContents.send("setRepairVisible", true);
        return false;
      }
      return true;
    });

    ipcMain.handle("getCarouselData", async () => {
      return CdnService.manifest.carousel;
    });
  }
}
