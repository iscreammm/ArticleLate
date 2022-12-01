import "../../styles/modals/modal.css";
import { useUser } from "../utilities/userContext";

const NotificationsModal = () => {
  const user = useUser();

  if(!user.notifOpen) {
    return null;
  }

  return (
    <div className='overlay'
      onClick={user.toggleNotifications}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <div 
          className="closeBtn" 
          onClick={user.toggleNotifications}
        >

        </div>
      </div>
    </div>
  );
};

export default NotificationsModal
