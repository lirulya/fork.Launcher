import { Constants } from "./constants";
import path from "path";
import fs from "fs";
import { IPC } from "./ipc";

export namespace Utils {
  export const buildJavaArgs = (platform: NodeJS.Platform) => {
    const javaArgs: Array<string> = [];

    // Library Path
    switch (platform) {
      case "win32":
        javaArgs.push(`-Djava.library.path=..\\natives\\win32\\x86;..\\jre\\bin`);
        break;
      case "linux":
        javaArgs.push(`-Djava.library.path=../natives/linux/x86:../jre/bin`);
        break;
    }

    // Game related args
    javaArgs.push("-client");

    // JVM Args
    javaArgs.push("-Xmx384M");
    javaArgs.push("-Xms192M");
    javaArgs.push("-Dsun.awt.noerasebackground=true");
    javaArgs.push("-Dhttp.agent=DofusArenaClient"); // Fix a nasty bug with in-game bug reports
    javaArgs.push("-XX:MaxDirectMemorySize=92m");
    javaArgs.push("-XX:+ForceTimeHighResolution");
    javaArgs.push("-XX:MinHeapFreeRatio=10");
    javaArgs.push("-XX:MaxHeapFreeRatio=20");
    javaArgs.push("-Xss256k");

    // JMX Remote in Dev Mode
    if (IPC.isDevMode()) {
      javaArgs.push("-Dcom.sun.management.jmxremote");
      javaArgs.push("-Dcom.sun.management.jmxremote.port=9010");
      javaArgs.push("-Dcom.sun.management.jmxremote.rmi.port=9010");
      javaArgs.push("-Dcom.sun.management.jmxremote.local.only=false");
      javaArgs.push("-Dcom.sun.management.jmxremote.authenticate=false");
      javaArgs.push("-Dcom.sun.management.jmxremote.ssl=false");
    }

    // Classpath
    const classPath = [];
    const libPath = path.join(Constants.GAME_PATH, "lib");
    const libFiles = fs.readdirSync(libPath);
    // The dark magic we use to patch bugs requires the wrapper to be loaded after the client.
    classPath.push("core.jar");
    classPath.push("wrapper.jar");
    switch (platform) {
      case "win32":
        libFiles.forEach((file) => {
          classPath.push(`..\\lib\\${file}`);
        });
        javaArgs.push(`-Djava.class.path=${classPath.join(";")}`);
        break;
      case "linux":
        libFiles.forEach((file) => {
          classPath.push(`../lib/${file}`);
        });
        javaArgs.push(`-Djava.class.path=${classPath.join(":")}`);
        break;
    }

    // Wrapper entrypoint
    javaArgs.push("com.arenareturns.client.ArenaReturnsWrapper");

    return javaArgs.join(" ");
  };
}
