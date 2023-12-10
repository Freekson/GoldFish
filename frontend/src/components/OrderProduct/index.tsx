import { Link } from "react-router-dom";
import styles from "./OrderProduct.module.scss";

type TProps = {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};
const OrderProduct: React.FC<TProps> = ({
  id,
  title,
  image,
  price,
  quantity,
}) => {
  return (
    <div className={styles["product"]}>
      <img src={image} alt={title} />
      <div className={styles["product__text"]}>
        <p>
          <Link to={`/product/${id}`}>{title}</Link>
        </p>
        <p>${price}</p>
        <p>{quantity} pcs.</p>
        <p>Total: ${(price * quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderProduct;
