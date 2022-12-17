import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "./utilities/userContext";
import "../styles/feedPosts.css";

const Post = ({ data }) => {
  const user = useUser();
  const [authorAvatar, setAuthorAvatar] = useState("profilePictures/avatar.jpg");

  useEffect(() => {
    axios.get(`http://localhost:8080/getProfile?userId=${data.authorId}`).then(result => {
      setAuthorAvatar(JSON.parse(result.data.data).imagePath);
    });
  }, []);
  

  const getDateFormat = () => {
    let time = new Date(data.time);

    return (time.getDay() + "." + time.getMonth() + "." + time.getFullYear() + " "
      + time.getHours() + ":" + time.getMinutes());
  }

  return (
    <>
      <div className="postContent">
        <div className="postInfo">
          <div className="postUserInfo">
            <img src={authorAvatar} alt="AvatarCircle" />
            <div style={{marginTop: "0.15vw", textAlign: "center"}}>
              <p style={{fontSize: '1.2em'}}>{data.name}</p>
              <p>@{data.identificator}</p>
            </div>
          </div>
          <div className="postDate">
            <p>{getDateFormat()}</p>
            <p>{data.category}</p>
          </div>
        </div>
        <div className="postMainContent">
          <p dangerouslySetInnerHTML={{__html: data.text}}></p>
          <img src={data.image} alt="ImagePost" />
        </div>
        <div className="postBottom">
          <div className="likeContainer">
            <img src="post/whitelike.png" alt="WhiteLike" />
            <p>0</p>
          </div>
          <button
            onClick={() => {
              user.toggleComments();
            }}
          >Комментировать</button>
        </div>
      </div>
    </>
  );
}

export default Post
