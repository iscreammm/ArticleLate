import "../../styles/modals/modal.css";

const CommentModal = ({ isOpen, toggleComments }) => {

  if(!isOpen) {
    return null;
  }

  return (
    <div className='overlay'
      onClick={toggleComments}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <div 
          className="closeBtn" 
          onClick={toggleComments}
        >

        </div>
      </div>
    </div>
  );
};

export default CommentModal
