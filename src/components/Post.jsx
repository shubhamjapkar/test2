import { Avatar, Button, TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { useEffect, useState } from "react";
import "../../src/post.css";
import { db } from "../firebase.config";
import firebase from "firebase";

const Post = ({ imageUrl, username, caption, postId, user }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment("");
  };

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  return (
    <div className="post__container">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="../src/images/user-icon.png"
        />
        <h3>{username}</h3>
      </div>

      <img className="post__image" src={imageUrl} alt="" />
      <h4 className="post__text">
        <span>{username}:</span> {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => {
          return (
            <p>
              <strong>{comment.username}:</strong> {comment.text}
            </p>
          );
        })}
      </div>

      {user && (
        <form className="post__form">
          <input
            type="text"
            placeholder="Add a comment..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className="post__input"
          />
          <button
            disabled={!comment}
            onClick={postComment}
            type="submit"
            className="post__comment-button"
          >
            post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
