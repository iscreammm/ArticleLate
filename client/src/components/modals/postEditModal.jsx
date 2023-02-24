import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../utilities/userContext";
import "../../styles/modals/modal.css";
import "../../styles/modals/createPost.css";

const EditPostModal = ({ isOpen, toggle, data, setRefreshedPost }) => {
  const user = useUser();
  const [selectedImage, setSelectedImage] = useState(null);
  const [postText, setPostText] = useState();
  const [selectedCat, setSelectedCat] = useState();
  const [isDisabled, setIsDisabled] = useState(true);
  
  useEffect(() => {
    if (isOpen) {
      setPostText(data.text);
      setSelectedCat(getCatId(data.category));
    }
  }, [isOpen]);
  
  if(!isOpen) {
    return null;
  }

  const getCatId = (category) => {
    let catId;

    switch(category) {
      case "It":
        catId = 1;
        break;
      case "Игры":
        catId = 2;
        break;
      case "Кино":
        catId = 3;
        break;
      case "Арты":
        catId = 4;
        break;
      case "Юмор":
        catId = 5;
        break;
      case "Наука":
        catId = 6;
        break;
      case "Музыка":
        catId = 7;
        break;
      case "Новости":
        catId = 8;
        break;
      default:
        console.log("Unknown category");
    }

    return catId;
  }

  const getCatText = (category) => {
    let catText;

    switch(category) {
      case 1:
        catText = "It";
        break;
      case 2:
        catText = "Игры";
        break;
      case 3:
        catText = "Кино";
        break;
      case 4:
        catText = "Арты";
        break;
      case 5:
        catText = "Юмор";
        break;
      case 6:
        catText = "Наука";
        break;
      case 7:
        catText = "Музыка";
        break;
      case 8:
        catText = "Новости";
        break;
      default:
        console.log("Unknown category");
    }

    return catText;
  }

  const handleTextChange = (e) => {
    setPostText(e.target.value);
    setDisabled(selectedCat, e.target.value);
  };

  const handleCatChange = (e) => {
    setSelectedCat(e.target.value);
    setDisabled(e.target.value, postText);
  };

  function addFormatting(tagName) {
    let element = document.getElementById('#postTextField');
    let start = element.selectionStart;
    let end = element.selectionEnd;
    setPostText(postText.slice(0, start) + `<${tagName}>` +
        postText.slice(start, end)+ `</${tagName}>` + postText.slice(end));
  }

  const setDisabled = (cat, text) => {
    if ((getCatId(data.category) === parseInt(cat)) && (data.text === text)
        && (selectedImage === null)) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(postText === "") {
      user.setErrorMessage("Нельзя сохранить пустой текст");
      user.toggleError();
    } else {
      if (!selectedImage) {
        await axios.put("http://localhost:8080/changePost", {
          id: data.id,
          text: postText,
          categoryId: parseInt(selectedCat),
          image: data.image
        }).then(result => {
          if (result.data.state === "Success") {
            setRefreshedPost({
              ...data,
              text: postText,
              category: getCatText(parseInt(selectedCat))
            });
            setIsDisabled(true);
            toggle();
          } else {
            user.setErrorMessage(result.data.message);
            user.toggleError();
          }
        });
      } else {
        const reader = new FileReader();
        
        reader.readAsDataURL(selectedImage);
        reader.onloadend = async () => {
          const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

          await axios.put("http://localhost:8080/changePost", {
            id: data.id,
            text: postText,
            categoryId: parseInt(selectedCat),
            image: `${base64String}`
          }).then(result => {
            if (result.data.state === "Success") {
              setRefreshedPost({
                ...data,
                text: postText,
                category: getCatText(parseInt(selectedCat))
              });
              setIsDisabled(true);
              toggle();
            } else {
              user.setErrorMessage(result.data.message);
              user.toggleError();
            }
          });
        };
      }
    }
  }

  return (
    <div className='overlay'>
      <div className='modalContainer createPostContainer'>
        <form onSubmit={handleSubmit}>
          <div className="topMenu">
            <div className="categoriesBtn">
              <select id="CategoriesID" className="categoriesSelect" name="Categories"
                value={selectedCat}
                onChange={handleCatChange}
              >
                <option value={1}>It</option>
                <option value={2}>Игры</option>
                <option value={3}>Кино</option>
                <option value={4}>Арты</option>
                <option value={5}>Юмор</option>
                <option value={6}>Наука</option>
                <option value={7}>Музыка</option>
                <option value={8}>Новости</option>
              </select>
            </div>
            <div className="graySpace"></div>
            <div className="closeBtn"
              onClick={() => {
                setSelectedImage(null);
                toggle();
              }}
            >
            <img src="common/close.png" alt="Close"/></div>
          </div>
          <textarea id="#postTextField" type="text" className="postInput" placeholder="Введите текст"
            maxLength="10000"
            value={postText}
            onChange={handleTextChange}
          />
          <img id="#createPostImage" alt="Create post"
            className="createPostImage"
            src={selectedImage !== null ? URL.createObjectURL(selectedImage) : data.image}
            style={{display: selectedImage || data.image ? "block" : "none"}}
          />
          <div className="bottomMenu" style={{position: !selectedImage && !data.image ? "absolute" : "sticky"}}>
            <div className="uploadImage">
              <label className="loadImgLabel" htmlFor="#loadPostImage">Загрузить изображение</label>
              <input id="#loadPostImage" type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={(event) => {
                  let reader = new FileReader();
                    reader.readAsDataURL(event.target.files[0]);
                    reader.onload = function (e) {
                      let image = new Image();
                      image.src = e.target.result;

                      image.onload = function () {
                        if (event.target.files[0].size > (1024 * 1024 * 10)) {
                          user.setErrorMessage("Размер файла слишком большой");
                          user.toggleError();
                        } else if (((this.height < 400) && (this.width < 400)) || ((this.height > 1920) && (this.width > 1920))) {
                          user.setErrorMessage("Изображение должно быть меньше 1920x1920 и больше 400x400");
                          user.toggleError();
                        } else {
                          setSelectedImage(event.target.files[0]);
                        }
                      };
                    };
                }}
                style={{display: "none"}}
              />
            </div>
            <div className="formatting" onClick={() => {addFormatting('span')}}>о</div>
            <div className="formatting" onClick={() => {addFormatting('h3')}}>П</div>
            <div className="formatting" onClick={() => {addFormatting('h2')}}>З</div>
            <div className="formatting" onClick={() => {addFormatting('i')}}>К</div>
            <div className="formatting" onClick={() => {addFormatting('b')}}>Ж</div>
            <div className="create">
              <button className="createButton"
                disabled={isDisabled}
                type="submit"
              >
                Сохранить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal
