import "../../styles/modals/modal.css";
import { useUser } from "../utilities/userContext";

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
      >
        <div 
          className="closeBtn" 
          onClick={user.toggleInfoEditing}
        >

        </div>
      </div>
    </div>
  );
};

export default EditUserModal
