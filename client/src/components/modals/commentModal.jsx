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
  const [isLiked, setIsLiked] = useState();
  const [likes, setLikes] = useState();

  if(!user.commentsOpen) {
    return null;
  }

  const handleComment = (e) => {
    setCommentText(e.target.value);
  };

  const refreshLikes = () => {
    axios.get(`http://localhost:8080/getPost?userId=${user.selectedPost.data.authorId}&postId=${user.selectedPost.data.id}`).then(result => {
      const resData = JSON.parse(result.data.data);
      setIsLiked(resData.isLiked);
      setLikes(resData.likesCount);
    });
  }

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
              <Link to={`/profile/${user.selectedPost.data.identificator}`}
                onClick={() => {
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
            <p dangerouslySetInnerHTML={{__html: user.selectedPost.data.text}} style={{textAlign: "left"}} ></p>
            <img src={user.selectedPost.data.image} alt="ImagePost"
              style={{display: user.selectedPost.data.image ? "block" : "none"}}
            />
          </div>
          <div className="postBottom">
            <div className="likeContainer">
              <img
                src={isLiked === undefined ?
                  (user.selectedPost.data.isLiked ? "post/redlike.png" : "post/whitelike.png")
                    : (isLiked ? "post/redlike.png" : "post/whitelike.png")}
                alt="WhiteLike"
                onClick={async () => {
                  const liked = isLiked === undefined ? user.selectedPost.data.isLiked : isLiked;
                  
                  if (!liked) {
                    await axios.put(`http://localhost:8080/incLikesOnPost?userId=${user.id}&postId=${user.selectedPost.data.id}`).then(result => {
                      if (result.data.state === "Success") {
                        refreshLikes();
                        user.selectedPost.refreshLikes();
                      } else {
                        user.setErrorMessage(result.data.message);
                        user.toggleError();
                      }
                    });
                  } else {
                    await axios.put(`http://localhost:8080/decLikesOnPost?userId=${user.id}&postId=${user.selectedPost.data.id}`).then(result => {
                      if (result.data.state === "Success") {
                        refreshLikes();
                        user.selectedPost.refreshLikes();
                      } else {
                        user.setErrorMessage(result.data.message);
                        user.toggleError();
                      }
                    });
                  }
                }}
              />
              <p>
                {likes === undefined ? user.selectedPost.data.likesCount : likes}
              </p>
            </div>
            <button
              onClick={() => {
                setIsInsert(prev => !prev);
              }}
            >
              ????????????????????????????
            </button>
          </div>
          {!isInsert ? null :
            <div className="commentInsert">
              <textarea className="commentInput" name="comment"
                placeholder="?????????????? ??????????????????????"
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
                      user.setErrorMessage(result.data.message);
                      user.toggleError();
                    }
                  })
                }}
              >
                ??????????????????
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
