import styles from "./Progress.module.scss";

interface ProgressBarProps {
  progress: number;
  hideProgress?: boolean;
}

export const ProgressBar = ({ progress, hideProgress }: ProgressBarProps) => {
  return (
    <div className={styles.ProgressBar}>
      <div className={styles.current} style={{ width: `${progress}%` }} />
      {!hideProgress && <div className={styles.label}>{progress}%</div>}
    </div>
  );
};
