import { app } from "electron";
import * as path from "path";

export class Constants {
  public static readonly CURRENT_LAUNCHER_VERSION = "1.1.2";
  public static readonly CDN_URL = "https://launcher.arena-returns.com";
  public static readonly GAME_PATH = path.join(app.getPath("appData"), "Arena Returns Client");
}
