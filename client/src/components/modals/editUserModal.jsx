import axios from "axios";
import { useUser } from "../utilities/userContext";
import "../../styles/modals/modal.css";
import "../../styles/modals/editUser.css";

const EditUserModal = () => {
  const user = useUser();

  if(!user.editUserOpen) {
    return null;
  }

  return (
    <div className='overlay'
      onClick={user.toggleInfoEditing}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer' 
        style={{padding: "2vw"}}
      >
        <div className="editUser">
          <div className="editUserAvatar"><img src="layout/avatar.png" alt="Avatar" /></div>
          <div className="editUserInformation">
            <img src="profile/editprofile.png" alt="EditProfile" />
            <input type="text" />
            <input type="text" />
            <button className="checkId">Проверить идентификатор</button>
          </div>
        </div>
        <textarea name="" id="" className="editDescription"></textarea>
        <div className="confirmUserChanges">
          <button>Отменить</button>
          <button
            
          >Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal
