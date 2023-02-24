import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = React.createContext()

export const useUser = () => {
  return useContext(UserContext);
}

export const UserProvider = ({ ident, children }) => {
  const [id, setId] = useState(ident);
  const [avatar, setAvatar] = useState();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [selectedPost, setSelectedPost] = useState();
  const [editPost, setEditPost] = useState();
  const [postToRefresh, setPostToRefresh] = useState();
  const [identificator, setIdentificator] = useState();

  const signIn = (newUser, cb) => {
    setId(newUser);
    localStorage.setItem('userId', newUser);
    cb();
  }

  const signOut = (cb) => {
    setId(null);
    localStorage.removeItem('userId');
    cb();
  }

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/getProfile?userId=${id}`).then(result => {
        const data = JSON.parse(result.data.data)
        setIdentificator(data.identificator);
        setAvatar(data.imagePath);
      });
    }
  }, [id]);

  if ((!identificator) && (id)) {
    return <></>
  }

  const toggleComments = () => {
    setCommentsOpen(prev => !prev);
  }

  const toggleNotifications = () => {
    setNotifOpen(prev => !prev);
  }

  const toggleError = () => {
    setErrorOpen(prev => !prev);
  }

  return (
    <UserContext.Provider value={{
      id: id,
      avatar: avatar,
      identificator: identificator,
      commentsOpen: commentsOpen,
      notifOpen: notifOpen,
      selectedPost: selectedPost,
      editPost: editPost,
      postToRefresh: postToRefresh,
      errorOpen: errorOpen,
      errorMessage: errorMessage,
      toggleComments, toggleNotifications, toggleError,
      setSelectedPost, setEditPost, setPostToRefresh, setErrorMessage, setAvatar,
      signIn, signOut
    }}>
      { children }
    </UserContext.Provider>
  );
}
