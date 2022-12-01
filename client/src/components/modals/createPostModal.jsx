import "../../styles/modals/modal.css";
import { useUser } from "../utilities/userContext";

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
        <div 
          className="closeBtn" 
          onClick={user.toggleCreatePost}
        >

        </div>
      </div>
    </div>
  );
};

export default CreatePostModal
