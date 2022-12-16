import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../utilities/userContext";
import "../../styles/modals/modal.css";
import "../../styles/modals/editUser.css";

const EditUserModal = () => {
  const user = useUser();
  const [profileData, setProfileData] = useState();
  const [name, setName] = useState();
  const [identifier, setIdentifier] = useState();
  const [infoText, setInfoText] = useState();
  const [avatar, setAvatar] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    axios.get(`http://localhost:8080/getProfile?userId=${user.id}`).then(result => {
      let data = JSON.parse(result.data.data);
      setName(data.name);
      setIdentifier(data.identificator);
      setAvatar(data.imagePath);
      setInfoText(data.info)
      setProfileData(data);
    });
  }, [user.editUserOpen]);
  

  if(!user.editUserOpen) {
    return null;
  }

  if (profileData === undefined) {
    return <></>
  }

  const handleName = (e) => {
    const value = e.target.value.replace(/[^a-zа-я0-9]/gi, '');
    setName(value);
    setDisabled(value, identifier, infoText);
  };

  const handleIdentifier = (e) => {
    const value = e.target.value.replace(/[^a-z0-9]/gi, '');
    setIdentifier(value);
    setDisabled(name, value, infoText);
  };

  const handleInfo = (e) => {
    setInfoText(e.target.value);
    setDisabled(name, identifier, e.target.value);
  };

  const clearData = () => {
    setName(null);
    setIdentifier(null);
    setProfileData(null);
    setSelectedImage(null);
    setIsDisabled(true);
  }

  const setDisabled = (name, identifier, info) => {
    if ((profileData.name === name) && (profileData.identificator === identifier)
        && (profileData.info === info) && (selectedImage === null)) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }

  return (
    <div className='overlay'>
      <div className='modalContainer' style={{padding: "2vw", height: "auto"}}>
        <div className="editUser">
          <div className="editUserAvatar">
            <img src={selectedImage !== null ? URL.createObjectURL(selectedImage) : avatar} alt="Avatar" />
            <label className="newAvatarBtn" htmlFor="#loadUserAvatar">Загрузить</label>
            <input id="#loadUserAvatar" type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={(event) => {
                setSelectedImage(event.target.files[0]);
                setIsDisabled(false);
              }}
              style={{display: "none"}}
            />
          </div>
          <div className="editUserInformation">
            <img src="profile/editprofile.png" alt="EditProfile" />
            <input type="text" 
              value={name}
              onChange={handleName}
              maxLength={30}
            />
            <input type="text" 
              value={identifier}
              onChange={handleIdentifier}
              maxLength={30}
            />
            <button className="checkId">Проверить идентификатор</button>
          </div>
        </div>
        <textarea name="" id="" className="editDescription"
          placeholder="Расскажите о себе"
          maxLength="1000"
          value={infoText}
          onChange={handleInfo}
        ></textarea>
        <div className="confirmUserChanges">
          <button
            onClick={() => {
              clearData();
              user.toggleInfoEditing();
            }}
          >
            Отменить
          </button>
          <button
            disabled={isDisabled}
            onClick={async () => {
              let image;
              if (selectedImage !== null) {
                const reader = new FileReader();
                
                reader.readAsDataURL(selectedImage);
                reader.onloadend = async () => {
                  image = reader.result.replace('data:', '').replace(/^.+,/, '');
                  await changeProfile(user.id, identifier, name, infoText, image).then(result => {
                    if (result.data.state === "Error") {
                      console.log(result.data.message)
                    } else {
                      clearData();
                      user.reloadUser();
                      user.toggleInfoEditing();
                    }
                  });
                };
              } else {
                image = profileData.imagePath;
                await changeProfile(user.id, identifier, name, infoText, image).then(result => {
                  if (result.data.state === "Error") {
                    console.log(result.data.message)
                  } else {
                    clearData();
                    user.reloadUser();
                    user.toggleInfoEditing();
                  }
                });
              }
            }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

async function changeProfile(id, identifier, name, info, img) {
  return await axios.put("http://localhost:8080/changeProfile", {
    id: id,
    identificator: identifier,
    name: name,
    info: info,
    imagePath: `${img}`
  }).then(result => {
    return result
  });
}

export default EditUserModal
