import { formatDate } from "../../utils/formatDate";
import Button from "../Button";
import styles from "./UserOrder.module.scss";

type TProps = {
  id: string;
  date: string;
  status: string;
};

const UserOrder: React.FC<TProps> = ({ id, date, status }) => {
  const newDate = new Date(date);
  const formattedDate = formatDate(newDate);
  return (
    <div className={styles["order"]}>
      <div className={styles["order__wrapper"]}>
        <div className={styles["order__text"]}>
          <p className={styles["id"]}>Order ID: {id}</p>
          <p>{formattedDate}</p>
        </div>
      </div>
      <p className={styles["status"]}>{status}</p>
      <Button text="More details" to={`profile/orders/${id}`} />
    </div>
  );
};

export default UserOrder;
