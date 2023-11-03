import Button from "../Button";
import styles from "./UserOrder.module.scss";

const UserOrder: React.FC = () => {
  return (
    <div className={styles["order"]}>
      <div className={styles["order__wrapper"]}>
        <div className={styles["order__text"]}>
          <p className={styles["id"]}>Order: 1234</p>
          <p>September 31, 2023, 17:00</p>
        </div>
      </div>
      <p className={styles["status"]}>Waiting for payment</p>
      <Button text="More details" to="profile/orders/1" />
    </div>
  );
};

export default UserOrder;
