import "../styles/feedPosts.css";
import { useUser } from "./utilities/userContext";

const Post = () => {
  const user = useUser();

  return (
    <>
      <div className="postContent">
        <div className="postInfo">
          <div className="postUserInfo">
            <img src="post/avatarcircle.png" alt="AvatarCircle" />
            <div style={{marginTop: "0.15vw", textAlign: "center"}}>
              <p style={{fontSize: '1.2em'}}>Аниматор</p>
              <p>@animator2048</p>
            </div>
          </div>
          <div className="postDate">
            <p>19.11.2022 17:11</p>
            <p>Игры</p>
          </div>
        </div>
        <div className="postMainContent">
          hgjkl;''
          <img src="post/imagepost.png" alt="ImagePost" />
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
