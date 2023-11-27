import { Link } from "react-router-dom";
import styles from "./OrdersItem.module.scss";
import { formatDate } from "../../utils/formatDate";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { showToast } from "../../redux/toast/slice";
import { toastStatus } from "../../redux/toast/types";
import { fetchUserOrders } from "../../redux/order/slice";

type TProps = {
  id: string;
  date: string;
  status: string;
  totalPrice: number;
};
const OrdersItem: React.FC<TProps> = ({ id, date, status, totalPrice }) => {
  const dispatch = useAppDispatch();

  const newDate = new Date(date);
  const formattedDate = formatDate(newDate);

  const { userData } = useSelector((state: RootState) => state.user);

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to cancel the order?")) {
      try {
        await axios.delete(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${userData?.token}` },
        });

        dispatch(
          showToast({
            toastText: "Order Canceled Successfuly",
            toastType: toastStatus.SUCCESS,
          })
        );
        dispatch(fetchUserOrders({ token: userData?.token ?? "" }));
      } catch (err) {
        dispatch(
          showToast({
            toastText: `Error while canceling order: ${err}`,
            toastType: toastStatus.ERROR,
          })
        );
      }
    }
  };

  return (
    <div className={styles["order"]}>
      <div className="id">
        <p>
          <b>Oder Id:</b> {id}
        </p>
      </div>
      <div className="date">
        <p>
          <b>Date:</b> {formattedDate}
        </p>
      </div>
      <div className="status">
        <p>
          <b>Status:</b> {status}
        </p>
      </div>
      <div className="price">
        <p>
          <b>Total Price:</b> ${totalPrice.toFixed(2)}
        </p>
      </div>
      <div className={styles["actions"]}>
        <Link to={`./${id}`}>Details</Link>
        {status === "Waiting for payment" && (
          <p onClick={deleteHandler}>Cancel</p>
        )}
      </div>
    </div>
  );
};

export default OrdersItem;
