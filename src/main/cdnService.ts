import { Manifest } from "../app/types";
import { Constants } from "./constants";
import { app, dialog } from "electron";
import got from "got";

export namespace CdnService {
  export let manifest: Manifest;

  export async function loadManifest() {
    try {
      manifest = await got.get(`${Constants.CDN_URL}/manifest.json`).json();
    } catch (err) {
      console.error(err);
      dialog.showErrorBox(
        "Une erreur est survenue",
        "Connexion au serveur de mise à jour impossible !\nVérifiez votre connexion internet et réessayez.\n\nSi le problème persiste, contactez nous sur Discord."
      );
      app.quit();
    }
  }
}
