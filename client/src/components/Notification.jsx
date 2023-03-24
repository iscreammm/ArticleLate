import { useState } from "react";
import axios from "axios";
import { useUser } from "./utilities/userContext";

const Notification = ({ data }) => {
  const user = useUser();
  const [deleted, setDeleted] = useState(false);

  if (deleted) {
    return <></>
  }

  return (
    <div onClick={() => {
      axios.get(`http://localhost:8080/getPost?userId=${user.id}&postId=${data.postId}`).then(result => {
        if (result.data.message === "Пост был удален") {
          user.setErrorMessage(result.data.message);
          user.toggleError();
          axios.delete(`http://localhost:8080/deleteNotification?notificationId=${data.id}`).then(deletionResult => {
            if (deletionResult.data.state === "Success") {
              setDeleted(true);
            } else {
              user.setErrorMessage(result.data.message + deletionResult.data.message);
            }
          });
        } else {
          let data = JSON.parse(result.data.data);

          user.setSelectedPost(data);
          axios.delete(`http://localhost:8080/deleteNotification?notificationId=${data.id}`).then(deletionResult => {
            if (deletionResult.data.state === "Success") {
              setDeleted(true);
              user.toggleComments();
              user.toggleNotifications();
            } else {
              user.setErrorMessage(deletionResult.data.message);
              user.toggleError();
            }
          });
        }
      });
    }}>
      Вас упомянули под постом
    </div>
  );
}

export default Notification
