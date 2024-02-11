import React, { ChangeEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./BlogPage.module.scss";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import OpenedCard from "../../components/OpenedCard";
import Skeleton from "react-loading-skeleton";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAuthorCount, fetchTagsCount } from "../../redux/count/slice";
import { fetchWishlist } from "../../redux/wishlist/slice";
import { fetchFilteredArticles } from "../../redux/article/slice";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import ArticleCard from "../../components/ArticleCard";
import { ThreeDots } from "react-loader-spinner";

const BlogPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();

  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const [activePage, setActivePage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "highest-rated", label: "Most Rated" },
    { value: "lowest-rated", label: "Less Rated" },
  ];

  const {
    authorsCount,
    tagsCount,
    status: countStatus,
  } = useSelector((state: RootState) => state.count);
  const { userData } = useSelector((state: RootState) => state.user);

  const { filterData, statusAll } = useSelector(
    (state: RootState) => state.article
  );

  const articles = filterData?.articles;
  const pages = filterData?.totalPages ?? 1;

  //? fetch cound data
  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchAuthorCount());
      dispatch(fetchTagsCount());
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  //? fetch data from url

  useEffect(() => {
    const sp = new URLSearchParams(search);
    const authors = sp.get("authors");
    const tags = sp.get("tags");
    const sort = sp.get("sort");
    const page = sp.get("page");
    const searchUrl = sp.get("search");

    if (authors === null) {
      setSelectedAuthors([]);
    } else {
      setSelectedAuthors(JSON.parse(decodeURIComponent(authors)));
    }

    if (tags === null) {
      setSelectedTags([]);
    } else {
      setSelectedTags(JSON.parse(decodeURIComponent(tags)));
    }

    if (sort === null) {
      setSortOption("newest");
    } else {
      setSortOption(sort);
    }

    if (page === null || !page) {
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

  //? updating filters

  useEffect(() => {
    const queryParams = [];

    if (selectedAuthors.length > 0) {
      queryParams.push(
        `authors=${encodeURIComponent(JSON.stringify(selectedAuthors))}`
      );
    }

    if (selectedTags.length > 0) {
      queryParams.push(
        `tags=${encodeURIComponent(JSON.stringify(selectedTags))}`
      );
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

    if (debouncedSearch) {
      queryParams.push(`search=${debouncedSearch}`);
    }

    const queryString = queryParams.join("&");
    const url = `${queryString ? `?${queryString}` : ""}`;

    const newUrl = `/blog/${url}`;
    window.history.pushState({}, "", newUrl);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const fetchData = async () => {
      dispatch(fetchFilteredArticles({ path: `/filtered${url}` }));
    };
    fetchData();
  }, [
    activePage,
    debouncedSearch,
    dispatch,
    pages,
    selectedAuthors,
    selectedTags,
    sortOption,
  ]);

  //? update wishlist

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

  //? handlers
  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    setSearchValue(search);
  };

  const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const author = event.target.value;
    const isChecked = event.target.checked;

    setSelectedAuthors((prevSelectedAuthors) => {
      if (isChecked) {
        return [...prevSelectedAuthors, author];
      } else {
        return prevSelectedAuthors.filter(
          (selectedAuthor) => selectedAuthor !== author
        );
      }
    });
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tag = event.target.value;
    const isChecked = event.target.checked;

    setSelectedTags((prevSelectedTags) => {
      if (isChecked) {
        return [...prevSelectedTags, tag];
      } else {
        return prevSelectedTags.filter((selectedTag) => selectedTag !== tag);
      }
    });
  };

  //? other functions

  const onClickDelete = () => {
    setSearchValue("");
  };

  const clearFilters = () => {
    setSelectedAuthors([]);
    setSelectedTags([]);
    setSortOption(sortOptions[0].value);
    setActivePage(1);
    setSearchValue("");
    navigate(`/blog/?sort=newest&page=1`);
  };

  return (
    <Layout>
      <Helmet>
        <title>Blog</title>
      </Helmet>
      <Breadcrumbs last="Blog" />
      <div className={styles["blog-up"]}>
        <h3>Blog</h3>
        <div className={styles["sort-by"]}>
          <div className={styles["blog-input"]}>
            <input
              type="text"
              onChange={handleInputChange}
              value={searchValue}
              placeholder="Find article"
            />
            <svg
              className={styles["input-img"]}
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
            >
              <path
                d="M20 20L15.514 15.506L20 20ZM18 9.5C18 11.7543 17.1045 13.9163 15.5104 15.5104C13.9163 17.1045 11.7543 18 9.5 18C7.24566 18 5.08365 17.1045 3.48959 15.5104C1.89553 13.9163 1 11.7543 1 9.5C1 7.24566 1.89553 5.08365 3.48959 3.48959C5.08365 1.89553 7.24566 1 9.5 1C11.7543 1 13.9163 1.89553 15.5104 3.48959C17.1045 5.08365 18 7.24566 18 9.5V9.5Z"
                stroke="#2A2A2A"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
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
          <div className={styles["sort-select"]}>
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
      </div>
      <section className={styles["blog"]}>
        <div className={styles["blog__filters"]}>
          <h4>Filter by:</h4>
          <OpenedCard
            className={styles["openedCard"]}
            title="Authors"
            description={
              <div className={styles["filters"]}>
                {countStatus === "loading" ? (
                  <Skeleton height={100} width={200} />
                ) : (
                  authorsCount.map((author, index) => (
                    <fieldset key={index}>
                      <input
                        type="checkbox"
                        value={author._id}
                        onChange={handleAuthorChange}
                        checked={selectedAuthors.includes(author._id)}
                      />{" "}
                      <label>
                        {author.name} ({authorsCount[index].count})
                      </label>
                    </fieldset>
                  ))
                )}
                <p
                  className={styles["clear-filters-btn"]}
                  onClick={() => setSelectedAuthors([])}
                >
                  Clear filter
                </p>
              </div>
            }
          />
          <OpenedCard
            className={styles["openedCard"]}
            title="Tags"
            description={
              <div className={styles["filters"]}>
                {countStatus === "loading" ? (
                  <Skeleton height={100} width={200} />
                ) : (
                  tagsCount.map((tag, index) => (
                    <fieldset key={index}>
                      <input
                        type="checkbox"
                        value={tag._id}
                        onChange={handleTagChange}
                        checked={selectedTags.includes(tag._id)}
                      />{" "}
                      <label style={{ textTransform: "capitalize" }}>
                        {tag._id} ({tagsCount[index].count})
                      </label>
                    </fieldset>
                  ))
                )}
                <p
                  className={styles["clear-filters-btn"]}
                  onClick={() => setSelectedTags([])}
                >
                  Clear filter
                </p>
              </div>
            }
          />
          <p className={styles["clear-btn"]} onClick={clearFilters}>
            Clear all filters
          </p>
        </div>
        <div className={styles["blog__items"]}>
          {statusAll === "loading" ? (
            <div className={styles["loading"]}>
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#fb791b"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                visible={true}
              />
            </div>
          ) : statusAll === "error" ? (
            <MessageBox
              message="There is a problem with connection to DB, check your internet conection"
              type={MessageTypes.DANGER}
            />
          ) : countStatus === "error" ? (
            <MessageBox
              message="Erorr while loading authors or tags, its problem on server side, we are already working on it"
              type={MessageTypes.DANGER}
            />
          ) : articles && articles.length > 0 ? (
            articles.map((article) => <ArticleCard article={article} />)
          ) : (
            <MessageBox
              message={
                <p>
                  No articles found, change filter or{" "}
                  <b onClick={clearFilters}>Clear filters</b>
                </p>
              }
              type={MessageTypes.INFO}
            />
          )}
        </div>
      </section>

      {statusAll === "loading" ? (
        <Skeleton height={70} />
      ) : (articles && articles?.length <= 0) || pages <= 0 ? (
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
    </Layout>
  );
};

export default BlogPage;
