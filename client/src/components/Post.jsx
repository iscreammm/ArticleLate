import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { useUser } from "./utilities/userContext";
import { getDateFormat } from "../js/functions";
import "../styles/feedPosts.css";

const Post = ({ data }) => {
  const user = useUser();
  const [authorAvatar, setAuthorAvatar] = useState("profilePictures/avatar.jpg");
  const [author, setAuthor] = useState();
  const [isLiked, setIsLiked] = useState(data.isLiked);
  const [likes, setLikes] = useState(data.likesCount);

  useEffect(() => {
    axios.get(`http://localhost:8080/getProfile?userId=${data.authorId}`).then(result => {
      const resData = JSON.parse(result.data.data);
      setAuthorAvatar(resData.imagePath);
      setAuthor(resData.identificator);
    });
  }, []);

  const refreshLikes = () => {
    axios.get(`http://localhost:8080/getPost?userId=${data.authorId}&postId=${data.id}`).then(result => {
      const resData = JSON.parse(result.data.data);
      setIsLiked(resData.isLiked);
      setLikes(resData.likesCount);
      data.isLiked = resData.isLiked;
      data.likesCount = resData.likesCount;
    });
  }

  return (
    <>
      <div className="postContent">
        <div className="postInfo">
          <div className="postUserInfo">
            <Link to={data.authorId === user.id ? "/userProfile" : "/profile"}
              onClick={() => {
                user.setSelectedUser(author);
              }}
            >
              <img src={authorAvatar} alt="AvatarCircle" />
            </Link>
            <div style={{marginTop: "0.15vw", textAlign: "center"}}>
              <p style={{fontSize: '1.2em'}}>{data.name}</p>
              <p>@{data.identificator}</p>
            </div>
          </div>
          <div className="postDate">
            <p>{getDateFormat(data.time)}</p>
            <p>{data.category}</p>
          </div>
        </div>
        <div className="postMainContent">
          <p dangerouslySetInnerHTML={{__html: data.text}}></p>
          <img src={data.image} alt="ImagePost"
            style={{display: data.image === "" ? "none" : "block"}}
          />
        </div>
        <div className="postBottom">
          <div className="likeContainer">
            <img src={isLiked ? "post/redlike.png" : "post/whitelike.png"} alt="WhiteLike"
              onClick={async () => {
                if (!isLiked) {
                  await axios.put(`http://localhost:8080/incLikesOnPost?userId=${user.id}&postId=${data.id}`).then(result => {
                    if (result.data.state === "Success") {
                      refreshLikes();
                    } else {
                      console.log(result.data.message)
                    }
                  });
                } else {
                  await axios.put(`http://localhost:8080/decLikesOnPost?userId=${user.id}&postId=${data.id}`).then(result => {
                    if (result.data.state === "Success") {
                      refreshLikes();
                    } else {
                      console.log(result.data.message)
                    }
                  });
                }
              }}
            />
            <p>{likes}</p>
          </div>
          <button
            onClick={() => {
              user.setSelectedPost({data, author, authorAvatar, refreshLikes});
              user.toggleComments();
            }}
          >
            Комментировать
          </button>
        </div>
      </div>
    </>
  );
}

export default Post
