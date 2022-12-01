import "../../styles/modals/modal.css";
import { useUser } from "../utilities/userContext";

const CommentModal = () => {
  const user = useUser();

  if(!user.commentsOpen) {
    return null;
  }

  return (
    <div className='overlay'
      onClick={user.toggleComments}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <div 
          className="closeBtn" 
          onClick={user.toggleComments}
        >

        </div>
      </div>
    </div>
  );
};

export default CommentModal