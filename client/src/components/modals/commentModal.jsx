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
      onClick={() => {
        setIsInsert(false);
        setCommentText("");
        user.toggleComments();
      }}
    >
      <div className="modalContainer commentsModalContainer"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="postContent" style={{margin: "0 auto"}}>
          <div className="postInfo">
            <div className="postUserInfo">
              <Link to={`/profile/${user.selectedPost.identificator}`}
                onClick={() => {
                  user.toggleComments();
                }}
              >
                <img src={user.selectedPost.authorImage} alt="AvatarCircle" />
              </Link>
              <div style={{marginTop: "0.15vw", textAlign: "center"}}>
                <p style={{fontSize: '1.2em'}}>{user.selectedPost.name}</p>
                <p>@{user.selectedPost.identificator}</p>
              </div>
            </div>
            <div className="postDate">
              <p>{getDateFormat(user.selectedPost.time)}</p>
              <p>{user.selectedPost.category}</p>
            </div>
          </div>
          <div className="postMainContent">
            <p dangerouslySetInnerHTML={{__html: user.selectedPost.text}} style={{textAlign: "left"}} ></p>
            <img src={user.selectedPost.image} alt="ImagePost"
              style={{display: user.selectedPost.image ? "block" : "none"}}
            />
          </div>
          <div className="postBottom">
            <div className="likeContainer">
              <img
                src={user.selectedPost.isLiked ? "post/redlike.png" : "post/whitelike.png"}
                alt="WhiteLike"
                onClick={async () => {
                  if (!user.selectedPost.isLiked) {
                    await user.selectedPost.increaseLikes();
                    user.setSelectedPost(prev => {
                        return {
                          ...prev,
                          likesCount: prev.likesCount + 1,
                          isLiked: true
                        }
                      }
                    );
                  } else {
                    await user.selectedPost.decreaseLikes();
                    user.setSelectedPost(prev => {
                        return {
                          ...prev,
                          likesCount: prev.likesCount - 1,
                          isLiked: false
                        }
                      }
                    );
                  }
                }}
              />
              <p>
                {user.selectedPost.likesCount}
              </p>
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
                    postId: user.selectedPost.id,
                    commentText: commentText
                  }).then(result => {
                    if (result.data.state === "Success") {
                      setCommentText("");
                      setIsInsert(false);
                    } else {
                      user.setErrorMessage(result.data.message);
                      user.toggleError();
                    }
                  })
                }}
              >
                Отправить
              </button>
            </div>
          }
          <CommentsList postId={user.selectedPost.id} />
        </div>
      </div>
    </div>
  );
};

export default CommentModal
