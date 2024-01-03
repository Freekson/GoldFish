import React, { ChangeEvent, FormEvent, useState } from "react";
import styles from "./Comment.module.scss";

type TProps = {
  isCommentReply?: boolean;
};
const Comment: React.FC<TProps> = ({ isCommentReply = false }) => {
  const content = `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio
    incidunt minus id nulla eius ducimus quasi natus pariatur. Nisi,
    voluptatum ab. Explicabo, eveniet! Voluptate fugit, dolorum, repellat
    eaque aliquam, ratione nesciunt voluptatum dolor atque eius fuga?
    Nesciunt officia, placeat quia deleniti iste suscipit, nulla sequi
    eum, tenetur beatae at autem cumque soluta. Asperiores animi
    cupiditate quis? Commodi dolores iure optio perspiciatis nostrum,
    inventore distinctio sint velit natus labore animi doloremque officia
    omnis suscipit voluptatem quod sed ea excepturi? Repellat hic
    assumenda, aut eos explicabo magnam autem vel consequuntur minima
    recusandae delectus ipsum. Eveniet quam dolorem necessitatibus,
    veritatis sunt iste ducimus neque explicabo ut recusandae quos nostrum
    officiis doloremque illum a, aliquid numquam sapiente! Temporibus
    aliquid magni voluptatibus sint quisquam quam, quia quae consequuntur
    laudantium, pariatur quibusdam earum iste repellendus fugiat
    perspiciatis eaque accusantium recusandae distinctio cumque maxime
    totam? Sapiente nobis, temporibus voluptatum, quos, natus dolor
    repellendus consequatur qui dolores recusandae provident
    necessitatibus officiis? Quidem repudiandae doloremque itaque
    recusandae aut ratione id, eveniet, accusantium ducimus quis
    praesentium? Sapiente dicta veniam libero quasi nobis quae. Sunt vel
    dolore adipisci recusandae velit voluptatum sapiente sed cumque
    laudantium? In, est recusandae corporis eligendi molestias commodi
    explicabo quas. Est sed libero debitis officiis explicabo nemo autem
    magni iure provident minus nobis aperiam ea, numquam quo deserunt
    quaerat quas dolorum tempore ratione hic animi. Rem eos, esse tenetur
    nobis, asperiores perferendis eligendi maxime reiciendis aperiam error
    voluptatem culpa ipsa, sed in quasi natus optio repudiandae alias?
    Omnis, quos ab deserunt obcaecati unde repudiandae non voluptatibus
    nam eos! Recusandae molestias soluta error nulla numquam minima
    laboriosam. Commodi, dignissimos quo! Placeat modi ullam accusantium
    iste sint nesciunt? Distinctio id sequi omnis quis debitis explicabo.
    Possimus consequatur dignissimos dolores inventore ratione fugit
    voluptates adipisci, nulla tempore unde iusto eum doloremque repellat
    beatae quis commodi earum corrupti voluptas aut voluptatum. Enim
    eligendi provident itaque perspiciatis harum. Vitae porro eaque animi
    excepturi quas alias eligendi obcaecati dolor, quibusdam iure. Beatae
    dolores debitis quo obcaecati autem doloremque iste esse libero neque
    saepe dignissimos, similique dolorem natus suscipit reprehenderit ea
    quaerat officiis facere nobis ipsam facilis modi voluptate itaque.
    Natus beatae est quod voluptate, error eum amet ratione minus dolor
    suscipit sequi iste doloremque? Ex, unde? Sit, quasi. Quia aliquam
    ipsa doloremque, voluptatibus, aspernatur dolorum excepturi obcaecati,
    tempore fugit voluptatum quae exercitationem voluptates esse nihil
    itaque vero repellat provident doloribus assumenda libero! Iste error
    ad quam quibusdam cumque id assumenda consectetur in eius, asperiores
    provident iure ab at quae quis, temporibus quisquam velit vel alias
    animi adipisci a. Nesciunt delectus, officiis, possimus omnis
    perspiciatis natus mollitia beatae inventore nemo aperiam laborum
    asperiores nulla eos fugit sint reiciendis consequatur laboriosam
    accusamus, doloribus cum? Ab suscipit ex labore quidem odio temporibus
    doloribus expedita tenetur adipisci totam. Recusandae, quam nulla
    magnam alias voluptatem iusto nesciunt praesentium modi autem aliquam
    blanditiis molestiae aperiam eum quia accusamus ea aut eligendi magni
    repellat, mollitia commodi ipsum est necessitatibus sit. Quia fugit
    repellendus ratione, saepe aperiam incidunt adipisci iure eius
    mollitia obcaecati, ab eum facilis inventore reiciendis. Accusantium
    incidunt neque voluptas, possimus corrupti ex dolore distinctio soluta
    explicabo quasi excepturi eum quibusdam doloribus est in quod expedita
    ullam laboriosam debitis, sit hic quaerat cum quidem enim! Officiis
    adipisci harum eum perspiciatis esse quia quos commodi blanditiis sed
    sit pariatur ipsa doloribus asperiores expedita dolore minus nam,
    maiores cum quis! Aperiam aspernatur ullam tenetur odit quibusdam
    cupiditate, unde quas asperiores vero provident ea rerum eos illo ab
    animi quod, inventore, ad deleniti commodi et molestiae distinctio
    illum. Magni atque saepe iusto sunt incidunt sed quod nostrum nam illo
    voluptatem animi tenetur dolore dicta, unde ipsa aliquam porro rerum
    repellat accusantium? Perspiciatis officia, dignissimos cupiditate vel
    ducimus perferendis eligendi rerum soluta accusamus magnam, fugiat
    nobis iusto ipsa minus reprehenderit? Dolorum ut, repudiandae id
    perspiciatis itaque magnam magni obcaecati non quae culpa velit hic
    quod explicabo in error distinctio debitis soluta maxime quaerat.
    Ipsum reprehenderit, culpa sed optio totam eaque unde fugiat officia
    accusamus eos molestiae rem alias incidunt beatae nihil repellendus
    delectus eligendi dolore pariatur minima. Dicta, deleniti minima
    fugiat beatae laudantium nihil necessitatibus suscipit tempore numquam
    tempora iusto consectetur accusantium? Ipsam cupiditate in explicabo,
    et itaque optio facere ullam placeat dolores numquam, aut a reiciendis
    totam atque voluptate quas! Pariatur, consequatur sunt voluptas rerum
    molestiae aliquid doloribus perspiciatis hic repellendus nobis autem
    vel voluptatem neque veniam, fugit possimus veritatis amet sint, quos
    accusamus alias maiores. Tempora, nesciunt minus harum similique
    itaque quam aperiam odio animi aut dolor ab deserunt dolore neque
    expedita praesentium, error omnis maiores ipsum necessitatibus?
    Tempora nam, error quo alias eos deserunt. Officiis consequatur rem,
    architecto eveniet in, fugiat ipsum magnam tempore natus expedita eos
    quas quos nam, explicabo veritatis culpa hic aperiam autem quam sint
    nihil rerum modi. Laboriosam neque error esse recusandae excepturi,
    cupiditate nihil tempore architecto doloribus commodi vitae quasi
    voluptates nobis, saepe facere. Maiores, ea nam ut, ipsam optio
    tempore nostrum itaque atque eos suscipit architecto, delectus illo
    nobis obcaecati! Necessitatibus, repellendus eaque labore illo dicta,
    pariatur eos eligendi earum corporis temporibus, saepe consequatur
    omnis sapiente voluptatum vitae esse minima! Facilis mollitia a esse
    tempora eius commodi, consequatur praesentium officia, ipsa illum
    ratione quaerat laudantium animi nulla vitae possimus eligendi
    voluptates accusamus dolore, doloribus corporis perferendis excepturi!
    Harum, ad veniam! Explicabo et cumque eos? Numquam quisquam maiores
    dignissimos ullam esse? Ratione velit, nesciunt culpa id neque ullam a
    rem veniam necessitatibus, iure esse? Ad eaque modi voluptatum,
    commodi veniam quam deserunt natus ex magni itaque reiciendis beatae
    debitis ratione quidem sed. Obcaecati eligendi rem maiores
    exercitationem totam aliquid delectus rerum? Nulla temporibus itaque
    inventore, deserunt quis at quidem unde sint eos ad delectus,
    voluptate totam accusamus iste repellat, similique quas optio numquam
    amet earum dolores vero laboriosam reiciendis molestiae. Animi dolorem
    blanditiis fugiat fuga quis ad iusto ullam molestiae minus cupiditate
    beatae, obcaecati architecto odio sint quisquam officia dignissimos
    quasi veritatis, sapiente corrupti! Amet maxime enim ipsum! Optio
    rerum dignissimos corrupti, sequi non commodi, amet ea, necessitatibus
    natus tempore reprehenderit. Quisquam aliquam perferendis eum,
    incidunt, aspernatur alias repellendus sit, laudantium delectus
    quibusdam sunt reiciendis.`;
  const [showFullComment, setShowFullComment] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [comment, setComment] = useState("");

  const truncatedContent = showFullComment ? content : content.slice(0, 1000);
  const shouldDisplayEllipsis = content.length > 100 && !showFullComment;

  const onClickReport = () => {
    console.log("report");
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setComment("");
  };
  const handleLike = () => {
    console.log("like");
  };
  const handleDislike = () => {
    console.log("dislike");
  };

  return (
    <div
      className={`${styles["comment"]} ${
        isCommentReply ? `${styles["comment-reply"]}` : ""
      }`}
    >
      <div className={styles["comment__image"]}>
        <img src="/img/user-photo.png" alt="user" />
      </div>
      <div className={styles["comment__content"]}>
        <p className={styles["comment__info"]}>
          <span>
            <b>Author: </b>Yehor,{" "}
            <span className={styles["status"]}>Status: Author</span>
          </span>{" "}
          <span className={styles["date"]}>January 3, 2024 at 10:05 PM</span>
        </p>
        <div className={styles["comment__text"]}>
          {truncatedContent}
          {shouldDisplayEllipsis && "..."}
          {content.length > 300 && (
            <div className={styles["comment__btns"]}>
              {" "}
              <div className={styles["btn"]}>
                <p className={styles["rating"]}>
                  <span onClick={handleLike}>
                    <b>3</b>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
                      viewBox="0 0 512 512"
                    >
                      <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" />
                    </svg>
                  </span>
                  <span onClick={handleDislike}>
                    <b>10</b>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
                      viewBox="0 0 512 512"
                    >
                      <path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z" />
                    </svg>
                  </span>
                </p>
                <span onClick={() => setIsReply(true)}>Reply</span>{" "}
                <span onClick={onClickReport}>Report</span>
              </div>
              <span onClick={() => setShowFullComment(!showFullComment)}>
                {showFullComment ? "Close" : "Show full"}
              </span>
            </div>
          )}
        </div>
        {isReply && (
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder={`Write your reply... \nDo not write insults, otherwise you may be banned`}
              value={comment}
              onChange={handleInputChange}
              maxLength={10000}
            ></textarea>
            <br />
            <div className={styles["btn"]}>
              <button type="submit">Comment</button>
              <button onClick={() => setIsReply(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Comment;
