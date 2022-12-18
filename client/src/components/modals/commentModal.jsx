import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../utilities/userContext";
import CommentsList from "../CommentsList";
import { getDateFormat } from "../../js/functions";
import "../../styles/modals/modal.css";
import "../../styles/modals/comments.css";

const CommentModal = () => {
  const user = useUser();
  const [isInsert, setIsInsert] = useState(false);
  const [commentText, setCommentText] = useState("");

  if(!user.commentsOpen) {
    return null;
  }

  const handleComment = (e) => {
    setCommentText(e.target.value);
  };

  return (
    <div className="overlay"
      onClick={user.toggleComments}
    >
      <div className="modalContainer commentsModalContainer"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="postContent">
          <div className="postInfo">
            <div className="postUserInfo">
              <Link to={user.selectedPost.data.authorId === user.id ? "/userProfile" : "/profile"}
                onClick={() => {
                  user.setSelectedUser(user.selectedPost.author);
                  user.toggleComments();
                }}
              >
                <img src={user.selectedPost.authorAvatar} alt="AvatarCircle" />
              </Link>
              <div style={{marginTop: "0.15vw", textAlign: "center"}}>
                <p style={{fontSize: '1.2em'}}>{user.selectedPost.data.name}</p>
                <p>@{user.selectedPost.data.identificator}</p>
              </div>
            </div>
            <div className="postDate">
              <p>{getDateFormat(user.selectedPost.data.time)}</p>
              <p>{user.selectedPost.data.category}</p>
            </div>
          </div>
          <div className="postMainContent">
            <p dangerouslySetInnerHTML={{__html: user.selectedPost.data.text}}></p>
            <img src={user.selectedPost.data.image} alt="ImagePost" />
          </div>
          <div className="postBottom">
            <div className="likeContainer">
              <img src="post/whitelike.png" alt="WhiteLike" />
              <p>0</p>
            </div>
            <button
              onClick={() => {
                setIsInsert(prev => !prev);
              }}
            >
              Комментировать
            </button>
          </div>
          {!isInsert ? null :
            <div className="commentInsert">
              <textarea className="commentInput" name="comment"
                placeholder="Введите комментарий"
                maxLength={3000}
                value={commentText}
                onChange={handleComment}
              >
              </textarea>
              <button className="submitComment"
                disabled={commentText === "" ? true : false}
                onClick={() => {
                  axios.post("http://localhost:8080/addComment", {
                    userId: user.id,
                    postId: user.selectedPost.data.id,
                    commentText: commentText
                  }).then(result => {
                    if (result.data.state === "Success") {
                      setCommentText("");
                      setIsInsert(false);
                    } else {
                      console.log(result.data.message)
                    }
                  })
                }}
              >
                Отправить
              </button>
            </div>
          }
          <CommentsList postId={user.selectedPost.data.id} />
        </div>
      </div>
    </div>
  );
};

export default CommentModal
