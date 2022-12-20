import { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../Notification";
import { useUser } from "../utilities/userContext";
import "../../styles/modals/modal.css";
import "../../styles/modals/notificationModal.css";

const NotificationsModal = () => {
  const user = useUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/getNotifications?userId=${user.id}`).then(result => {
      if (result.data.state === "Success") {
        setNotifications(JSON.parse(result.data.data));
      } else {
        user.setErrorMessage(result.data.message);
        user.toggleError();
      }
    });
  }, [])

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
        <button className="clearButton"
          disabled={notifications.length ? false : true}
          onClick={() => {
            axios.delete(`http://localhost:8080/deleteAllNotification?userId=${user.id}`).then(deletionResult => {
              if (deletionResult.data.state === "Success") {
                setNotifications(undefined);
              } else {
                user.setErrorMessage(deletionResult.data.message);
                user.toggleError();
              }
            });
          }}
        >
          Очистить
        </button>
        <div className="notifications">
          {notifications.map(notification => {
            return <Notification key={notification.id} notifData={notification} />
          })}
          {notifications.length === 0 ? <p className="noNotifications">Нет уведомлений</p> : <></>}
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal
