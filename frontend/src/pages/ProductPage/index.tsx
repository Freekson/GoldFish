import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import Layout from "../../components/Layout";
import GameCard from "../../components/GameCard";
import styles from "./ProductPage.module.scss";
import { useState } from "react";
import OpenedCard from "../../components/OpenedCard";

const ProductPage: React.FC = () => {
  const [inCart, setInCart] = useState(0);

  return (
    <Layout>
      <Helmet>
        <title>Product</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Catalog", "Category"]}
        pathes={["/", "/catalog", "/catalog/?category=1"]}
        last="Product"
      />
      <h3>Product</h3>
      <section className={styles["product"]}>
        <div className={styles["product__img"]}>
          <img src="/img/game-1.png" alt="game" />
          <h4>Popular questions</h4>
          <OpenedCard
            title="Description"
            description={
              <>
                "Broken Realms: Horrek's Dreadlance" - An Epic Adventure in a
                Fantasy World
                <br />
                <br />
                Review: "Broken Realms: Horrek's Dreadlance" is an exciting game
                that will immerse you in an amazing fantasy world full of
                adventure, magic and mysteries. In this game you will embark on
                an epic journey to uncover the secrets of ancient worlds and
                battle powerful enemies.
                <br />
                <br />
                Plot: Broken Realms: Horrek's Dreadlance is set in a fantasy
                world where good and evil fight for control of ancient artifacts
                and magical powers. You will play the role of a hero whose
                journey is connected with the search for the Ancient Dreadlance,
                a powerful weapon that can change the course of the war. Your
                adventure will begin in a small village, but you will find
                dangerous journeys, mysterious forests and many mysteries to
                solve.
                <br />
                <br />
                Game Features:
                <br />
                <br />
                Captivating Storyline: Immerse yourself in an exciting storyline
                with unexpected turns of events and many mysteries to solve.
                World Exploration: Explore a variety of locations, from
                dangerous forests to ancient ruins, to uncover the secrets of
                the Broken Realms. Tactical Combat: Fight powerful opponents in
                strategic battles. Choose your tactics and use of magic to
                defeat your enemies. Hero Development: Improve your hero's
                skills, collect unique equipment and weapons to become more
                powerful. Riddles and Puzzles: Solve riddles and puzzles to open
                new areas and uncover secrets. Graphics and Sound: "Broken
                Realms: Horrek's Dreadlance" amazes with colorful graphics,
                detailed worlds and an exciting musical atmosphere that
                complements the atmosphere of the game.
                <br />
                <br />
                Conclusion: This game will be useful to all fans of fantasy and
                role-playing games. "Broken Realms: Horrek's Dreadlance"
                promises an exciting adventure filled with magic and danger.
                Prepare to explore ancient worlds, uncover secrets, and battle
                powerful enemies in this action-packed fantasy game.
              </>
            }
          />
          <hr />
          <OpenedCard
            title="How to choose a game?"
            description={
              <>
                If a group is going to take part in a board game, you need to
                take into account the average age of the players. There are
                games that do not require activity and are unlikely to appeal to
                young people, while active games will not appeal to older
                people.
                <br />
                <br />
                Many games are only for a large number of players, while others
                are strictly for two people. There are also individual options,
                but most often the number of participants is from two to four.
                The number of players for which the game is designed is written
                on its packaging. It is important to immediately decide how many
                people will take part in the game. Some board games can be
                boring for only two people. If two people will play more often,
                you should not buy games that are designed for a large company.
                <br />
                <br />
                It is also important how the participants will interact with
                each other during the game. There are two main options: every
                man for himself or in a team. Props can be cards, dice, paper
                and pencils, as well as special devices that are in the box.
                <br />
                <br />
                There are several types of board games: intellectual, creative,
                active and cooperative. Intellectual games are more intended for
                children who need to develop logic and erudition. In an
                entertainment format, they will be able to train their memory
                and thinking. Such games include memo, where you need to
                remember pictures or words. Strategic and economic games develop
                the skills of an entrepreneur and strategist. They teach proper
                planning. Creative games develop imagination. They require more
                concentration. Outdoor games will appeal more to companies
                because they are aimed at interaction between players. In a
                cooperative game, the child will develop speech and
                communication skills through communication with other players.
                <br />
                <br />
                Games are also selected based on the duration of the process:
                from several minutes to several hours. The playing time also
                depends on the number of participants and how well they know the
                rules.
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
                This can be done using the "Add to Cart" button or the cart icon
                visible on the product page. The customer can choose the
                quantity of items and possibly options such as size and color.
                <br />
                2. View cart:
                <br />
                <br />
                After adding items to the cart, the customer can view the
                contents of the cart. Here the customer can check that he has
                selected the right products and change the quantity or remove
                products if necessary.
                <br />
                3. Authorization or registration:
                <br />
                <br />
                To place an order, the customer may be required to log into
                their account or register if they have not done so previously.
                This saves customer data and speeds up the ordering process.
                <br />
                4. Entering delivery information:
                <br />
                <br />
                The client must indicate the delivery address. This includes
                entering your delivery address and contact information. At this
                stage, the client can also choose a delivery method and become
                familiar with delivery options and deadlines.
                <br />
                5. Selecting a payment method:
                <br />
                <br />
                The client chooses a payment method convenient for him. This can
                be payment by credit card, bank transfer, cash upon receipt of
                goods, etc.
                <br />
                6. Order confirmation:
                <br />
                <br />
                Before final confirmation of the order, the customer must review
                all order details and ensure that everything is correct. Here
                the client can also enter promotional codes or coupons, if any.
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
                After placing an order, the client is given the opportunity to
                track its status. This gives the customer confidence that the
                order is being processed and delivered.
                <br />
                10. Receiving an order:
                <br />
                <br />
                Finally, the customer receives the order and can check that all
                products are as expected.
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
                If the order comes with tracking information, use it to check
                the status of your package. Look for any updates regarding the
                location and estimated delivery date. Sometimes, the delay may
                be due to transportation issues. Contact the Retailer or Seller:
                <br />
                <br />
                Reach out to the online retailer or seller from whom you made
                the purchase. They may have more information about your order
                and its status. Provide them with your order number and any
                relevant details. Review Shipping Address:
                <br />
                <br />
                Double-check the shipping address you provided when placing the
                order. Make sure it is accurate and up to date. A simple mistake
                in the address can cause delivery issues. Check for Delivery
                Notifications:
                <br />
                <br />
                Sometimes, delivery carriers leave notifications if they were
                unable to deliver the package. Check for any notes or
                notifications left at your doorstep or in your mailbox. They may
                provide instructions on how to reschedule delivery or pick up
                the package. Wait for a Few More Days:
                <br />
                <br />
                Delivery delays can happen for various reasons, including
                weather, high shipping volumes, or customs clearance. Sometimes,
                packages may arrive a bit later than the estimated delivery
                date. If the delay is not too long, it might be worth waiting a
                few more days. Contact the Shipping Carrier:
                <br />
                <br />
                If the retailer or seller cannot provide a satisfactory update,
                contact the shipping carrier directly. You can usually find
                their customer service contact information on their website.
                Provide them with the tracking number and ask for assistance.
                Request a Refund or Reshipment:
                <br />
                <br />
                If a significant amount of time has passed, and it's clear that
                your order will not be delivered, contact the retailer or seller
                again. Request a refund or ask for the order to be reshipped.
                Most reputable sellers have policies in place to address
                non-delivery issues. Check Purchase Protection:
                <br />
                <br />
                If you made the payment with a credit card or through a payment
                platform like PayPal, review their purchase protection policies.
                You may be eligible for a refund or dispute resolution through
                these services. Leave Feedback and Reviews:
                <br />
                <br />
                After resolving the issue, consider leaving feedback or reviews
                for the seller or the shipping carrier. Honest feedback can help
                other customers make informed decisions and also incentivize
                sellers to improve their services.
              </>
            }
          />
          <hr />
          <OpenedCard
            title="How to return an item?"
            description={
              <>
                Returning an item can vary depending on the specific retailer's
                return policy and the reason for the return. Here's a general
                guide on how to return an item:
                <br />
                <br />
                1. Review the Return Policy:
                <br />
                <br />
                Start by reviewing the retailer's return policy. It should
                provide information on the time frame for returns, acceptable
                reasons for returns, and the process for returning items. Make
                sure you are within the return window. 2. Check the Condition of
                the Item:
                <br />
                <br />
                Ensure that the item is in the same condition as when you
                received it. Most retailers will only accept returns of unused,
                undamaged, and resalable items. 3. Prepare Required Information:
                <br />
                <br />
                Gather all the necessary information, including your order
                number or receipt, the reason for the return, and any
                documentation or packaging that came with the item. 4. Contact
                the Retailer:
                <br />
                <br />
                Reach out to the retailer's customer service. You can typically
                do this through their website, by phone, or by visiting a
                physical store if applicable. Inform them of your intention to
                return the item. 5. Follow Return Instructions:
                <br />
                <br />
                The retailer's customer service will guide you through the
                return process. They may provide you with return shipping labels
                or instructions for returning the item to a physical store. 6.
                Package the Item:
                <br />
                <br />
                Carefully pack the item in its original packaging, if possible.
                If the original packaging is not available, use a secure and
                protective container. Make sure to include all the necessary
                documentation. 7. Label the Package:
                <br />
                <br />
                Attach the return label provided by the retailer if applicable.
                Ensure the label is securely attached and clearly visible on the
                package. 8. Ship the Item:
                <br />
                <br />
                If you are responsible for the return shipping, send the package
                to the address provided by the retailer. Consider using a
                trackable and insured shipping method to ensure the safe arrival
                of the return. 9. Await Confirmation:
                <br />
                <br />
                After returning the item, wait for confirmation from the
                retailer. This may include a notification of the item's receipt
                and the status of your return. 10. Receive Refund or
                Replacement: - Once the retailer receives and inspects the
                returned item, they will typically issue a refund to your
                original payment method or provide a replacement, depending on
                your preference and their policy.
                <br />
                <br />
                11. Keep Records: - Maintain records of all communication and
                transactions related to the return, including emails, receipts,
                and tracking information.
                <br />
                <br />
                It's important to note that return policies can vary, so it's
                crucial to follow the specific instructions provided by the
                retailer. Some retailers may offer free returns, while others
                may require you to cover return shipping costs. Additionally,
                some items, such as personalized or perishable goods, may not be
                eligible for returns. Always check the return policy and contact
                customer service if you have any questions or concerns.
              </>
            }
          />
          <hr />
        </div>
        <div className={styles["product__description"]}>
          <p className={styles["product__code"]}>Product code: 842672</p>
          <p className={styles["product__price"]}>$123</p>
          <div
            className={inCart === 0 ? styles["buy"] : styles["buy_active"]}
            onClick={() => {
              setInCart(inCart + 1);
            }}
          >
            {inCart <= 0 ? (
              <>Add to Cart</>
            ) : (
              <p>
                In Cart <span className={styles.quantity}>{inCart}</span>
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
    </Layout>
  );
};

export default ProductPage;
