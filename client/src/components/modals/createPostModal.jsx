import "../../styles/modals/modal.css";
import { useUser } from "../utilities/userContext";
import "../../styles/modals/createPost.css";

const CreatePostModal = () => {
  const user = useUser();

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
        className='modalContainer'
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
        <div className="bottomMenu">
          <div className="uploadImage"> <input type="file"/> </div>
          <div className="formatting">о</div>
          <div className="formatting">П</div>
          <div className="formatting">З</div>
          <div className="formatting">К</div>
          <div className="formatting">Ж</div>
          <div className="create">Создать</div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal
