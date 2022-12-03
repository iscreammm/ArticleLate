import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../utilities/userContext";
import "../../styles/modals/modal.css";
import "../../styles/modals/createPost.css";

const CreatePostModal = () => {
  const user = useUser();
  const [selectedImage, setSelectedImage] = useState(null);
  
  if(!user.createPostOpen) {
    return null;
  }

  return (
    <div className='overlay'
      onClick={user.toggleCreatePost}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer createPostContainer'
      >
       <div className="topMenu">
          <div className="categoriesBtn">
            <select id="CategoriesID" className="categoriesSelect" name="Categories">
              <option value="" selected disabled hidden>Категории</option>
              <option value="https://wax.greymass.com">It</option>
              <option value="https://wax.pink.gg">Игры</option>
              <option value="https://wax.eosphere.io">Кино</option>
              <option value="https://api.waxsweden.org">Арты</option>
              <option value="https://api.waxsweden.org">Юмор</option>
              <option value="https://api.waxsweden.org">Наука</option>
              <option value="https://api.waxsweden.org">Музыка</option>
              <option value="https://api.waxsweden.org">Новости</option>
            </select>
          </div>
          <div className="graySpace"></div>
          <div className="closeBtn" onClick={user.toggleCreatePost}><img src="common/close.png" alt="Close"/></div>
        </div>
        <textarea type="text" className="postInput"  placeholder="Введите что-нибудь"/>
        <img id="#createPostImage"
          className="createPostImage"
          src={selectedImage !== null ? URL.createObjectURL(selectedImage) : ""} 
          alt="UserImage" 
        />
        <div className="bottomMenu" style={{position: selectedImage === null ? "absolute" : "sticky"}}>
          <div className="uploadImage">
            <input id="#loadPostImage" type="file"
              onChange={(event) => {
                setSelectedImage(event.target.files[0]);
              }}
            />
          </div>
          <div className="formatting">о</div>
          <div className="formatting">П</div>
          <div className="formatting">З</div>
          <div className="formatting">К</div>
          <div className="formatting">Ж</div>
          <div className="create"
            onClick={async () => {
              // Encode the file using the FileReader API
              const reader = new FileReader();
              
              reader.readAsDataURL(selectedImage);
              reader.onloadend = async () => {
                const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

                await axios.post("http://localhost:8080/createPost", {
                  authorId: 1,
                  categoryId: 1,
                  text: 'abobus228',
                  image: `${base64String}`
                }).then(result => {
                  console.log(result)
                })
              };
              
            }}
          >Создать</div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal
