import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = React.createContext()

export const useUser = () => {
  return useContext(UserContext);
}

export const UserProvider = ({ id, children }) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [editUserOpen, setEditUserModal] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [refreshUser, setRefreshUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [selectedPost, setSelectedPost] = useState();
  const [editPost, setEditPost] = useState();
  const [postToRefresh, setPostToRefresh] = useState();
  const [loadPost, setLoadPost] = useState();
  const [identificator, setIdentificator] = useState();

  useEffect(() => {
    axios.get(`http://localhost:8080/getProfile?userId=${id}`).then(result => {
      setIdentificator(JSON.parse(result.data.data).identificator);
    });
  }, [refreshUser])

  if (!identificator) {
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

  const toggleCreatePost = () => {
    setCreatePostOpen(prev => !prev);
  }

  const toggleEditPost = () => {
    setEditPostOpen(prev => !prev);
  }

  const toggleInfoEditing = () => {
    setEditUserModal(prev => !prev);
  }

  const reloadUser = () => {
    setRefreshUser(prev => !prev);
  }

  return (
    <UserContext.Provider value={{
      id: id,
      identificator: identificator,
      commentsOpen: commentsOpen,
      notifOpen: notifOpen,
      createPostOpen: createPostOpen,
      editPostOpen: editPostOpen,
      editUserOpen: editUserOpen,
      refreshUser: refreshUser,
      selectedPost: selectedPost,
      editPost: editPost,
      postToRefresh: postToRefresh,
      loadPost: loadPost,
      errorOpen: errorOpen,
      errorMessage: errorMessage,
      toggleComments, toggleCreatePost, toggleNotifications, toggleInfoEditing, toggleEditPost, toggleError,
      reloadUser, setSelectedPost, setEditPost, setPostToRefresh, setLoadPost, setErrorMessage
    }}>
      { children }
    </UserContext.Provider>
  )
}
