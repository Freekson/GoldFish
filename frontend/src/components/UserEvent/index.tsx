import Button from "../Button";
import styles from "./UserEvent.module.scss";

const UserEvent: React.FC = () => {
  return (
    <div className={styles["event"]}>
      <div className={styles["event__wrapper"]}>
        <img src="/img/event-1.png" alt="game-1" />
        <div className={styles["event__text"]}>
          <p className={styles["name"]}>Halloween</p>
          <p>September 31, 2023, 17:00</p>
        </div>
      </div>
      <Button text="More details" to="/events/1" />
    </div>
  );
};

export default UserEvent;
