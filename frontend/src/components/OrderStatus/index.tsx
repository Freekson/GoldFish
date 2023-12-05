import { useEffect, useState } from "react";
import styles from "./OrderStatus.module.scss";

export enum EStatusType {
  cash = "cash",
  store = "store",
  post = "post",
}
type TProps = {
  step: number;
  statusType: EStatusType;
};

const OrderStatus: React.FC<TProps> = ({ step, statusType }) => {
  const [steps, setSteps] = useState<string[]>([]);
  useEffect(() => {
    if (statusType === EStatusType.post) {
      setSteps([
        "Waiting for payment",
        "Paid",
        "Waiting for delivery",
        "Delivered",
      ]);
    } else if (statusType === EStatusType.cash) {
      setSteps(["Waiting for delivery", "Delivered and Paid"]);
    } else if (statusType === EStatusType.store) {
      setSteps(["Waiting for pick up", "Picked up"]);
    }
  }, [statusType]);
  return (
    <div className={styles["order-status"]}>
      {steps.map((item, index) => (
        <div className={styles["status"]} key={index}>
          {step - 1 === index ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M448 256c0-106-86-192-192-192V448c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
            </svg>
          ) : step - 1 > index ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
            </svg>
          )}

          <p
            className={
              step - 1 < index
                ? styles["inactive"]
                : step - 1 === index
                ? styles["active"]
                : ""
            }
          >
            {item}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;
