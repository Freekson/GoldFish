import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import Layout from "../../components/Layout";
import GameCard from "../../components/GameCard";
import styles from "./ProductPage.module.scss";
import { useEffect, useState } from "react";
import OpenedCard from "../../components/OpenedCard";
import { RootState, useAppDispatch } from "../../redux/store";
import { fetchProductPageGames } from "../../redux/game/slice";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Rating from "../../components/Rating";
import GameCardSkeleton from "../../components/GameCard/GameCardSkeleton";
import Skeleton from "react-loading-skeleton";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import { addItem } from "../../redux/cart/slice";
import {
  addGame,
  deleteGame,
  fetchWishlist,
  postGame,
  removeGame,
} from "../../redux/wishlist/slice";
import { toast } from "react-toastify";
import { Status } from "../../types";

const ProductPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const { userData } = useSelector((state: RootState) => state.user);
  const { gameData, status } = useSelector((state: RootState) => state.game);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { items, status: wishlistStatus } = useSelector(
    (state: RootState) => state.wishlist
  );

  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (wishlistStatus !== Status.LOADING) {
      setInWishlist(items ? items.some((game) => game._id === id) : false);
    } else {
      setInWishlist(false);
    }
  }, [id, items, wishlistStatus]);

  useEffect(() => {
    const fetchData = async () => {
      id && dispatch(fetchProductPageGames({ id }));
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    const fetchData = async () => {
      if (userData) {
        await dispatch(
          fetchWishlist({ id: userData._id, token: userData.token })
        );
      }
    };
    fetchData();
  }, [dispatch, userData]);

  const currentItem = cartItems.find((item) => item._id === id);
  const game = gameData[0];
  const similar = gameData.slice(1, 5);

  const addToCart = () => {
    dispatch(addItem(game));
  };

  const onClickHeart = () => {
    if (userData) {
      if (inWishlist) {
        dispatch(
          deleteGame({
            token: userData?.token,
            userId: userData._id,
            gameId: id ?? "",
          })
        );
        dispatch(removeGame(game));
        toast.success("Game removed from wishlist");
      } else {
        dispatch(
          postGame({
            token: userData?.token,
            userId: userData._id,
            gameId: id ?? "",
          })
        );
        dispatch(addGame(game));
        toast.success("Game added to wishlist");
      }
      setInWishlist(!inWishlist);
    } else {
      toast.info("You must be logged in to do this");
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{game?.title || "Product"}</title>
      </Helmet>
      {status === "error" ? (
        <MessageBox
          message="An error occurred"
          type={MessageTypes.DANGER}
          customStyles={{ marginTop: "3rem" }}
        />
      ) : (
        <>
          {game ? (
            <Breadcrumbs
              items={["Home", "Catalog", game?.category]}
              pathes={[
                "/",
                "/catalog",
                `/catalog/?categories=%5B"${game?.category}"%5D`,
              ]}
              last={game?.title}
            />
          ) : (
            <div style={{ width: "20%" }}>
              <Skeleton height={20} />
            </div>
          )}
          <h3>{game?.title || <Skeleton width={200} />}</h3>
          <section className={styles["product"]}>
            <div className={styles["product__img"]}>
              {game ? (
                <img src={game?.image_link} alt={game?.slug} />
              ) : (
                <div style={{ width: "80%" }}>
                  <Skeleton height={250} />
                </div>
              )}
              <h4>Popular questions</h4>
              <OpenedCard
                title="Description"
                description={
                  <>
                    Description: {game?.description || <Skeleton width={200} />}{" "}
                    <br />
                    <br />
                    Category: {game?.category || <Skeleton width={200} />}
                    <br /> <br />
                    Publisher: {game?.publisher || <Skeleton width={200} />}
                    <br /> <br />
                    Rating:{" "}
                    <Link
                      to={`/catalog/?ratings=%5B${Math.floor(
                        game?.average_rating
                      )}%5D`}
                      className={styles["description-link"]}
                    >
                      {game?.average_rating || <Skeleton width={200} />}
                    </Link>
                  </>
                }
              />
              <hr />
              <OpenedCard
                title="How to choose a game?"
                description={
                  <>
                    If a group is going to take part in a board game, you need
                    to take into account the average age of the players. There
                    are games that do not require activity and are unlikely to
                    appeal to young people, while active games will not appeal
                    to older people.
                    <br />
                    <br />
                    Many games are only for a large number of players, while
                    others are strictly for two people. There are also
                    individual options, but most often the number of
                    participants is from two to four. The number of players for
                    which the game is designed is written on its packaging. It
                    is important to immediately decide how many people will take
                    part in the game. Some board games can be boring for only
                    two people. If two people will play more often, you should
                    not buy games that are designed for a large company.
                    <br />
                    <br />
                    It is also important how the participants will interact with
                    each other during the game. There are two main options:
                    every man for himself or in a team. Props can be cards,
                    dice, paper and pencils, as well as special devices that are
                    in the box.
                    <br />
                    <br />
                    There are several types of board games: intellectual,
                    creative, active and cooperative. Intellectual games are
                    more intended for children who need to develop logic and
                    erudition. In an entertainment format, they will be able to
                    train their memory and thinking. Such games include memo,
                    where you need to remember pictures or words. Strategic and
                    economic games develop the skills of an entrepreneur and
                    strategist. They teach proper planning. Creative games
                    develop imagination. They require more concentration.
                    Outdoor games will appeal more to companies because they are
                    aimed at interaction between players. In a cooperative game,
                    the child will develop speech and communication skills
                    through communication with other players.
                    <br />
                    <br />
                    Games are also selected based on the duration of the
                    process: from several minutes to several hours. The playing
                    time also depends on the number of participants and how well
                    they know the rules.
                  </>
                }
              />
              <hr />
              <OpenedCard
                title="How to place an order?"
                description={
                  <>
                    1. Adding items to cart:
                    <br />
                    <br />
                    The first step is for the customer to add items to the cart.
                    This can be done using the "Add to Cart" button or the cart
                    icon visible on the product page. The customer can choose
                    the quantity of items and possibly options such as size and
                    color.
                    <br />
                    2. View cart:
                    <br />
                    <br />
                    After adding items to the cart, the customer can view the
                    contents of the cart. Here the customer can check that he
                    has selected the right products and change the quantity or
                    remove products if necessary.
                    <br />
                    3. Authorization or registration:
                    <br />
                    <br />
                    To place an order, the customer may be required to log into
                    their account or register if they have not done so
                    previously. This saves customer data and speeds up the
                    ordering process.
                    <br />
                    4. Entering delivery information:
                    <br />
                    <br />
                    The client must indicate the delivery address. This includes
                    entering your delivery address and contact information. At
                    this stage, the client can also choose a delivery method and
                    become familiar with delivery options and deadlines.
                    <br />
                    5. Selecting a payment method:
                    <br />
                    <br />
                    The client chooses a payment method convenient for him. This
                    can be payment by credit card, bank transfer, cash upon
                    receipt of goods, etc.
                    <br />
                    6. Order confirmation:
                    <br />
                    <br />
                    Before final confirmation of the order, the customer must
                    review all order details and ensure that everything is
                    correct. Here the client can also enter promotional codes or
                    coupons, if any.
                    <br />
                    7. Order confirmation and payment:
                    <br />
                    <br />
                    After confirming the order, the customer must complete the
                    payment if necessary. This may require you to enter payment
                    information or go to a third-party payment portal.
                    <br />
                    8. Receiving confirmation:
                    <br />
                    <br />
                    The client must receive an order confirmation to his email
                    address. This may include the order number, details of items
                    ordered, amount and delivery times.
                    <br />
                    9. Order tracking:
                    <br />
                    <br />
                    After placing an order, the client is given the opportunity
                    to track its status. This gives the customer confidence that
                    the order is being processed and delivered.
                    <br />
                    10. Receiving an order:
                    <br />
                    <br />
                    Finally, the customer receives the order and can check that
                    all products are as expected.
                  </>
                }
              />
              <hr />
              <OpenedCard
                title="What to do if the order has not arrived?"
                description={
                  <>
                    If your order has not arrived as expected, it can be
                    frustrating, but there are steps you can take to resolve the
                    situation. Here's what to do if your order has not been
                    delivered:
                    <br />
                    <br />
                    Check the Tracking Information:
                    <br />
                    <br />
                    If the order comes with tracking information, use it to
                    check the status of your package. Look for any updates
                    regarding the location and estimated delivery date.
                    Sometimes, the delay may be due to transportation issues.
                    Contact the Retailer or Seller:
                    <br />
                    <br />
                    Reach out to the online retailer or seller from whom you
                    made the purchase. They may have more information about your
                    order and its status. Provide them with your order number
                    and any relevant details. Review Shipping Address:
                    <br />
                    <br />
                    Double-check the shipping address you provided when placing
                    the order. Make sure it is accurate and up to date. A simple
                    mistake in the address can cause delivery issues. Check for
                    Delivery Notifications:
                    <br />
                    <br />
                    Sometimes, delivery carriers leave notifications if they
                    were unable to deliver the package. Check for any notes or
                    notifications left at your doorstep or in your mailbox. They
                    may provide instructions on how to reschedule delivery or
                    pick up the package. Wait for a Few More Days:
                    <br />
                    <br />
                    Delivery delays can happen for various reasons, including
                    weather, high shipping volumes, or customs clearance.
                    Sometimes, packages may arrive a bit later than the
                    estimated delivery date. If the delay is not too long, it
                    might be worth waiting a few more days. Contact the Shipping
                    Carrier:
                    <br />
                    <br />
                    If the retailer or seller cannot provide a satisfactory
                    update, contact the shipping carrier directly. You can
                    usually find their customer service contact information on
                    their website. Provide them with the tracking number and ask
                    for assistance. Request a Refund or Reshipment:
                    <br />
                    <br />
                    If a significant amount of time has passed, and it's clear
                    that your order will not be delivered, contact the retailer
                    or seller again. Request a refund or ask for the order to be
                    reshipped. Most reputable sellers have policies in place to
                    address non-delivery issues. Check Purchase Protection:
                    <br />
                    <br />
                    If you made the payment with a credit card or through a
                    payment platform like PayPal, review their purchase
                    protection policies. You may be eligible for a refund or
                    dispute resolution through these services. Leave Feedback
                    and Reviews:
                    <br />
                    <br />
                    After resolving the issue, consider leaving feedback or
                    reviews for the seller or the shipping carrier. Honest
                    feedback can help other customers make informed decisions
                    and also incentivize sellers to improve their services.
                  </>
                }
              />
              <hr />
              <OpenedCard
                title="How to return an item?"
                description={
                  <>
                    Returning an item can vary depending on the specific
                    retailer's return policy and the reason for the return.
                    Here's a general guide on how to return an item:
                    <br />
                    <br />
                    1. Review the Return Policy:
                    <br />
                    <br />
                    Start by reviewing the retailer's return policy. It should
                    provide information on the time frame for returns,
                    acceptable reasons for returns, and the process for
                    returning items. Make sure you are within the return window.
                    2. Check the Condition of the Item:
                    <br />
                    <br />
                    Ensure that the item is in the same condition as when you
                    received it. Most retailers will only accept returns of
                    unused, undamaged, and resalable items. 3. Prepare Required
                    Information:
                    <br />
                    <br />
                    Gather all the necessary information, including your order
                    number or receipt, the reason for the return, and any
                    documentation or packaging that came with the item. 4.
                    Contact the Retailer:
                    <br />
                    <br />
                    Reach out to the retailer's customer service. You can
                    typically do this through their website, by phone, or by
                    visiting a physical store if applicable. Inform them of your
                    intention to return the item. 5. Follow Return Instructions:
                    <br />
                    <br />
                    The retailer's customer service will guide you through the
                    return process. They may provide you with return shipping
                    labels or instructions for returning the item to a physical
                    store. 6. Package the Item:
                    <br />
                    <br />
                    Carefully pack the item in its original packaging, if
                    possible. If the original packaging is not available, use a
                    secure and protective container. Make sure to include all
                    the necessary documentation. 7. Label the Package:
                    <br />
                    <br />
                    Attach the return label provided by the retailer if
                    applicable. Ensure the label is securely attached and
                    clearly visible on the package. 8. Ship the Item:
                    <br />
                    <br />
                    If you are responsible for the return shipping, send the
                    package to the address provided by the retailer. Consider
                    using a trackable and insured shipping method to ensure the
                    safe arrival of the return. 9. Await Confirmation:
                    <br />
                    <br />
                    After returning the item, wait for confirmation from the
                    retailer. This may include a notification of the item's
                    receipt and the status of your return. 10. Receive Refund or
                    Replacement: - Once the retailer receives and inspects the
                    returned item, they will typically issue a refund to your
                    original payment method or provide a replacement, depending
                    on your preference and their policy.
                    <br />
                    <br />
                    11. Keep Records: - Maintain records of all communication
                    and transactions related to the return, including emails,
                    receipts, and tracking information.
                    <br />
                    <br />
                    It's important to note that return policies can vary, so
                    it's crucial to follow the specific instructions provided by
                    the retailer. Some retailers may offer free returns, while
                    others may require you to cover return shipping costs.
                    Additionally, some items, such as personalized or perishable
                    goods, may not be eligible for returns. Always check the
                    return policy and contact customer service if you have any
                    questions or concerns.
                  </>
                }
              />
              <hr />
            </div>
            <div className={styles["product__description"]}>
              {inWishlist ? (
                <svg
                  className={styles.heart}
                  onClick={onClickHeart}
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="16"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                    fill="#FFD3E0"
                  />
                </svg>
              ) : (
                <svg
                  className={styles.heart}
                  onClick={onClickHeart}
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="16"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                    fill="#FFD3E0"
                  />
                </svg>
              )}
              <p className={styles["product__code"]}>
                Product code: {game?._id || <Skeleton width={100} />}
              </p>
              <div className={styles["product__rating"]}>
                {game ? (
                  <Rating
                    rating={game?.average_rating}
                    numReviews={game?.review_count}
                  />
                ) : (
                  <div style={{ width: "50%" }}>
                    <Skeleton height={30} />
                  </div>
                )}
              </div>
              <p className={styles["product__publisher"]}>
                Publisher:{" "}
                <b>
                  <Link to={`/catalog/?publishers=%5B"${game?.publisher}"%5D`}>
                    {game?.publisher || <Skeleton width={100} />}
                  </Link>
                </b>
              </p>
              <p className={styles["product__category"]}>
                Category:{" "}
                <b>
                  <Link to={`/catalog/?categories=%5B"${game?.category}"%5D`}>
                    {game?.category || <Skeleton width={100} />}
                  </Link>
                </b>
              </p>
              <p className={styles["product__price"]}>
                $
                {game?.price || (
                  <Skeleton width={100} style={{ marginLeft: "1rem" }} />
                )}
              </p>
              <div
                className={!currentItem ? styles["buy"] : styles["buy_active"]}
                onClick={addToCart}
              >
                {!currentItem ? (
                  <>Add to Cart</>
                ) : (
                  <p>
                    In Cart{" "}
                    <span className={styles.quantity}>
                      {currentItem?.quantity}
                    </span>
                  </p>
                )}
              </div>
              <hr />
              <OpenedCard
                title="Delivery"
                description={
                  <>
                    Pickup from store: today; <br /> <br />
                    Pickup from 761 locations: 1-3 days; <br /> <br />
                    Courier delivery: 1-3 days; <br /> <br />
                    Delivery by mail: from 3 days;
                  </>
                }
              />
              <OpenedCard
                title="Payment"
                description={
                  <>
                    PayPal <br />
                    <br />
                    Stripe
                  </>
                }
              />
            </div>
          </section>
          <section className={styles["similar"]}>
            <h4>Similar:</h4>
            <div className={styles["similar__wrapper"]}>
              {status === "loading" ? (
                <GameCardSkeleton items={4} />
              ) : similar.length === 0 ? (
                <MessageBox
                  message="No similar games found 😕"
                  type={MessageTypes.INFO}
                  customStyles={{ marginTop: "1rem" }}
                />
              ) : (
                similar.map((game) => (
                  <GameCard key={game._id} {...game} game={game} />
                ))
              )}
            </div>
          </section>
        </>
      )}
    </Layout>
  );
};

export default ProductPage;
