import React, { useEffect, useRef, useState } from "react";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const profileRef = useRef<HTMLUListElement | null>(null);
  const activeRef = useRef<HTMLLIElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileActive(false);
      }

      if (
        activeRef.current &&
        !activeRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };
    const handleScroll = () => {
      setIsProfileActive(false);
      setIsActive(false);
    };

    if (isProfileActive || isActive) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("scroll", handleScroll);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isActive, isProfileActive]);

  return (
    <header className={styles.header}>
      <div className={styles["header__container"]}>
        <div className={styles["header__top"]}>
          <div className={styles["header__left"]}>
            <svg
              className={styles["mobile-toogle"]}
              onClick={() => setIsActive(!isActive)}
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="16"
              viewBox="0 0 18 16"
              fill="none"
            >
              <rect width="18" height="2.25" fill="white" />
              <rect y="6.75" width="18" height="2.25" fill="white" />
              <rect y="13.5" width="18" height="2.25" fill="white" />
            </svg>
            <Link to={"/"}>
              <img
                className={styles["header__logo"]}
                src="/img/logo.png"
                alt="logo"
              />
            </Link>
            <div className={styles["header__input-container"]}>
              <input
                className={styles["header__input"]}
                type="text"
                placeholder="Find game"
              />
              <svg
                onClick={() => navigate("/catalog")}
                className={styles["header__input-img"]}
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
          </div>
          <div className={styles["header__right"]}>
            <div className={styles["header__phone"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="27"
                viewBox="0 0 28 27"
                fill="none"
              >
                <path
                  d="M19.25 16.875C17.5 18.5625 17.5 20.25 15.75 20.25C14 20.25 12.25 18.5625 10.5 16.875C8.75 15.1875 7 13.5 7 11.8125C7 10.125 8.75 10.125 10.5 8.4375C12.25 6.75 7 1.6875 5.25 1.6875C3.5 1.6875 0 6.75 0 6.75C0 10.125 3.59625 16.9678 7 20.25C10.4038 23.5322 17.5 27 21 27C21 27 26.25 23.625 26.25 21.9375C26.25 20.25 21 15.1875 19.25 16.875Z"
                  fill="white"
                />
              </svg>
              <p>+48 730 562 141</p>
            </div>
            <div className={styles["header__icons"]}>
              <span>
                <svg
                  onClick={() => setIsProfileActive(!isProfileActive)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="29"
                  viewBox="0 0 30 29"
                  fill="none"
                >
                  <path
                    d="M15 0.695312C12.9545 0.695312 11.3565 1.43942 10.206 2.92765C9.0554 4.41587 8.48011 6.31827 8.48011 8.63485C8.46591 11.513 9.40341 13.7945 11.2926 15.4793C11.5341 15.7039 11.6193 15.9917 11.5483 16.3427L11.0582 17.3536C10.902 17.6906 10.6712 17.9538 10.3658 18.1433C10.0604 18.3329 9.41761 18.6031 8.4375 18.9541C8.39489 18.9682 7.49645 19.256 5.74219 19.8176C3.98793 20.3792 3.05398 20.6881 2.94034 20.7442C1.74716 21.2356 0.965909 21.7481 0.596591 22.2816C0.198864 23.1661 0 25.4055 0 28.9997H30C30 25.4055 29.8011 23.1661 29.4034 22.2816C29.0341 21.7481 28.2528 21.2356 27.0597 20.7442C26.946 20.6881 26.0121 20.3792 24.2578 19.8176C22.5036 19.256 21.6051 18.9682 21.5625 18.9541C20.5824 18.6031 19.9396 18.3329 19.6342 18.1433C19.3288 17.9538 19.098 17.6906 18.9418 17.3536L18.4517 16.3427C18.3807 15.9917 18.4659 15.7039 18.7074 15.4793C20.5966 13.7945 21.5341 11.513 21.5199 8.63485C21.5199 6.31827 20.9446 4.41587 19.794 2.92765C18.6435 1.43942 17.0455 0.695312 15 0.695312Z"
                    fill="white"
                  />
                </svg>
              </span>

              <Link to="/cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="27"
                  viewBox="0 0 30 27"
                  fill="none"
                >
                  <path
                    d="M28.741 6.20821C28.489 5.77161 28.1282 5.40778 27.6937 5.15219C27.2592 4.89661 26.7659 4.75799 26.2618 4.74988H7.59518L6.74935 1.45405C6.66389 1.13589 6.47323 0.856047 6.20842 0.660088C5.94361 0.464128 5.62025 0.363601 5.29102 0.374879H2.37435C1.98757 0.374879 1.61664 0.528524 1.34315 0.802015C1.06966 1.07551 0.916016 1.44644 0.916016 1.83321C0.916016 2.21999 1.06966 2.59092 1.34315 2.86441C1.61664 3.1379 1.98757 3.29155 2.37435 3.29155H4.18268L8.20768 18.254C8.29314 18.5722 8.4838 18.852 8.74861 19.048C9.01342 19.244 9.33678 19.3445 9.66602 19.3332H22.791C23.0603 19.3324 23.3241 19.257 23.5532 19.1154C23.7823 18.9739 23.9677 18.7716 24.0889 18.5311L28.8723 8.96446C29.0796 8.5299 29.1761 8.05077 29.1532 7.56983C29.1303 7.08889 28.9887 6.62111 28.741 6.20821Z"
                    fill="white"
                  />
                  <path
                    d="M8.9375 26.625C10.1456 26.625 11.125 25.6456 11.125 24.4375C11.125 23.2294 10.1456 22.25 8.9375 22.25C7.72938 22.25 6.75 23.2294 6.75 24.4375C6.75 25.6456 7.72938 26.625 8.9375 26.625Z"
                    fill="white"
                  />
                  <path
                    d="M23.5195 26.625C24.7277 26.625 25.707 25.6456 25.707 24.4375C25.707 23.2294 24.7277 22.25 23.5195 22.25C22.3114 22.25 21.332 23.2294 21.332 24.4375C21.332 25.6456 22.3114 26.625 23.5195 26.625Z"
                    fill="white"
                  />
                </svg>
              </Link>
            </div>
            <ul
              ref={profileRef}
              className={
                isProfileActive
                  ? `${styles["profile"]} ${styles["profile_active"]}`
                  : styles["profile"]
              }
            >
              <li>
                <Link to="/profile" onClick={() => setIsProfileActive(false)}>
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/profile/orders"
                  onClick={() => setIsProfileActive(false)}
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/profile/events"
                  onClick={() => setIsProfileActive(false)}
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/profile/dashboard"
                  onClick={() => setIsProfileActive(false)}
                >
                  Admin dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile/settings"
                  onClick={() => setIsProfileActive(false)}
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles["header__bottom"]}>
        <div className={styles["header__bottom-wrapper"]}>
          <ul>
            <li ref={activeRef} onClick={() => setIsActive(!isActive)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
              >
                <rect width="16" height="2" fill="#2A2A2A" />
                <rect y="6" width="16" height="2" fill="#2A2A2A" />
                <rect y="12" width="16" height="2" fill="#2A2A2A" />
              </svg>
              Catalog
            </li>
            <li>
              <a href="#events">Events</a>
            </li>
            <li>
              <a href="#blog">Blog</a>
            </li>
            <li>
              <Link to="/about-us">About us</Link>
            </li>
            <li>
              <a href="#contct">Contacts</a>
            </li>
            <li className={styles.icons}>
              <a href="#insta">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                >
                  <g clipPath="url(#clip0_11473_2835)">
                    <path
                      d="M11.4318 0.0888672C8.32951 0.0888672 7.9394 0.103157 6.72048 0.157458C5.50156 0.214617 4.67133 0.4061 3.94398 0.689038C3.18104 0.976004 2.48998 1.42614 1.91912 2.00798C1.33763 2.57914 0.887548 3.27011 0.60017 4.03284C0.317233 4.75876 0.124321 5.59043 0.0685909 6.80506C0.0142898 8.02684 0 8.41552 0 11.5221C0 14.6259 0.0142898 15.0145 0.0685909 16.2335C0.12575 17.4509 0.317233 18.2812 0.60017 19.0085C0.893111 19.7602 1.28322 20.3975 1.91912 21.0334C2.55358 21.6693 3.19091 22.0608 3.94255 22.3523C4.67133 22.6353 5.50013 22.8282 6.71762 22.8839C7.93797 22.9382 8.32665 22.9525 11.4318 22.9525C14.537 22.9525 14.9242 22.9382 16.1446 22.8839C17.3606 22.8268 18.1937 22.6353 18.9211 22.3523C19.6835 22.0652 20.3741 21.6151 20.9445 21.0334C21.5804 20.3975 21.9705 19.7602 22.2635 19.0085C22.545 18.2812 22.7379 17.4509 22.795 16.2335C22.8493 15.0145 22.8636 14.6259 22.8636 11.5207C22.8636 8.41552 22.8493 8.02684 22.795 6.80649C22.7379 5.59043 22.545 4.75876 22.2635 4.03284C21.9761 3.27009 21.526 2.57911 20.9445 2.00798C20.3738 1.42593 19.6827 0.975755 18.9197 0.689038C18.1909 0.4061 17.3592 0.213188 16.1432 0.157458C14.9228 0.103157 14.5356 0.0888672 11.429 0.0888672H11.4332H11.4318ZM10.4072 2.14945H11.4332C14.4855 2.14945 14.8471 2.15946 16.0517 2.21519C17.1663 2.2652 17.7722 2.4524 18.1752 2.60815C18.7082 2.81536 19.0897 3.064 19.4898 3.46411C19.8899 3.86423 20.1371 4.24433 20.3443 4.77877C20.5015 5.18031 20.6873 5.7862 20.7373 6.9008C20.793 8.10543 20.8045 8.46696 20.8045 11.5178C20.8045 14.5687 20.793 14.9317 20.7373 16.1363C20.6873 17.2509 20.5001 17.8553 20.3443 18.2583C20.1611 18.7547 19.8685 19.2035 19.4884 19.5715C19.0883 19.9717 18.7082 20.2189 18.1737 20.4261C17.7736 20.5833 17.1677 20.769 16.0517 20.8205C14.8471 20.8748 14.4855 20.8876 11.4332 20.8876C8.38095 20.8876 8.01799 20.8748 6.81336 20.8205C5.69876 20.769 5.0943 20.5833 4.69133 20.4261C4.19476 20.243 3.74553 19.951 3.37667 19.5715C2.99621 19.2029 2.70323 18.7537 2.51929 18.2569C2.36353 17.8553 2.17633 17.2495 2.12632 16.1349C2.07202 14.9302 2.06059 14.5687 2.06059 11.515C2.06059 8.46267 2.07202 8.10257 2.12632 6.89794C2.17776 5.78334 2.36353 5.17746 2.52072 4.77448C2.72792 4.24148 2.97656 3.85994 3.37667 3.45982C3.77679 3.05971 4.15689 2.8125 4.69133 2.6053C5.0943 2.44811 5.69876 2.26234 6.81336 2.2109C7.86795 2.16231 8.27664 2.14802 10.4072 2.14659V2.14945ZM17.535 4.04713C17.3548 4.04713 17.1764 4.08262 17.01 4.15156C16.8436 4.2205 16.6923 4.32155 16.565 4.44893C16.4376 4.57632 16.3365 4.72754 16.2676 4.89398C16.1986 5.06042 16.1632 5.2388 16.1632 5.41895C16.1632 5.5991 16.1986 5.77749 16.2676 5.94392C16.3365 6.11036 16.4376 6.26159 16.565 6.38897C16.6923 6.51636 16.8436 6.61741 17.01 6.68635C17.1764 6.75529 17.3548 6.79077 17.535 6.79077C17.8988 6.79077 18.2477 6.64624 18.505 6.38897C18.7623 6.13171 18.9068 5.78278 18.9068 5.41895C18.9068 5.05512 18.7623 4.7062 18.505 4.44893C18.2477 4.19166 17.8988 4.04713 17.535 4.04713ZM11.4332 5.65045C10.6546 5.6383 9.88123 5.78118 9.15828 6.07077C8.43534 6.36036 7.77723 6.79087 7.22227 7.33724C6.6673 7.88362 6.22657 8.53493 5.92574 9.25327C5.62491 9.97161 5.46998 10.7426 5.46998 11.5214C5.46998 12.3002 5.62491 13.0712 5.92574 13.7895C6.22657 14.5079 6.6673 15.1592 7.22227 15.7056C7.77723 16.2519 8.43534 16.6824 9.15828 16.972C9.88123 17.2616 10.6546 17.4045 11.4332 17.3924C12.9745 17.3683 14.4444 16.7392 15.5258 15.6408C16.6072 14.5424 17.2133 13.0628 17.2133 11.5214C17.2133 9.98 16.6072 8.50042 15.5258 7.40202C14.4444 6.30361 12.9745 5.67449 11.4332 5.65045ZM11.4332 7.7096C12.444 7.7096 13.4134 8.11113 14.1281 8.82584C14.8428 9.54056 15.2443 10.5099 15.2443 11.5207C15.2443 12.5314 14.8428 13.5008 14.1281 14.2155C13.4134 14.9302 12.444 15.3318 11.4332 15.3318C10.4225 15.3318 9.45312 14.9302 8.7384 14.2155C8.02369 13.5008 7.62216 12.5314 7.62216 11.5207C7.62216 10.5099 8.02369 9.54056 8.7384 8.82584C9.45312 8.11113 10.4225 7.7096 11.4332 7.7096Z"
                      fill="#F9A43F"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_11473_2835">
                      <rect
                        width="22.8636"
                        height="22.8636"
                        fill="white"
                        transform="translate(0 0.0888672)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </a>
              <a href="#facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="23"
                  viewBox="0 0 24 23"
                  fill="none"
                >
                  <path
                    d="M12.4341 9.45168V8.21051C12.4341 7.67267 12.5582 7.38307 13.427 7.38307H14.5027V5.31445H12.8478C10.7792 5.31445 9.95177 6.67974 9.95177 8.21051V9.45168H8.29688V11.5203H9.95177V17.7261H12.4341V11.5203H14.2545L14.5027 9.45168H12.4341Z"
                    fill="#F9A43F"
                  />
                  <rect
                    x="1.58984"
                    y="1.08887"
                    width="20.8636"
                    height="20.8636"
                    rx="6"
                    stroke="#F9A43F"
                    strokeWidth="2"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
        <div
          className={
            isActive ? styles["header__menu_active"] : styles["header__menu"]
          }
        >
          <ul>
            <li>
              <Link
                to="/catalog/?category=1"
                onClick={() => setIsActive(false)}
              >
                Category 1
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                >
                  <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="#C8C5C3" />
                </svg>
              </Link>
            </li>
            <li>
              <Link
                to="/catalog/?category=2"
                onClick={() => setIsActive(false)}
              >
                Category 2
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                >
                  <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="#C8C5C3" />
                </svg>
              </Link>
            </li>
            <li>
              <Link
                to="/catalog/?category=3"
                onClick={() => setIsActive(false)}
              >
                Category 3
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                >
                  <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="#C8C5C3" />
                </svg>
              </Link>
            </li>
            <li>
              <Link
                to="/catalog/?category=4"
                onClick={() => setIsActive(false)}
              >
                Category 4
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                >
                  <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="#C8C5C3" />
                </svg>
              </Link>
            </li>
            <li>
              <Link
                to="/catalog/?category=5"
                onClick={() => setIsActive(false)}
              >
                Category 5
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                >
                  <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="#C8C5C3" />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles["mobile-bottom"]}>
        <div className={styles["header__input-container"]}>
          <input
            className={styles["header__input"]}
            type="text"
            placeholder="Find game"
          />
          <svg
            className={styles["header__input-img"]}
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
        <div
          className={
            isActive ? styles["mobile-menu_active"] : styles["mobile-menu"]
          }
        >
          <ul>
            <li>
              <Link to="/catalog">
                Catalog
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                >
                  <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="#C8C5C3" />
                </svg>
              </Link>
            </li>
            <li>
              <a href="2">
                Events
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                >
                  <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="#C8C5C3" />
                </svg>
              </a>
            </li>
            <li>
              <a href="3">
                Blog
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                >
                  <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="#C8C5C3" />
                </svg>
              </a>
            </li>
            <li>
              <Link to="/about-us">
                About us
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                >
                  <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="#C8C5C3" />
                </svg>
              </Link>
            </li>
            <li>
              <a href="5">
                Contacts
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                >
                  <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="#C8C5C3" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
