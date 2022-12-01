import React, { useContext, useState } from 'react';

const UserContext = React.createContext()

export const useUser = () => {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [editUserOpen, setEditUserModal] = useState(false);
  
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

  return (
    <UserContext.Provider value={{
      commentsOpen: commentsOpen,
      notifOpen: notifOpen,
      createPostOpen: createPostOpen,
      editUserOpen: editUserOpen,
      toggleComments, toggleCreatePost, toggleNotifications, toggleInfoEditing
    }}>
      { children }
    </UserContext.Provider>
  )
}
