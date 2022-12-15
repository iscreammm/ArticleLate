import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../utilities/userContext";
import "../../styles/modals/modal.css";
import "../../styles/modals/createPost.css";

const CreatePostModal = () => {
  const user = useUser();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCat, setSelectedCat] = useState(0);
  const [postText, setPostText] = useState("");

  if(!user.createPostOpen) {
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
    element.selectionStart = null;
    element.selectionEnd = null;
  }

  return (
    <div className='overlay'>
      <div className='modalContainer createPostContainer'>
       <div className="topMenu">
          <div className="categoriesBtn">
            <select id="CategoriesID" className="categoriesSelect" name="Categories"
              value={selectedCat}
              onChange={handleCatChange}
            >
              <option value={0} selected disabled hidden>Категории</option>
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
              clearData();
              user.toggleCreatePost();
            }}
          >
          <img src="common/close.png" alt="Close"/></div>
        </div>
        <textarea id="#postTextField" type="text" className="postInput" placeholder="Введите текст"
          maxLength="10000"
          value={postText}
          onChange={handleTextChange}
        />
        <img id="#createPostImage"
          className="createPostImage"
          src={selectedImage !== null ? URL.createObjectURL(selectedImage) : ""}
        />
        <div className="bottomMenu" style={{position: selectedImage === null ? "absolute" : "sticky"}}>
          <div className="uploadImage">
            <label className="loadImgLabel" htmlFor="#loadPostImage">Загрузить изображение</label>
            <input id="#loadPostImage" type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={(event) => {
                setSelectedImage(event.target.files[0]);
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
                    console.log(result)
                  })
                };
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
