import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "./utilities/userContext";

const Notification = ({ notifData }) => {
  const user = useUser();

  return (
    <div onClick={() => {
      axios.get(`http://localhost:8080/getPost?userId=${user.id}&postId=${notifData.postId}`).then(result => {
        let data = JSON.parse(result.data.data);
        
        axios.get(`http://localhost:8080/getProfile?userId=${data.authorId}`).then(res => {
          let authorAvatar = JSON.parse(res.data.data).imagePath;
          user.setSelectedPost({data, authorAvatar});
          axios.delete(`http://localhost:8080/deleteNotification?notificationId=${notifData.id}`).then(deletionResult => {
            if (deletionResult.data.state === "Success") {
              user.toggleComments();
              user.toggleNotifications();
            } else {
              console.log(deletionResult.data.message);
            }
          });
        });
      });
    }}>
      Вас упомянули под постом
    </div>
  );
}

export default Notification
