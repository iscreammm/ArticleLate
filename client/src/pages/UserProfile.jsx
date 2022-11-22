import PostsList from "../components/PostsList";
import "../styles/profile.css"

const UserProfile = () => {
  return (
    <div className="pageContainer profile">
      <div className="profileInfo">
        <div className="infoColumn">
          <div className="infoText">
            <p>Аноним</p>
            <p>@anonim123</p>
          </div>
        </div>
        <div className="infoColumn">
          <img className="userAvatar" src="layout/avatar.png" alt="Avatar2" />
          <img className="profileInfoButton" src="profile/change.png" alt="Change" />
        </div>
        <div className="infoColumn">
          <div className="infoText">
            <p>Подписки: 0</p>
           <p>Подписчики: 0</p>
          </div>
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
