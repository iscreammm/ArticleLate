import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../utilities/userContext";
import "../../styles/modals/modal.css";
import "../../styles/modals/editUser.css";

const EditUserModal = ({ isOpen, toggle }) => {
  const user = useUser();
  const [profileData, setProfileData] = useState();
  const [name, setName] = useState();
  const [identifier, setIdentifier] = useState();
  const [infoText, setInfoText] = useState();
  const [avatar, setAvatar] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState();
  
  useEffect(() => {
    axios.get(`http://localhost:8080/getProfile?userId=${user.id}`).then(result => {
      let data = JSON.parse(result.data.data);
      setName(data.name);
      setIdentifier(data.identificator);
      setAvatar(data.imagePath);
      setInfoText(data.info)
      setProfileData(data);
    });
  }, [isOpen]);

  if(!isOpen) {
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
                  let reader = new FileReader();
                  reader.readAsDataURL(event.target.files[0]);
                  reader.onload = function (e) {
                    var image = new Image();
                    image.src = e.target.result;

                    image.onload = function () {
                      if (event.target.files[0].size > (1024 * 1024 * 5)) {
                        user.setErrorMessage("Размер файла слишком большой");
                        user.toggleError();
                      } else if ((this.width !== this.height) || (this.width < 400) || (this.width > 1024)) {
                        user.setErrorMessage("Изображение должно быть квадратным и быть меньше 1024x1024 и больше 400x400");
                        user.toggleError();
                      } else {
                        setSelectedImage(event.target.files[0]);
                        setIsDisabled(false);
                      }
                    };
                  };
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
            <button className="checkId" onClick={() => {
              if (identifier.slice(0, 4) === "user") {
                user.setErrorMessage("Идентификатор не может начинаться с user");
                user.toggleError();
              }
              axios.get(`http://localhost:8080/verifyIdentificator?identificator=${identifier}&userId=${user.id}`).then(result => {
                if (result.data.state === "Error") {
                  user.setErrorMessage(result.data.message);
                  user.toggleError()
                } else {
                  if (result.data.data) {
                    setMessage("Идентификатор свободен");
                  } else {
                    setMessage("Идентификатор занят");
                  }
                }
              });
            }}>Проверить идентификатор</button>
            <p style={{display: message ? "block" : "none"}}>{message}</p>
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
              toggle();
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
                      user.setErrorMessage(result.data.message);
                      user.toggleError();
                    } else {
                      clearData();
                      user.reloadUser();
                      toggle();
                    }
                  });
                };
              } else {
                image = profileData.imagePath;
                await changeProfile(user.id, identifier, name, infoText, image).then(result => {
                  if (result.data.state === "Error") {
                    user.setErrorMessage(result.data.message);
                    user.toggleError();
                  } else {
                    clearData();
                    user.reloadUser();
                    toggle();
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
    identificator: identifier.toLowerCase(),
    name: name,
    info: info,
    imagePath: `${img}`
  }).then(result => {
    return result
  });
}

export default EditUserModal
