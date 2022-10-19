import ProgressBar from "../ProgressBar";
import styles from "./Progress.module.scss";

interface ProgressProps {
  label: string;
  progress: number;
  hideProgress?: boolean;
}

export const Progress = ({ label, progress, hideProgress }: ProgressProps) => {
  return (
    <div className={styles.Progress}>
      <div className={styles.Label}>{label}</div>
      <ProgressBar progress={progress} hideProgress={hideProgress} />
    </div>
  );
};
