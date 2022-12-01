import "../../styles/modals/modal.css";
import { useUser } from "../utilities/userContext";
import "../../styles/modals/notificationModal.css";

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
        className='modalContainer notificationsModal'
      >
        <button className="clearButton">Очистить</button>
        <div className="notifications">
          <div>Вас упомянули под постом</div>
          <div>Вас упомянули под постом</div>
          <div>Вас упомянули под постом</div>
          <div>Вас упомянули под постом</div>
          <div>Вас упомянули под постом</div>
        </div>

      </div>
    </div>
  );
};

export default NotificationsModal
