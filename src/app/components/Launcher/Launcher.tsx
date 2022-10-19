import Loader from "../Loader";
import LogoAndSocial from "../LogoAndSocial";
import NewsCarousel from "../NewsCarousel";
import TitleBar from "../TitleBar";
import styles from "./Launcher.module.scss";

export const Launcher = () => {
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
