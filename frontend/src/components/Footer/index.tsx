import React from "react";
import styles from "./Footer.module.scss";
import Button from "../Button";

const Footer: React.FC = () => {
  return (
    <div className={styles["footer__wrapper"]}>
      <footer className={styles.footer}>
        <ul className={styles["footer__list"]}>
          <li>
            <img src="../img/logo.png" alt="logo" />
            <p>
              City Lublin, <br /> Nadbystrzycka 42a
            </p>
          </li>
          <li>
            <ul>
              <li>
                <a href="#1">
                  <b>Catalog</b>
                </a>
              </li>
              <li>
                <a href="#1">Category 1</a>
              </li>
              <li>
                <a href="#2">Category 2</a>
              </li>
              <li>
                <a href="#3">Category 3</a>
              </li>
              <li>
                <a href="#4">Category 4</a>
              </li>
              <li>
                <a href="#5">Category 5</a>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li>
                <a href="#1">Events</a>
              </li>
              <li>
                <a href="#2">Blog</a>
              </li>
              <li>
                <a href="#3">About us</a>
              </li>
              <li>
                <a href="#4">Contacts</a>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li>
                <a href="#1">Payment</a>
              </li>
              <li>
                <a href="#2">Delivery</a>
              </li>
              <li>
                <a href="#2">Refaund</a>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li>
                <Button text="Order Call" to="#button" />
              </li>
              <li>+48 730 562 141</li>
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
          </li>
        </ul>
      </footer>
      <hr />
      <div className={styles["footer__bottom"]}>
        <ul>
          <li>
            ©2023 MagicGoldFish.pl <br /> <a href="#1">Privacy Policy</a>
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="45"
              height="16"
              viewBox="0 0 45 16"
              fill="none"
            >
              <path
                d="M22.2485 0.483502L19.2304 14.9649H15.5933L18.65 0.483502H22.2485ZM37.5709 9.81861L39.4669 4.39308L40.5503 9.8585H37.5709V9.81861ZM41.6337 14.9649H45L42.0593 0.483502H38.9639C38.2674 0.483502 37.687 0.882438 37.4162 1.56063L31.9604 14.9649H35.7911L36.5262 12.8106H41.1694L41.6337 14.9649ZM32.1539 10.2175C32.1926 6.38776 27.0077 6.18829 27.0464 4.47286C27.0464 3.95425 27.5107 3.39574 28.5942 3.27606C29.1359 3.19627 30.5675 3.15637 32.1926 3.91435L32.8117 0.882438C31.9218 0.523396 30.7997 0.244141 29.4067 0.244141C25.8083 0.244141 23.2932 2.19893 23.2545 5.03137C23.2158 7.10584 25.0731 8.30265 26.4273 8.98084C27.8203 9.69893 28.3233 10.1777 28.3233 10.7761C28.3233 11.7734 27.1625 12.1723 26.1565 12.2122C24.3379 12.2521 23.2545 11.6936 22.4033 11.2947L21.7455 14.4862C22.5967 14.8851 24.1445 15.2441 25.7696 15.2441C29.6389 15.2042 32.1152 13.2495 32.1539 10.2175ZM17.1023 0.483502L11.1823 14.9649H7.35168L4.41101 3.39574C4.25623 2.67765 4.10146 2.43829 3.59845 2.11914C2.70851 1.64042 1.27687 1.16169 0 0.882438L0.0773861 0.483502H6.26827C7.08083 0.483502 7.73861 1.04201 7.93207 1.95957L9.47979 10.3372L13.2717 0.483502H17.1023Z"
                fill="#929292"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="29"
              height="18"
              viewBox="0 0 29 18"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.2358 1.87695H17.8495V15.6164H10.2358V1.87695Z"
                fill="#929292"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.7322 8.74574C10.7322 5.95924 12.0288 3.47623 14.0428 1.87606C12.5806 0.717316 10.7046 0 8.69057 0C3.89006 0 0 3.91765 0 8.74574C0 13.5738 3.89006 17.4915 8.69057 17.4915C10.7322 17.4915 12.5806 16.7742 14.0428 15.6154C12.0288 14.0153 10.7322 11.5322 10.7322 8.74574Z"
                fill="#929292"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M28.1134 8.74574C28.1134 13.5738 24.2233 17.4915 19.4228 17.4915C17.3813 17.4915 15.5328 16.7742 14.0706 15.6154C16.0846 14.0153 17.3813 11.5322 17.3813 8.74574C17.3813 5.95924 16.0846 3.47623 14.043 1.87606C15.5328 0.717316 17.4088 0 19.4228 0C24.2233 0 28.1134 3.91765 28.1134 8.74574Z"
                fill="#929292"
              />
            </svg>
          </li>
          <li>
            The content is not a public offer <br />{" "}
            <a href="#1">Terms of use</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;