import React, { ChangeEvent, FormEvent, useState } from "react";
import styles from "./Comment.module.scss";
import { IComment, TReply } from "../../types";
import { formatDate } from "../../utils/formatDate";
import axios from "axios";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchComments } from "../../redux/comment/slice";
import { useParams } from "react-router-dom";

type TProps = {
  isCommentReply?: boolean;
  comment: IComment | TReply;
  parentComment?: string;
};
const Comment: React.FC<TProps> = ({
  isCommentReply = false,
  comment,
  parentComment,
}) => {
  const dispatch = useAppDispatch();

  const { userData } = useSelector((state: RootState) => state.user);

  const [showFullComment, setShowFullComment] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [updatedText, setUpdatedText] = useState(comment.content);
  const { id } = useParams();

  const truncatedContent = showFullComment
    ? comment.content
    : comment.content.slice(0, 1000);
  const shouldDisplayEllipsis =
    comment.content.length > 100 && !showFullComment;

  const newDate = new Date(comment.updatedAt);
  const formattedDate = formatDate(newDate);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  };

  const handleEditChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedText(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!userData) {
      toast.info("You need to be logged in to do this");
      return;
    }

    if (commentText.length <= 5) {
      toast.info("Your comment must be at least 5 symbols");
      return;
    }

    const targetComment = isCommentReply ? parentComment : comment._id;

    try {
      await axios.post(
        `/api/reply/${targetComment}`,
        { content: commentText },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      toast.success("Reply added");
      id && dispatch(fetchComments({ id }));
    } catch (error: any) {
      toast.error(
        `"Error adding reply:" ${error.response?.data.message || error.message}`
      );
    }

    setCommentText("");
  };

  const handleEdit = async (event: FormEvent) => {
    event.preventDefault();

    if (!userData) {
      toast.info("You need to be logged in to do this");
      return;
    }

    if (updatedText.length <= 5) {
      toast.info("Your comment must be at least 5 symbols");
      return;
    }

    const endpoint = isCommentReply
      ? `/api/reply/${comment._id}`
      : `/api/comments/${comment._id}`;

    try {
      await axios.put(
        endpoint,
        { content: updatedText },
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      const successMessage = isCommentReply ? "Reply" : "Comment";
      toast.success(`${successMessage} updated`);
      id && dispatch(fetchComments({ id }));
    } catch (error: any) {
      const errorMessage = isCommentReply
        ? "Error updating reply"
        : "Error updating comment";
      toast.error(
        `"${errorMessage}": ${error.response?.data.message || error.message}`
      );
    }

    setCommentText("");
  };

  const handleDelete = async () => {
    if (userData) {
      const confirmMessage = isCommentReply
        ? "Do you really want to delete reply?"
        : "Do you really want to delete comment?";

      if (window.confirm(confirmMessage)) {
        const endpoint = isCommentReply
          ? `/api/reply/${comment._id}`
          : `/api/comments/${comment._id}`;

        try {
          await axios.delete(endpoint, {
            headers: {
              Authorization: `Bearer ${userData?.token}`,
            },
          });

          const successMessage = isCommentReply ? "Reply" : "Comment";
          toast.success(`${successMessage} deleted`);
          id && dispatch(fetchComments({ id }));
        } catch (error: any) {
          const errorMessage = isCommentReply
            ? "Error deleting reply"
            : "Error deleting comment";
          toast.error(
            `"${errorMessage}": ${
              error.response?.data.message || error.message
            }`
          );
        }
      }
    } else {
      toast.info("You need to be logged in to do this");
    }
  };

  const handleLike = async () => {
    if (userData) {
      if (isCommentReply) {
        if (!comment.likedBy.some((id) => id === userData?._id)) {
          try {
            await axios.post(
              `/api/reply/like/${comment._id}`,
              { userId: userData._id },
              {
                headers: {
                  Authorization: `Bearer ${userData?.token}`,
                },
              }
            );
            id && dispatch(fetchComments({ id }));
            toast.success(`You liked this reply`);
          } catch (err: any) {
            toast.error(err.response?.data.message || "An error occurred");
          }
        } else {
          toast.info("You liked this reply before");
        }
      } else {
        if (!comment.likedBy.some((id) => id === userData?._id)) {
          try {
            await axios.post(
              `/api/comments/like/${comment._id}`,
              { userId: userData._id },
              {
                headers: {
                  Authorization: `Bearer ${userData?.token}`,
                },
              }
            );
            id && dispatch(fetchComments({ id }));
            toast.success(`You liked this comment`);
          } catch (err: any) {
            toast.error(err.response?.data.message || "An error occurred");
          }
        } else {
          toast.info("You liked this comment before");
        }
      }
    } else {
      toast.info("You need to be logged in to do this");
    }
  };

  const handleDislike = async () => {
    if (userData) {
      if (isCommentReply) {
        if (!comment.dislikedBy.some((id) => id === userData?._id)) {
          try {
            await axios.post(
              `/api/reply/dislike/${comment._id}`,
              { userId: userData._id },
              {
                headers: {
                  Authorization: `Bearer ${userData?.token}`,
                },
              }
            );
            id && dispatch(fetchComments({ id }));
            toast.success(`You disliked this reply`);
          } catch (err: any) {
            toast.error(err.response?.data.message || "An error occurred");
          }
        } else {
          toast.info("You disliked this reply before");
        }
      } else {
        if (!comment.dislikedBy.some((id) => id === userData?._id)) {
          try {
            await axios.post(
              `/api/comments/dislike/${comment._id}`,
              { userId: userData._id },
              {
                headers: {
                  Authorization: `Bearer ${userData?.token}`,
                },
              }
            );
            id && dispatch(fetchComments({ id }));
            toast.success(`You disliked this comment`);
          } catch (err: any) {
            toast.error(err.response?.data.message || "An error occurred");
          }
        } else {
          toast.info("You disliked this comment before");
        }
      }
    } else {
      toast.info("You need to be logged in to do this");
    }
  };

  const handleReport = async () => {
    if (userData) {
      if (isCommentReply) {
        if (!comment.reportedBy.some((id) => id === userData?._id)) {
          try {
            await axios.post(
              `/api/reply/report/${comment._id}`,
              { userId: userData._id },
              {
                headers: {
                  Authorization: `Bearer ${userData?.token}`,
                },
              }
            );
            id && dispatch(fetchComments({ id }));
            toast.success(`You reported this reply`);
          } catch (err: any) {
            toast.error(err.response?.data.message || "An error occurred");
          }
        } else {
          toast.info("You reported this reply before");
        }
      } else {
        if (!comment.reportedBy.some((id) => id === userData?._id)) {
          try {
            await axios.post(
              `/api/comments/report/${comment._id}`,
              { userId: userData._id },
              {
                headers: {
                  Authorization: `Bearer ${userData?.token}`,
                },
              }
            );
            id && dispatch(fetchComments({ id }));
            toast.success(`You reported this comment`);
          } catch (err: any) {
            toast.error(err.response?.data.message || "An error occurred");
          }
        } else {
          toast.info("You reported this comment before");
        }
      }
    } else {
      toast.info("You need to be logged in to do this");
    }
  };
  return (
    <div
      className={`${styles["comment"]} ${
        isCommentReply ? `${styles["comment-reply"]}` : ""
      }`}
    >
      <div className={styles["comment__image"]}>
        <img
          src={`${comment.author.image || "/img/user-photo.png"}`}
          alt="user"
        />
      </div>
      <div className={styles["comment__content"]}>
        <p className={styles["comment__info"]}>
          <span>
            <b>{comment.author.name}</b>
            <span className={styles["status"]}>
              Status:{" "}
              {comment.author.isAuthor
                ? comment.author.isAdmin
                  ? "Admin"
                  : "Author"
                : "User"}
            </span>
          </span>{" "}
          <span className={styles["date"]}>{formattedDate}</span>
        </p>
        <div className={styles["comment__text"]}>
          {truncatedContent}
          {shouldDisplayEllipsis && "..."}

          <div className={styles["comment__btns"]}>
            {" "}
            <div className={styles["btn"]}>
              <p className={styles["rating"]}>
                <span onClick={handleLike}>
                  <b>{comment.likedBy.length}</b>{" "}
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
                  <b>{comment.dislikedBy.length}</b>
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
              <span onClick={handleReport}>Report</span>
            </div>
            <div className={styles["btn_right"]}>
              {comment.content.length > 300 && (
                <span onClick={() => setShowFullComment(!showFullComment)}>
                  {showFullComment ? "Close" : "Show full"}
                </span>
              )}
              {comment.author._id === userData?._id && (
                <div className={styles["functional"]}>
                  <span
                    style={{ marginLeft: "1rem" }}
                    onClick={() => setIsEdit(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
                      viewBox="0 0 512 512"
                    >
                      <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                    </svg>
                    Edit
                  </span>
                  <span className={styles["trash"]} onClick={handleDelete}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="14"
                      viewBox="0 0 448 512"
                    >
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {isReply && (
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder={`Write your reply... \nDo not write insults, otherwise you may be banned`}
              value={commentText}
              onChange={handleInputChange}
              maxLength={10000}
              required
            ></textarea>
            <br />
            <div className={styles["btn"]}>
              <button type="submit">Reply</button>
              <button onClick={() => setIsReply(false)}>Cancel</button>
            </div>
          </form>
        )}
        {isEdit && (
          <form onSubmit={handleEdit}>
            <textarea
              placeholder={"Edit your message"}
              value={updatedText}
              onChange={handleEditChange}
              maxLength={10000}
              required
            ></textarea>
            <br />
            <div className={styles["btn"]}>
              <button type="submit">Edit</button>
              <button onClick={() => setIsEdit(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Comment;
