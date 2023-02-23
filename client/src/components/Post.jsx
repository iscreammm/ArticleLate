import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { useUser } from "./utilities/userContext";
import { getDateFormat } from "../js/functions";
import "../styles/feedPosts.css";

const Post = ({ data, toggleEditPost }) => {
  const user = useUser();
  const [authorAvatar, setAuthorAvatar] = useState("profilePictures/avatar.jpg");
  const [category, setCategory] = useState(data.category);
  const [text, setText] = useState(data.text);
  const [image, setImage] = useState(data.image);
  const [isLiked, setIsLiked] = useState(data.isLiked);
  const [likes, setLikes] = useState(data.likesCount);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8080/getProfile?userId=${data.authorId}`).then(result => {
      const resData = JSON.parse(result.data.data);
      setAuthorAvatar(resData.imagePath);
      console.log(isLiked)
    });
  }, []);

  useEffect(() => {
    if (user.postToRefresh === data.id) {
      axios.get(`http://localhost:8080/getPost?userId=${data.authorId}&postId=${data.id}`).then(result => {
        const resData = JSON.parse(result.data.data);
        setCategory(resData.category);
        setText(resData.text);
        setImage(resData.image);
        data.category = resData.category;
        data.text = resData.text;
        data.image = resData.image;
      });
    }
  }, [user.postToRefresh]);

  if (deleted) {
    return <></>
  }

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
          <div className="postUserInfo" style={{width: data.authorId !== user.id ? "100%" : "67%"}}>
            <Link to={`/profile/${data.identificator}`}>
              <img src={authorAvatar} alt="AvatarCircle" />
            </Link>
            <div style={{marginTop: "0.15vw", textAlign: "center"}}>
              <p style={{fontSize: '1.2em'}}>{data.name}</p>
              <p>@{data.identificator}</p>
            </div>
          </div>
          {data.authorId !== user.id ? <></> :
            <div className="postButtons">
              <button onClick={() => {
                user.setEditPost(data);
                toggleEditPost();
              }}>
                <img src="common/edit.jpg" alt="Modify" />
              </button>
              <button onClick={() => {
                  axios.delete(`http://localhost:8080/deletePost?postId=${data.id}`).then(result => {
                    if (result.data.state === "Success") {
                      setDeleted(true);
                    } else {
                      user.setErrorMessage(result.data.message);
                      user.toggleError();
                    }
                  });
                }}
              >
                <img src="common/delete.jpg" alt="Delete" />
              </button>
            </div>  
          }
          <div className="postDate">
            <p>{getDateFormat(data.time)}</p>
            <p><b>{category}</b></p>
          </div>
        </div>
        <div className="postMainContent">
          <p dangerouslySetInnerHTML={{__html: text}}></p>
          <img src={image} alt="ImagePost"
            style={{display: image === "" ? "none" : "block"}}
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
                      user.setErrorMessage(result.data.message);
                      user.toggleError();
                    }
                  });
                } else {
                  await axios.put(`http://localhost:8080/decLikesOnPost?userId=${user.id}&postId=${data.id}`).then(result => {
                    if (result.data.state === "Success") {
                      refreshLikes();
                    } else {
                      user.setErrorMessage(result.data.message);
                      user.toggleError();
                    }
                  });
                }
              }}
            />
            <p>{likes}</p>
          </div>
          <button
            onClick={() => {
              user.setSelectedPost({data, authorAvatar, refreshLikes});
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
