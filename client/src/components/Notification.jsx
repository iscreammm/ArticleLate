import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "./utilities/userContext";

const Notification = ({ notifData }) => {
  const user = useUser();
  const [deleted, setDeleted] = useState(false);

  if (deleted) {
    return <></>
  }

  return (
    <div onClick={() => {
      axios.get(`http://localhost:8080/getPost?userId=${user.id}&postId=${notifData.postId}`).then(result => {
        if (result.data.message === "Пост был удалён") {
          user.setErrorMessage("Пост был удалён");
          user.toggleError();
          axios.delete(`http://localhost:8080/deleteNotification?notificationId=${notifData.id}`).then(deletionResult => {
            if (deletionResult.data.state === "Success") {
              setDeleted(true);
              user.toggleComments();
              user.toggleNotifications();
            } else {
              user.setErrorMessage(deletionResult.data.message);
              user.toggleError();
            }
          });
        } else {
          let data = JSON.parse(result.data.data);

          axios.get(`http://localhost:8080/getProfile?userId=${data.authorId}`).then(res => {
          let authorAvatar = JSON.parse(res.data.data).imagePath;
          user.setSelectedPost({data, authorAvatar});
          axios.delete(`http://localhost:8080/deleteNotification?notificationId=${notifData.id}`).then(deletionResult => {
            if (deletionResult.data.state === "Success") {
              setDeleted(true);
              user.toggleComments();
              user.toggleNotifications();
            } else {
              user.setErrorMessage(deletionResult.data.message);
              user.toggleError();
            }
          });
        });
        }
      });
    }}>
      Вас упомянули под постом
    </div>
  );
}

export default Notification
