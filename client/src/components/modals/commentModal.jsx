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
    </div>
  );
};

export default CommentModal