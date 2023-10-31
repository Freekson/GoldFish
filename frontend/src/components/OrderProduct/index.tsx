import styles from "./OrderProduct.module.scss";
const OrderProduct: React.FC = () => {
  return (
    <div className={styles["product"]}>
      <img src="/img/game-1.png" alt="game-1" />
      <div className={styles["product__text"]}>
        <p>Broken Realms: Horrek's Dreadlance</p>
        <p>$21</p>
        <p>4 pcs.</p>
      </div>
    </div>
  );
};

export default OrderProduct;
