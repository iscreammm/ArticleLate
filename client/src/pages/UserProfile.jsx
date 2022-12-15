import { useEffect, useState} from "react";
import axios from "axios";
import PostsList from "../components/PostsList";
import { useUser } from "../components/utilities/userContext";
import "../styles/profile.css"

const UserProfile = () => {
  const user = useUser();
  const [profileData, setProfileData] = useState();

  useEffect(() => {
    axios.get(`http://localhost:8080/getProfile?userId=${user.id}`).then(result => {
      console.log(JSON.parse(result.data.data))
      setProfileData(JSON.parse(result.data.data));
    });
  }, []);
  
  if (profileData === undefined) {
    return <></>
  }

  return (
    <div className="pageContainer profile">
      <div className="profileInfo">
        <div className="infoColumn">
          <div className="infoText">
            <p>{profileData.name}</p>
            <p>@{profileData.identificator}</p>
          </div>
        </div>
        <div className="infoColumn">
          <img className="userAvatar" src={`${profileData.imagePath}`} alt="Avatar2" />
          <img className="profileInfoButton" src="profile/change.png" alt="Change"
            onClick={() => {
              user.toggleInfoEditing();
            }}
          />
        </div>
        <div className="infoColumn">
          <div className="infoText">
            <p>Подписки: {profileData.followers}</p>
           <p>Подписчики: {profileData.follows}</p>
          </div>
        </div>
      </div>
      <p className="about" style={{textAlign: profileData.info === "" ? "center" : ""}}>
        {profileData.info === "" ? "Информация не указана" : profileData.info}
      </p>
      <div style={{textAlign: "center"}}>
        <img className="createPostButton" src="profile/createpost.png" alt="CreatePost" 
          onClick={() => {
            user.toggleCreatePost();
          }}
        />
      </div>
      <div style={{background: "#F0ADAD"}}>
        <PostsList />
      </div>
    </div>
  );
}

export default UserProfile
