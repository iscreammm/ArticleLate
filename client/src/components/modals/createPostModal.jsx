import { useState } from "react";
import axios from "axios";
import { useUser } from "../utilities/userContext";
import "../../styles/modals/modal.css";
import "../../styles/modals/createPost.css";

const CreatePostModal = ({ isOpen, toggle, setNewPost, userName }) => {
  const user = useUser();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCat, setSelectedCat] = useState(0);
  const [postText, setPostText] = useState("");

  if(!isOpen) {
    return null;
  }

  const clearData = () => {
    setSelectedImage(null);
    setSelectedCat(0);
    setPostText("");
  };
  
  const handleCatChange = (e) => {
    setSelectedCat(e.target.value);
  };

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  function addFormatting(tagName) {
    let element = document.getElementById('#postTextField');
    let start = element.selectionStart;
    let end = element.selectionEnd;
    setPostText(postText.slice(0, start) + `<${tagName}>` +
        postText.slice(start, end)+ `</${tagName}>` + postText.slice(end));
  }

  return (
    <div className='overlay'>
      <div className='modalContainer createPostContainer'>
       <div className="topMenu">
          <div className="categoriesBtn">
            <select id="CategoriesID" className="categoriesSelect" name="categories"
              value={selectedCat}
              onChange={handleCatChange}
            >
              <option value={0} disabled hidden>Категории</option>
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
          <div className="closeBtn">
            <button type="button" onClick={() => {
              clearData();
              toggle();
            }}>
              <img src="common/close.png" alt="Close"/>
            </button>
          </div>
        </div>
        <textarea id="#postTextField" type="text" className="postInput" placeholder="Введите текст"
          maxLength="10000"
          value={postText}
          onChange={handleTextChange}
        />
        <img id="#createPostImage" alt="Create post"
          className="createPostImage"
          src={selectedImage !== null ? URL.createObjectURL(selectedImage) : ""}
          style={{display: selectedImage ? "block" : "none"}}
        />
        <div className="bottomMenu" style={{position: selectedImage === null ? "absolute" : "sticky"}}>
          <div className="uploadImage">
            <label className="loadImgLabel" htmlFor="#loadPostImage">Загрузить изображение</label>
            <input id="#loadPostImage" type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={(event) => {
                let reader = new FileReader();
                  reader.readAsDataURL(event.target.files[0]);
                  reader.onload = function (e) {
                    var image = new Image();
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
              onClick={async () => {
                if (selectedImage === null) {
                  await axios.post("http://localhost:8080/createPost", {
                    authorId: user.id,
                    categoryId: selectedCat,
                    text: postText,
                    image: ""
                  }).then(result => {
                    if (result.data.state === "Success") {
                      const resObject = JSON.parse(result.data.data);
                      let e = document.getElementById("CategoriesID");
                      let catText = e.options[e.selectedIndex].text;
                      setNewPost({
                        authorId: user.id,
                        categoryId: selectedCat,
                        id: resObject.postId,
                        identificator: user.identificator,
                        image: "",
                        isLiked: false,
                        likesCount: 0,
                        category: catText,
                        name: userName,
                        text: postText,
                        time: resObject.postTime
                      });
                      clearData();
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

                    await axios.post("http://localhost:8080/createPost", {
                      authorId: user.id,
                      categoryId: selectedCat,
                      text: postText,
                      image: `${base64String}`
                    }).then(result => {
                      if (result.data.state === "Success") {
                        const resObject = JSON.parse(result.data.data);
                        let e = document.getElementById("CategoriesID");
                        let catText = e.options[e.selectedIndex].text;
                        setNewPost({
                          authorId: user.id,
                          categoryId: selectedCat,
                          id: resObject.postId,
                          identificator: user.identificator,
                          image: resObject.imagePath,
                          isLiked: false,
                          likesCount: 0,
                          category: catText,
                          name: userName,
                          text: postText,
                          time: resObject.postTime
                        });
                        clearData();
                        toggle();
                      } else {
                        user.setErrorMessage(result.data.message);
                        user.toggleError();
                      }
                    });
                  };
                }
              }}
              disabled={((selectedCat === 0) || (postText === "")) ? true : false}
            >
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal
