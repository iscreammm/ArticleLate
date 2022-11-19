import PostsList from "../components/PostsList";
import "../styles/profile.css"

const UserProfile = () => {
  return (
    <div className="pageContainer profile">
      <div className="profileInfo">
        <div className="infoColumn">
          <p className="infoText">Аноним</p>
          <p className="infoText">@anonim123</p>
        </div>
        <div className="infoColumn">
          <img className="userAvatar" src="layout/avatar.png" alt="Avatar2" />
          <img className="profileInfoButton" src="profile/change.png" alt="Change" />
        </div>
        <div className="infoColumn">
          <p className="infoText">Подписки: 0</p>
          <p className="infoText">Подписчики: 0</p>
        </div>
      </div>
      <p className="about">Анонимный пользователь сайта, который сидит тут и не знает, что написать о себе.</p>
      <div style={{textAlign: "center"}}>
        <img className="createPostButton" src="profile/createpost.png" alt="CreatePost" />
      </div>
      <div style={{background: "#F0ADAD"}}>
        <PostsList />
      </div>
    </div>
  );
}

export default UserProfile
