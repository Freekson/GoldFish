import { Link } from "react-router-dom";
import styles from "./OrdersItem.module.scss";

const OrdersItem: React.FC = () => {
  return (
    <div className={styles["order"]}>
      <div className="id">
        <p>
          <b>Oder Id:</b> 1234
        </p>
      </div>
      <div className="date">
        <p>
          <b>Date:</b> 14.03.2022
        </p>
      </div>
      <div className="status">
        <p>
          <b>Status:</b> Waiting for payment
        </p>
      </div>
      <div className="price">
        <p>
          <b>Total Price:</b> $23
        </p>
      </div>
      <div className={styles["actions"]}>
        <Link to="./123">Details</Link>
        <a href="#delete">Delete</a>
      </div>
    </div>
  );
};

export default OrdersItem;
