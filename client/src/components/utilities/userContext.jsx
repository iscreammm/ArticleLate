import React, { useContext, useState } from 'react';

const UserContext = React.createContext()

export const useUser = () => {
  return useContext(UserContext);
}

export const UserProvider = ({ id, children }) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [editUserOpen, setEditUserModal] = useState(false);
  const [refreshUser, setRefreshUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedPost, setSelectedPost] = useState();
  
  const toggleComments = () => {
    setCommentsOpen(prev => !prev);
  }

  const toggleNotifications = () => {
    setNotifOpen(prev => !prev);
  }

  const toggleCreatePost = () => {
    setCreatePostOpen(prev => !prev);
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
      commentsOpen: commentsOpen,
      notifOpen: notifOpen,
      createPostOpen: createPostOpen,
      editUserOpen: editUserOpen,
      refreshUser: refreshUser,
      selectedUser: selectedUser,
      selectedPost: selectedPost,
      toggleComments, toggleCreatePost, toggleNotifications, toggleInfoEditing, reloadUser,
      setSelectedUser, setSelectedPost
    }}>
      { children }
    </UserContext.Provider>
  )
}
