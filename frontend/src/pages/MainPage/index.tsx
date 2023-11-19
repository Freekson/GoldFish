import Layout from "../../components/Layout";
import styles from "./Main.module.scss";
import ImageText from "../../components/ImageText";
import GameCard from "../../components/GameCard";
import Button from "../../components/Button";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { fetchHomePageProducts } from "../../redux/game/slice";
import GameCardSkeleton from "../../components/GameCard/GameCardSkeleton";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import Skeleton from "react-loading-skeleton";

const MainPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchHomePageProducts());
    };
    fetchData();
  }, [dispatch]);
  const { gameData, status } = useSelector((state: RootState) => state.game);
  const { categoryData, status: CategoryStatus } = useSelector(
    (state: RootState) => state.category
  );

  const topRated = gameData.slice(0, 4);
  const topDiscounted = gameData.slice(4, 8);
  const categories = categoryData.slice(1, 5);

  return (
    <Layout>
      <Helmet>
        <title>GoldFish</title>
      </Helmet>
      <section className={styles["catalog"]}>
        <Link to="/catalog">
          <h3>Catalog</h3>
        </Link>
        <div className={styles["catalog__wrapper"]}>
          {CategoryStatus === "error" ? (
            <MessageBox
              message="An error occurred while loading categories, we are working on it"
              type={MessageTypes.DANGER}
              customStyles={{ marginTop: "1rem" }}
            />
          ) : (
            <>
              <div className={styles["catalog__left"]}>
                {CategoryStatus === "loading" ? (
                  <Skeleton height={400} />
                ) : (
                  <ImageText
                    img={categoryData[0].image_link ?? ""}
                    imgAlt={categoryData[0]._id}
                    text={categoryData[0]._id}
                    link={categoryData[0]._id}
                  />
                )}
              </div>
              <div className={styles["catalog__right"]}>
                {CategoryStatus === "loading" ? (
                  <>
                    <div style={{ width: "49%" }}>
                      <Skeleton height={150} />
                    </div>
                    <div style={{ width: "49%" }}>
                      <Skeleton height={150} />
                    </div>
                    <div style={{ width: "49%" }}>
                      <Skeleton height={150} />
                    </div>
                    <div style={{ width: "49%" }}>
                      <Skeleton height={150} />
                    </div>
                  </>
                ) : (
                  categories.map((category) => (
                    <ImageText
                      key={category._id}
                      img={category.image_link ?? ""}
                      imgAlt={category._id}
                      text={category._id}
                      link={category._id}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>
      <section className={styles["hurry-up"]}>
        <Link to="/catalog/?sort=toprated">
          <h3>Hurry up to buy</h3>
        </Link>
        <div className={styles["hurry-up__wrapper"]}>
          {status === "error" ? (
            <MessageBox
              message="An error occurred while loading games, we are working on it"
              type={MessageTypes.DANGER}
              customStyles={{ marginTop: "1rem" }}
            />
          ) : status === "loading" ? (
            <GameCardSkeleton items={4} />
          ) : (
            topRated.map((game) => (
              <GameCard key={game._id} {...game} game={game} />
            ))
          )}
        </div>
      </section>
      <section className={styles["special-offer"]}>
        <Link to="/catalog/?discounted=true">
          <h3>Special offer</h3>
        </Link>
        <div className={styles["special-offer__wrapper"]}>
          {status === "error" ? (
            <MessageBox
              message="An error occurred while loading games, we are working on it"
              type={MessageTypes.DANGER}
              customStyles={{ marginTop: "1rem" }}
            />
          ) : status === "loading" ? (
            <GameCardSkeleton items={4} />
          ) : (
            topDiscounted.map((game) => (
              <GameCard key={game._id} {...game} game={game} isDiscount />
            ))
          )}
        </div>
      </section>
      <section className={styles["upcoming-events"]}>
        <Link to="/events">
          <h3>Upcoming events</h3>
        </Link>
        <div className={styles["upcoming-events__wrapper"]}>
          <div className={styles["upcoming-events__events"]}>
            <ImageText
              img="./img/event-1.png"
              imgAlt="event"
              text={
                <>
                  <p style={{ color: "#F9A43F", fontWeight: "500" }}>
                    Halloween with GoldFish
                  </p>
                  <p>
                    We will gather to find out who the Mafia was and what will
                    happen to the one who was killed..
                  </p>
                  <p style={{ textAlign: "right" }}>October 31, 2021 7:00 pm</p>
                </>
              }
            />
            <ImageText
              img="./img/event-1.png"
              imgAlt="event"
              text={
                <>
                  <p style={{ color: "#F9A43F", fontWeight: "500" }}>
                    Halloween with GoldFish
                  </p>
                  <p>
                    We will gather to find out who the Mafia was and what will
                    happen to the one who was killed..
                  </p>
                  <p style={{ textAlign: "right" }}>October 31, 2021 7:00 pm</p>
                </>
              }
            />
          </div>
          <div className={styles["upcoming-events__btn"]}>
            <Button text="Show more" to="#events" type="active" />
          </div>
        </div>
      </section>
      <section className={styles["more-info"]}>
        <Link to="/blog">
          <h3>More interesting information</h3>
        </Link>
        <div className={styles["more-info__wrapper"]}>
          <div className={styles["more-info__blog"]}>
            <ImageText
              img="./img/blog-1.png"
              imgAlt="blog"
              text={
                <>
                  <p style={{ fontWeight: "500" }}>
                    Desired, but unlikely releases
                  </p>
                  <p>A small list of “what if...”</p>
                </>
              }
            />
            <ImageText
              img="./img/blog-1.png"
              imgAlt="blog"
              text={
                <>
                  <p style={{ fontWeight: "500" }}>
                    Desired, but unlikely releases
                  </p>
                  <p>A small list of “what if...”</p>
                </>
              }
            />
            <ImageText
              img="./img/blog-1.png"
              imgAlt="blog"
              text={
                <>
                  <p style={{ fontWeight: "500" }}>
                    Desired, but unlikely releases
                  </p>
                  <p>A small list of “what if...”</p>
                </>
              }
            />
          </div>
          <div className={styles["more-info__btn"]}>
            <Button text="Show more" to="#events" type="inactive" />
          </div>
        </div>
      </section>
      <section className={styles["about"]}>
        <Link to="/about-us">
          <h3>About the gaming shop "GoldFish"</h3>
        </Link>
        <div className={styles["about__wrapper"]}>
          <div className={styles["about__text"]}>
            <p>
              “GoldFish” is a store where you can buy a great gift for yourself
              and your loved ones.
            </p>
            <p>
              The assortment of our store includes thousands of board games for
              every taste: simple and more complex, family and adults only, for
              two and for large groups, detective and logic, role-playing and
              strategy boards. GoldFish also regularly holds its own gaming
              libraries: tournaments for Magic: the Gathering (from Wizards of
              the coast) and Warhammer (from Games Workshop).
            </p>
            <p>
              In our store you can find the necessary accessories for your
              favorite games (protectors for cards and collections), tools for
              DIY design and painting of figures (cases, stands, Vallejo paints,
              etc.) and much more.
            </p>
            <p>
              "GoldFish" is not only a board game store, but also a full-fledged
              hobby center. Here you can rent tables for games with friends,
              take training and master classes on games that interest you, make
              new acquaintances and join the gaming community!
            </p>
          </div>
          <img src="./img/shop.png" alt="shop" />
        </div>
      </section>
      <section className={styles["contact"]}>
        <h3>Contacts</h3>
        <div className={styles["contact__wrapper"]}>
          <div className={styles["contact__text"]}>
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  d="M24 13H22C21.9992 12.2046 21.6829 11.442 21.1204 10.8796C20.558 10.3171 19.7954 10.0008 19 10V8C20.3256 8.00159 21.5964 8.52888 22.5338 9.46622C23.4711 10.4036 23.9984 11.6744 24 13Z"
                  fill="#2A2A2A"
                />
                <path
                  d="M28 13H26C25.9979 11.1441 25.2597 9.36489 23.9474 8.05259C22.6351 6.7403 20.8559 6.00212 19 6V4C21.3861 4.00265 23.6738 4.95171 25.361 6.63896C27.0483 8.32622 27.9974 10.6139 28 13Z"
                  fill="#2A2A2A"
                />
                <path
                  d="M26 29H25.83C6.18004 27.87 3.39004 11.29 3.00004 6.23C2.93908 5.43675 3.19572 4.65177 3.7135 4.04772C4.23128 3.44368 4.96779 3.07004 5.76104 3.009C5.84037 3.003 5.92004 3 6.00004 3H11.27C11.6706 2.99961 12.062 3.11951 12.3937 3.34416C12.7253 3.56881 12.9818 3.88787 13.13 4.26L14.65 8C14.7964 8.36355 14.8327 8.76208 14.7545 9.14609C14.6763 9.5301 14.4869 9.88267 14.21 10.16L12.08 12.31C12.4114 14.2013 13.3164 15.945 14.6724 17.3045C16.0283 18.664 17.7696 19.5737 19.66 19.91L21.83 17.76C22.1115 17.4862 22.4674 17.3013 22.8533 17.2283C23.2392 17.1554 23.638 17.1977 24 17.35L27.77 18.86C28.1366 19.0129 28.4493 19.2714 28.6683 19.6027C28.8874 19.9339 29.0028 20.3229 29 20.72V26C29 26.7956 28.684 27.5587 28.1214 28.1213C27.5587 28.6839 26.7957 29 26 29ZM6.00004 5C5.86871 4.99961 5.7386 5.02508 5.61712 5.07497C5.49565 5.12486 5.38519 5.19819 5.29205 5.29077C5.19891 5.38335 5.12492 5.49337 5.0743 5.61455C5.02368 5.73572 4.99743 5.86568 4.99704 5.997C4.99704 6.025 4.99804 6.05267 5.00004 6.08C5.46004 12 8.41004 26 25.94 27C26.2047 27.0159 26.4648 26.926 26.6632 26.7501C26.8616 26.5742 26.9821 26.3267 26.998 26.062L27 26V20.72L23.23 19.21L20.36 22.06L19.88 22C11.18 20.91 10 12.21 10 12.12L9.94003 11.64L12.78 8.77L11.28 5H6.00004Z"
                  fill="#2A2A2A"
                />
              </svg>
              <b>Phone: </b> +48 730 562 141
            </p>
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="29"
                height="30"
                viewBox="0 0 29 30"
                fill="none"
              >
                <rect
                  width="29"
                  height="30"
                  transform="matrix(-1 0 0 1 29 0)"
                  fill="url(#pattern0)"
                />
                <defs>
                  <pattern
                    id="pattern0"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlinkHref="#image0_426_6127"
                      transform="matrix(0.00202047 0 0 0.00195312 -0.0172414 0)"
                    />
                  </pattern>
                  <image
                    id="image0_426_6127"
                    width="512"
                    height="512"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
              <b>Email:</b> contact_goldfish@goldfish.pl
            </p>
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
              >
                <g clipPath="url(#clip0_426_6131)">
                  <path
                    d="M13.5 5.90625C13.5 5.68247 13.4111 5.46786 13.2529 5.30963C13.0946 5.1514 12.88 5.0625 12.6563 5.0625C12.4325 5.0625 12.2179 5.1514 12.0596 5.30963C11.9014 5.46786 11.8125 5.68247 11.8125 5.90625V15.1875C11.8125 15.3362 11.8519 15.4823 11.9266 15.6109C12.0013 15.7395 12.1086 15.8461 12.2377 15.9199L18.144 19.2949C18.3378 19.3996 18.5649 19.4244 18.7768 19.3639C18.9886 19.3035 19.1684 19.1625 19.2777 18.9712C19.3871 18.7799 19.4172 18.5535 19.3618 18.3402C19.3063 18.127 19.1697 17.9439 18.981 17.8301L13.5 14.6981V5.90625Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M13.5 27C17.0804 27 20.5142 25.5777 23.0459 23.0459C25.5777 20.5142 27 17.0804 27 13.5C27 9.91958 25.5777 6.4858 23.0459 3.95406C20.5142 1.42232 17.0804 0 13.5 0C9.91958 0 6.4858 1.42232 3.95406 3.95406C1.42232 6.4858 0 9.91958 0 13.5C0 17.0804 1.42232 20.5142 3.95406 23.0459C6.4858 25.5777 9.91958 27 13.5 27ZM25.3125 13.5C25.3125 16.6329 24.068 19.6374 21.8527 21.8527C19.6374 24.068 16.6329 25.3125 13.5 25.3125C10.3671 25.3125 7.36257 24.068 5.1473 21.8527C2.93203 19.6374 1.6875 16.6329 1.6875 13.5C1.6875 10.3671 2.93203 7.36257 5.1473 5.1473C7.36257 2.93203 10.3671 1.6875 13.5 1.6875C16.6329 1.6875 19.6374 2.93203 21.8527 5.1473C24.068 7.36257 25.3125 10.3671 25.3125 13.5Z"
                    fill="#2A2A2A"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_426_6131">
                    <rect width="27" height="27" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <b>Time of work: </b>
              Office hours: 11:00-23:00 (daily)
            </p>
            <h4>Still have questions?</h4>
            <form
              action="/handling-form-page"
              method="post"
              className={styles["contact__form"]}
            >
              <fieldset className={styles["contact__fieldset"]}>
                <label htmlFor="name" className={styles["contact__label"]}>
                  Your name:
                </label>{" "}
                <br />
                <input
                  className={styles["contact__input"]}
                  type="text"
                  id="name"
                  name="user_name"
                  placeholder="Name"
                  required
                />
              </fieldset>
              <fieldset className={styles["contact__fieldset"]}>
                <label htmlFor="telephone">Telephone:</label> <br />
                <input
                  className={styles["contact__input"]}
                  type="tel"
                  id="telephone"
                  name="user_telephone"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  placeholder="___-___-____"
                  required
                />
              </fieldset>
              <fieldset className={styles["contact__fieldset"]}>
                <label htmlFor="comment">Your comment:</label> <br />
                <textarea
                  className={styles["contact__texarea"]}
                  id="comment"
                  name="user_comment"
                  rows={4}
                  cols={50}
                  placeholder="Comment"
                ></textarea>
              </fieldset>
              <input
                className={styles["contact__btn"]}
                type="submit"
                value="Request a call"
                formMethod="post"
              />
            </form>
          </div>
          <iframe
            title="Google Maps"
            className={styles["contact__map"]}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.524744163564!2d-73.86733757629845!3d40.67926782826824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25dbff4901773%3A0x3063cbdf26b8e9b2!2sGameStop!5e0!3m2!1sru!2spl!4v1649446619219!5m2!1sru!2spl"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </Layout>
  );
};

export default MainPage;
