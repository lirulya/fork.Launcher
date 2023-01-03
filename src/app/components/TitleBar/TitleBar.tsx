import React, { useEffect, useState } from "react";
import styles from "./TitleBar.module.scss";

export const TitleBar = () => {
  const [repairVisible, setRepairVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleChange = () => {
    setMenuVisible(!menuVisible);
  };

  const openGameDir = (e: React.MouseEvent<HTMLLIElement>) => {
    window.api.ipc.send("openGameDir");
    e.stopPropagation(); //we prevent the event from closing the whole menu
  };

  const openStatus = (e: React.MouseEvent<HTMLLIElement>) => {
    window.api.ipc.send("openUrl", "https://status.arena-returns.com/");
    e.stopPropagation(); //we prevent the event from closing the whole menu
  };

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
      <div className={styles.left}>
        <div className={styles.hamMenuOpenerButton} onClick={handleChange} data-checked={menuVisible}/>
        <div className={styles.hamMenu} onClick={handleChange}>
          <ul>
            <li onClick={openStatus} className={styles.iconStatus}>Voir le status des services</li>
            {repairVisible && <li onClick={openGameDir} className={styles.iconOpen}>Ouvrir le dossier du jeu</li>}
            {repairVisible && <li onClick={repairApp} className={styles.iconRepair}>Réparer</li>}
          </ul>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.minimizeButton} onClick={minimizeApp} />
        <div className={styles.closeButton} onClick={closeApp} />
      </div>
    </div>
  );
};
