import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../components/utilities/userContext";
import PostsList from "../components/PostsList";
import "../styles/profile.css";

const Profile = () => {
  const user = useUser();
  const [profileId, setProfileId] = useState();
  const [profileData, setProfileData] = useState();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8080/getIdByIdentificator?identificator=${user.selectedUser}`).then(result => {
      setProfileId(result.data.data);
      axios.get(`http://localhost:8080/getProfile?userId=${result.data.data}`).then(res => {
        setProfileData(JSON.parse(res.data.data));
      });
      axios.get(`http://localhost:8080/getIsSubscribe?followerId=${user.id}&userId=${result.data.data}`).then(res => {
        if (res.data.data) {
          setIsSubscribed(true);
        }
      });
    });
  }, [])

  useEffect(() => {
    axios.get(`http://localhost:8080/getProfile?userId=${profileId}`).then(res => {
      setProfileData(JSON.parse(res.data.data));
    });
  }, [isSubscribed])
  
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
          <img className="profileInfoButton"
            src={isSubscribed ? "profile/unsubscribe.png" : "profile/subscribe.png"}
            alt="Change"
            onClick={() => {
              if (isSubscribed) {
                axios.delete("http://localhost:8080/unfollowUser", {
                  data: {
                    followerId: user.id,
                    userId: profileId
                  }
                }).then(result => {
                  if (result.data.state === "Success") {
                    setIsSubscribed(false);
                  } else {
                    console.log(result.data.message)
                  }
                });
              } else {
                axios.post("http://localhost:8080/followUser", {
                  followerId: user.id,
                  userId: profileId
                }).then(result => {
                  if (result.data.state === "Success") {
                    setIsSubscribed(true);
                  } else {
                    console.log(result.data.message)
                  }
                });
              }
            }}
          />
        </div>
        <div className="infoColumn">
          <div className="infoText">
            <p>Подписки: {profileData.follows}</p>
           <p>Подписчики: {profileData.followers}</p>
          </div>
        </div>
      </div>
      <p className="about" style={{textAlign: profileData.info === "" ? "center" : ""}}>
        {profileData.info === "" ? "Информация не указана" : profileData.info}
      </p>
      <div style={{background: "#F0ADAD"}}>
      <PostsList queryString={`http://localhost:8080/getUserPosts?userId=${profileId}`} />
      </div>
    </div>
  );
}

export default Profile
