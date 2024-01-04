import React, { ChangeEvent, FormEvent, useState } from "react";
import styles from "./WriteComment.module.scss";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import { fetchComments } from "../../redux/comment/slice";

const WriteComment: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const { userData } = useSelector((state: RootState) => state.user);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const onAddComment = async () => {
    if (userData) {
      const articleId = id;
      if (comment.length <= 5) {
        toast.info("Your comment must be at least 5 symbols");
      } else {
        try {
          await axios.post(
            `/api/comments/${articleId}`,
            {
              content: comment,
            },
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          );
          id && dispatch(fetchComments({ id }));
          toast.success("Comment created");
        } catch (error) {
          toast.error(`Error adding comment: ${error}`);
        }
      }
    } else {
      toast.info("You need to be logged in, to do this");
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onAddComment();
    setComment("");
  };
  return (
    <div className={styles["comment__wrapper"]}>
      <h3>Write comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder={`Write your comment... \nDo not write insults, otherwise you may be banned`}
          value={comment}
          onChange={handleInputChange}
          maxLength={10000}
          required
        ></textarea>
        <br />
        <button type="submit" className={styles["comment__btn"]}>
          Comment
        </button>
      </form>
    </div>
  );
};

export default WriteComment;
