import { useKonami } from "react-konami-code";
import Loader from "../Loader";
import LogoAndSocial from "../LogoAndSocial";
import NewsCarousel from "../NewsCarousel";
import TitleBar from "../TitleBar";
import styles from "./Launcher.module.scss";

const enableDevMode = () => {
  window.api.ipc.send("enableDevMode");
};

const toggleDevTools = () => {
  window.api.ipc.send("toggleDevTools");
};

export const Launcher = () => {
  useKonami(enableDevMode, {
    code: [68, 69, 86, 77, 79, 68, 69],
  });

  useKonami(toggleDevTools, {
    code: [123],
  });

  return (
    <div className={styles.Launcher}>
      <TitleBar />
      <div className={styles.container}>
        <div className={styles.topPart}>
          <NewsCarousel />
          <LogoAndSocial />
        </div>
        <div className={styles.bottomPart}>
          <Loader />
        </div>
      </div>
    </div>
  );
};
