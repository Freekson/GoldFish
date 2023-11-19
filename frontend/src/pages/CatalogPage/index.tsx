import { Helmet } from "react-helmet-async";
import Layout from "../../components/Layout";
import styles from "./CatalogPage.module.scss";
import GameCard from "../../components/GameCard";
import Breadcrumbs from "../../components/Breadcrumbs";
import OpenedCard from "../../components/OpenedCard";
import { ChangeEvent, useEffect, useState } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
import { fetchFilteredGames } from "../../redux/game/slice";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { useLocation, useNavigate } from "react-router-dom";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import GameCardSkeleton from "../../components/GameCard/GameCardSkeleton";
import {
  fetchCategoryCount,
  fetchPublisherCount,
  fetchRatingCount,
} from "../../redux/count/slice";

const CatalogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice);
  const [sortOption, setSortOption] = useState("newest");
  const [activePage, setActivePage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "lowest", label: "Price: Low to High" },
    { value: "highest", label: "Price: High to Low" },
    { value: "toprated", label: "Most Rated" },
    { value: "lessrated", label: "Less Rated" },
  ];

  const { filterData, status } = useSelector((state: RootState) => state.game);
  const {
    ratingCount,
    categoryCount,
    publishersCount,
    status: countStatus,
  } = useSelector((state: RootState) => state.count);
  const games = filterData?.games;
  const pages = filterData?.totalPages ?? 1;

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchRatingCount());
      dispatch(fetchCategoryCount());
      dispatch(fetchPublisherCount());
    };
    fetchData();
  }, [dispatch]);

  //? fetch data from url

  useEffect(() => {
    const sp = new URLSearchParams(search);
    const categories = sp.get("categories");
    const publishers = sp.get("publishers");
    const ratings = sp.get("ratings");
    const discounted = sp.get("discounted");
    const min = sp.get("min");
    const max = sp.get("max");
    const sort = sp.get("sort");
    const page = sp.get("page");
    const searchUrl = sp.get("search");

    if (categories === null) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(JSON.parse(decodeURIComponent(categories)));
    }

    if (publishers === null) {
      setSelectedPublishers([]);
    } else {
      setSelectedPublishers(JSON.parse(decodeURIComponent(publishers)));
    }

    if (ratings === null) {
      setSelectedRatings([]);
    } else {
      setSelectedRatings(JSON.parse(decodeURIComponent(ratings)));
    }

    if (discounted === null) {
      setIsDiscounted(false);
    } else {
      setIsDiscounted(true);
    }

    if (min === null) {
      setMinPrice(0);
    } else {
      setMinPrice(Number(min));
    }

    if (max === null) {
      setMaxPrice(0);
    } else {
      setMaxPrice(Number(max));
    }

    if (sort === null) {
      setSortOption("newest");
    } else {
      setSortOption(sort);
    }

    if (page === null) {
      setActivePage(1);
    } else {
      setActivePage(Number(page));
    }

    if (searchUrl === null) {
      setSearchValue("");
    } else {
      setSearchValue(searchUrl);
    }
  }, [search]);

  //? waiting 1s before upd price filters

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [minPrice]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMaxPrice(maxPrice);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [maxPrice]);

  //? updating filters

  useEffect(() => {
    const queryParams = [];

    if (selectedCategories.length > 0) {
      queryParams.push(
        `categories=${encodeURIComponent(JSON.stringify(selectedCategories))}`
      );
    }

    if (selectedPublishers.length > 0) {
      queryParams.push(
        `publishers=${encodeURIComponent(JSON.stringify(selectedPublishers))}`
      );
    }

    if (selectedRatings.length > 0) {
      queryParams.push(
        `ratings=${encodeURIComponent(JSON.stringify(selectedRatings))}`
      );
    }

    if (isDiscounted) {
      queryParams.push(`discounted=true`);
    }

    if (debouncedMinPrice || debouncedMaxPrice) {
      queryParams.push(`min=${debouncedMinPrice}&max=${debouncedMaxPrice}`);
    }

    if (sortOption) {
      queryParams.push(`sort=${sortOption}`);
    }

    if (activePage) {
      if (activePage === 0) {
        setActivePage(1);
      } else if (activePage > pages) {
        queryParams.push(`page=${pages}`);
        setActivePage(pages);
      } else {
        queryParams.push(`page=${activePage}`);
      }
    }

    if (searchValue) {
      queryParams.push(`search=${searchValue}`);
    }

    const queryString = queryParams.join("&");
    const url = `${queryString ? `?${queryString}` : ""}`;

    const newUrl = `/catalog/${url}`;
    window.history.pushState({}, "", newUrl);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const fetchData = async () => {
      dispatch(fetchFilteredGames({ path: `/filtered${url}` }));
    };
    fetchData();
  }, [
    activePage,
    debouncedMaxPrice,
    debouncedMinPrice,
    dispatch,
    isDiscounted,
    pages,
    searchValue,
    selectedCategories,
    selectedPublishers,
    selectedRatings,
    sortOption,
  ]);

  //? handlers

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.value;
    const isChecked = event.target.checked;

    setSelectedCategories((prevSelectedCategories) => {
      if (isChecked) {
        return [...prevSelectedCategories, category];
      } else {
        return prevSelectedCategories.filter(
          (selectedCategory) => selectedCategory !== category
        );
      }
    });
  };

  const handlePublisherChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const publisher = event.target.value;
    const isChecked = event.target.checked;

    setSelectedPublishers((prevSelectedPublisher) => {
      if (isChecked) {
        return [...prevSelectedPublisher, publisher];
      } else {
        return prevSelectedPublisher.filter(
          (selectedPublisher) => selectedPublisher !== publisher
        );
      }
    });
  };

  const handleRatingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const rating = Number(value);

    setSelectedRatings((prevSelectedRatings) => {
      if (checked) {
        return [...prevSelectedRatings, rating];
      } else {
        return prevSelectedRatings.filter(
          (selectedRating) => selectedRating !== rating
        );
      }
    });
  };

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const maxPrice = Number(event.target.value);

    if (isNaN(maxPrice)) {
      setMaxPrice(0);
    } else {
      setMaxPrice(maxPrice);
    }
  };

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    const minPrice = Number(event.target.value);

    if (isNaN(minPrice)) {
      setMinPrice(0);
    } else {
      setMinPrice(minPrice);
    }
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPublishers([]);
    setMinPrice(0);
    setMaxPrice(0);
    setIsDiscounted(false);
    setSelectedRatings([]);
    setSortOption(sortOptions[0].value);
    setActivePage(1);
    setSearchValue("");
    navigate(`/catalog/?sort=newest&page=1`);
  };

  const onClickDelete = () => {
    setSearchValue("");
    const currentUrl = new URL(window.location.href);

    const searchParams = new URLSearchParams(currentUrl.search);
    searchParams.delete("search");

    const updatedUrl = `${currentUrl.pathname}?${searchParams}${currentUrl.hash}`;

    navigate(updatedUrl);
  };

  return (
    <Layout>
      <Helmet>
        <title>Catalog</title>
      </Helmet>
      <Breadcrumbs last="Catalog" />
      <div className={styles["catalog-up"]}>
        <h3>Catalog</h3>

        <div className={styles["sort-by"]}>
          {searchValue && (
            <p className={styles["search"]}>
              Search request: <span>{searchValue}</span>
              <svg
                onClick={onClickDelete}
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
              </svg>
            </p>
          )}
          <p>Sort By</p>
          <select value={sortOption} onChange={handleSortChange}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <section className={styles["catalog"]}>
        <div className={styles["catalog__filters"]}>
          <OpenedCard
            className={styles["openedCard"]}
            title="Category"
            description={
              <div className={styles["filters"]}>
                {countStatus === "loading" ? (
                  <Skeleton height={300} />
                ) : (
                  categoryCount.map((category, index) => (
                    <fieldset key={index}>
                      <input
                        type="checkbox"
                        value={category._id}
                        onChange={handleCategoryChange}
                        checked={selectedCategories.includes(category._id)}
                      />{" "}
                      <label>
                        {category._id} ({categoryCount[index].count})
                      </label>
                    </fieldset>
                  ))
                )}
                <p
                  className={styles["clear-filters-btn"]}
                  onClick={() => setSelectedCategories([])}
                >
                  Clear filter
                </p>
              </div>
            }
          />
          <OpenedCard
            className={styles["openedCard"]}
            title="Game publisher"
            description={
              <div className={styles["filters"]}>
                {countStatus === "loading" ? (
                  <Skeleton height={300} />
                ) : (
                  publishersCount.map((publisher, index) => (
                    <fieldset key={index}>
                      <input
                        type="checkbox"
                        value={publisher._id}
                        onChange={handlePublisherChange}
                        checked={selectedPublishers.includes(publisher._id)}
                      />{" "}
                      <label>
                        {publisher._id} ({publishersCount[index].count})
                      </label>
                    </fieldset>
                  ))
                )}
                <p
                  className={styles["clear-filters-btn"]}
                  onClick={() => setSelectedPublishers([])}
                >
                  Clear filter
                </p>
              </div>
            }
          />
          <h4 className={styles["price"]}>Price</h4>
          <div className={`${styles["filters"]} ${styles["filters_padding"]}`}>
            <fieldset>
              <div className={styles["prices"]}>
                <div>
                  From:{" "}
                  <input
                    type="text"
                    value={minPrice}
                    onChange={handleMinChange}
                    placeholder="0"
                  />
                </div>
                <div>
                  To:{" "}
                  <input
                    type="text"
                    value={maxPrice}
                    onChange={handleMaxChange}
                    placeholder="1000"
                  />
                </div>
              </div>
            </fieldset>
            <input
              type="checkbox"
              checked={isDiscounted}
              onChange={() => setIsDiscounted(!isDiscounted)}
            />{" "}
            Only with discount
            <p
              className={styles["clear-filters-btn"]}
              onClick={() => {
                setMinPrice(0);
                setMaxPrice(0);
                setIsDiscounted(false);
              }}
            >
              Clear filter
            </p>
          </div>
          <h4>Customer rating</h4>
          <div className={`${styles["filters"]} ${styles["filters_padding"]}`}>
            <fieldset>
              <input
                type="checkbox"
                value={5}
                onChange={handleRatingsChange}
                checked={selectedRatings.includes(5)}
              />{" "}
              <label>
                5 stars ({ratingCount.length > 1 ? ratingCount[4].count : 0})
              </label>
            </fieldset>
            <fieldset>
              <input
                type="checkbox"
                value={4}
                onChange={handleRatingsChange}
                checked={selectedRatings.includes(4)}
              />{" "}
              <label>
                4 stars ({ratingCount.length > 1 ? ratingCount[3].count : 0})
              </label>
            </fieldset>
            <fieldset>
              <input
                type="checkbox"
                value={3}
                onChange={handleRatingsChange}
                checked={selectedRatings.includes(3)}
              />{" "}
              <label>
                3 stars ({ratingCount.length > 1 ? ratingCount[2].count : 0})
              </label>
            </fieldset>
            <fieldset>
              <input
                type="checkbox"
                value={2}
                onChange={handleRatingsChange}
                checked={selectedRatings.includes(2)}
              />{" "}
              <label>
                2 stars ({ratingCount.length > 1 ? ratingCount[1].count : 0})
              </label>
            </fieldset>
            <fieldset>
              <input
                type="checkbox"
                value={1}
                onChange={handleRatingsChange}
                checked={selectedRatings.includes(1)}
              />{" "}
              <label>
                1 stars ({ratingCount.length > 1 ? ratingCount[0].count : 0})
              </label>
            </fieldset>
            <p
              className={styles["clear-filters-btn"]}
              onClick={() => setSelectedRatings([])}
            >
              Clear filter
            </p>
          </div>
          <p className={styles["clear-btn"]} onClick={clearFilters}>
            Clear all filters
          </p>
        </div>
        <div className={styles["catalog__items"]}>
          {status === "loading" ? (
            <GameCardSkeleton items={12} />
          ) : status === "error" ? (
            <MessageBox
              message="There is a problem with connection to DB, check your internet conection"
              type={MessageTypes.DANGER}
            />
          ) : countStatus === "error" ? (
            <MessageBox
              message="Erorr while loading categories or publishers, its problem on server side, we are already working on it"
              type={MessageTypes.DANGER}
            />
          ) : games && games.length > 0 ? (
            games.map((game) => (
              <GameCard
                key={game._id}
                {...game}
                isDiscount={game.discount !== undefined}
                discount={game.discount}
                game={game}
              />
            ))
          ) : (
            <MessageBox
              message={
                <p>
                  No games found, change filter or{" "}
                  <b onClick={clearFilters}>Clear filters</b>
                </p>
              }
              type={MessageTypes.INFO}
            />
          )}
        </div>
      </section>
      {status === "loading" ? (
        <Skeleton height={70} />
      ) : games && games?.length <= 0 ? (
        ""
      ) : (
        <ul className={styles.root}>
          <li
            onClick={() =>
              setActivePage(activePage > 1 ? activePage - 1 : activePage)
            }
          >
            <p>&#60;</p>
          </li>
          {[...new Array(pages)].map((_, number) => (
            <li
              key={number + 1}
              className={activePage === number + 1 ? styles.active : ""}
              onClick={() => {
                setActivePage(number + 1);
              }}
            >
              <p>{number + 1}</p>
            </li>
          ))}
          <li
            onClick={() =>
              setActivePage(activePage < pages ? activePage + 1 : activePage)
            }
          >
            <p>&#62;</p>
          </li>
        </ul>
      )}
      <section className={styles["questions"]}>
        <OpenedCard
          title="How to choose a game?"
          description={
            <>
              If a group is going to take part in a board game, you need to take
              into account the average age of the players. There are games that
              do not require activity and are unlikely to appeal to young
              people, while active games will not appeal to older people.
              <br />
              <br />
              Many games are only for a large number of players, while others
              are strictly for two people. There are also individual options,
              but most often the number of participants is from two to four. The
              number of players for which the game is designed is written on its
              packaging. It is important to immediately decide how many people
              will take part in the game. Some board games can be boring for
              only two people. If two people will play more often, you should
              not buy games that are designed for a large company.
              <br />
              <br />
              It is also important how the participants will interact with each
              other during the game. There are two main options: every man for
              himself or in a team. Props can be cards, dice, paper and pencils,
              as well as special devices that are in the box.
              <br />
              <br />
              There are several types of board games: intellectual, creative,
              active and cooperative. Intellectual games are more intended for
              children who need to develop logic and erudition. In an
              entertainment format, they will be able to train their memory and
              thinking. Such games include memo, where you need to remember
              pictures or words. Strategic and economic games develop the skills
              of an entrepreneur and strategist. They teach proper planning.
              Creative games develop imagination. They require more
              concentration. Outdoor games will appeal more to companies because
              they are aimed at interaction between players. In a cooperative
              game, the child will develop speech and communication skills
              through communication with other players.
              <br />
              <br />
              Games are also selected based on the duration of the process: from
              several minutes to several hours. The playing time also depends on
              the number of participants and how well they know the rules.
            </>
          }
        />
        <hr />
        <OpenedCard
          title="What games can you recommend to a newbie?"
          description={
            <>
              Here are some games that I would recommend to a beginner,
              especially if he has an interest in video games:
              <br />
              <br />
              <b>Minecraft:</b> This is a sandbox where you can build and
              explore the world and fight monsters. Minecraft is suitable for
              players of all ages and skills.
              <br />
              <br />
              <b>The Legend of Zelda:</b> Breath of the Wild: This is an
              adventure game from Nintendo that immerses you in an open world
              with exciting quests and puzzles. The game is ideal for beginner
              players.
              <br />
              <br />
              <b>Stardew Valley:</b> This is a farming life simulator where you
              can farm, have animals and build relationships with the locals.
              <br />
              <br />
              <b>Overwatch:</b> If you're interested in team-based shooters,
              Overwatch provides a variety of characters with different skills
              and playstyles, making it beginner-friendly.
              <br />
              <br />
              <b>Rocket League:</b> This is a mixture of football and racing
              cars. You need to score goals while driving a car, which makes the
              game easy to understand but challenging to master.
              <br />
              <br />
              <b>Undertale:</b> This is an indie RPG with a unique combat system
              and moral decisions that affect the story. This game is suitable
              for those who are looking for unforgettable characters and story.
              <br />
              <br />
              <b>Portal 2:</b> This is a first-person puzzle game that provides
              clever puzzles and a fun storyline. It can help improve spatial
              thinking.
              <br />
              <br />
              <b>Celeste: </b> If you want a challenge, then Celeste is a
              challenging platform game with amazing music and an inspiring
              story.
              <br />
              <br />
              <b>Super Mario Odyssey:</b> If you have a Nintendo Switch, this is
              a fun and colorful Mario game that provides plenty of adventure.
              <br />
              <br />
              <b>The Sims 4:</b> Do you like life simulation? The Sims 4 gives
              you the ability to create and manage virtual Sims and their homes.
              <br />
              <br />
              The choice of game depends on your interests and preferences. But
              these games are good options for beginners, as they are accessible
              and fun, and can be a good start in the world of video games.
            </>
          }
        />
        <hr />
        <OpenedCard
          title="Are there any games with discounts?"
          description={
            <>
              Yes, there are games with discounts on our website. We regularly
              offer various promotions and reduced prices on popular games.
              Please visit our Promotions or Discounts page to see current
              offers and learn more about available game discounts. We have
              special offers for our visitors, so don't miss the chance to save
              on your favorite games.
            </>
          }
        />
        <hr />
      </section>
    </Layout>
  );
};

export default CatalogPage;
