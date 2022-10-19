import { useEffect, useState } from "react";
import styles from "./TitleBar.module.scss";

export const TitleBar = () => {
  const [repairVisible, setRepairVisible] = useState(false);

  const closeApp = () => {
    window.api.ipc.send("close");
  };

  const minimizeApp = () => {
    window.api.ipc.send("minimize");
  };

  const repairApp = () => {
    window.api.ipc.send("repair");
  };

  useEffect(() => {
    window.api.ipc.on("setRepairVisible", (_event, visible: boolean) => {
      setRepairVisible(visible);
    });
  }, []);

  return (
    <div className={styles.TitleBar}>
      <div className={styles.left}>{repairVisible && <div className={styles.repairButton} onClick={repairApp} />}</div>
      <div className={styles.right}>
        <div className={styles.minimizeButton} onClick={minimizeApp} />
        <div className={styles.closeButton} onClick={closeApp} />
      </div>
    </div>
  );
};
