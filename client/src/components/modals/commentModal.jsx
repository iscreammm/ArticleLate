import "../../styles/modals/modal.css";
import "../../styles/modals/createPost.css";

const CommentModal = ({ isOpen, toggleComments }) => {

  if(!isOpen) {
    return null;
  }

  return (
    <div className='overlay'
      onClick={toggleComments}
    >
    </div>
  );
};

export default CommentModal