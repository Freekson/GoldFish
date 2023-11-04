import { Helmet } from "react-helmet-async";
import Layout from "../../components/Layout";
import styles from "./CatalogPage.module.scss";
import GameCard from "../../components/GameCard";
import Breadcrumbs from "../../components/Breadcrumbs";
import OpenedCard from "../../components/OpenedCard";
import Pagination from "../../components/Pagination";

const CatalogPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Catalog</title>
      </Helmet>
      <Breadcrumbs last="Catalog" />
      <div className={styles["catalog-up"]}>
        <h3>Catalog</h3>

        <div className={styles["sort-by"]}>
          <p>Sort By</p>
          <select>
            <option value="newest">Newest Arrivals</option>
            <option value="oldest">Oldest Arrivals</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="toprated">Most Rated</option>
            <option value="lessrated">Less Rated</option>
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
                <fieldset>
                  <input type="checkbox" /> <label>Category 1</label>
                </fieldset>
                <fieldset>
                  <input type="checkbox" /> <label>Category 2</label>
                </fieldset>
                <fieldset>
                  <input type="checkbox" /> <label>Category 3</label>
                </fieldset>
              </div>
            }
          />

          <OpenedCard
            className={styles["openedCard"]}
            title="Game publisher"
            description={
              <div className={styles["filters"]}>
                <fieldset>
                  <input type="checkbox" /> <label>Publisher 1</label>
                </fieldset>
                <fieldset>
                  <input type="checkbox" /> <label>Publisher 2</label>
                </fieldset>
                <fieldset>
                  <input type="checkbox" /> <label>Publisher 3</label>
                </fieldset>
              </div>
            }
          />
          <h4>Price</h4>
          <div className={styles["filters"]}>
            <fieldset>
              <div className={styles["prices"]}>
                <div>
                  From: <input type="text" placeholder="0" />
                </div>
                <div>
                  To: <input type="text" placeholder="1000" />
                </div>
              </div>
            </fieldset>
            <input type="checkbox" /> Only with discount
          </div>
          <h4>Customer review</h4>
          <div className={styles["filters"]}>
            <fieldset>
              <input type="checkbox" /> <label>5 stars</label>
            </fieldset>
            <fieldset>
              <input type="checkbox" /> <label>4 stars</label>
            </fieldset>
            <fieldset>
              <input type="checkbox" /> <label>3 stars</label>
            </fieldset>
          </div>
        </div>
        <div className={styles["catalog__items"]}>
          <GameCard
            img="/img/game-1.png"
            title="Broken Realms: Horrek's Dreadlance"
            price={23}
          />
          <GameCard
            img="/img/game-1.png"
            title="Broken Realms: Horrek's Dreadlance"
            price={23}
          />
          <GameCard
            img="/img/game-1.png"
            title="Broken Realms: Horrek's Dreadlance"
            price={23}
          />
          <GameCard
            img="/img/game-1.png"
            title="Broken Realms: Horrek's Dreadlance"
            price={23}
          />
          <GameCard
            img="/img/game-1.png"
            title="Broken Realms: Horrek's Dreadlance"
            price={23}
          />
          <GameCard
            img="/img/game-1.png"
            title="Broken Realms: Horrek's Dreadlance"
            price={23}
          />
        </div>
      </section>
      <Pagination pages={5} />
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
