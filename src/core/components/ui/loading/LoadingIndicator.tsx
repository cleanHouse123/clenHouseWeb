import styles from "./LoadingIndicator.module.css";

export const LoadingIndicator = () => (
    <div className="flex items-center justify-center py-8 h-screen">
        <div className="text-center">
            <div className={styles.loader} />
        </div>
    </div>
);
