import React, { useContext, useState } from 'react';

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
  const [refreshUser, setRefreshUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedPost, setSelectedPost] = useState();
  const [editPost, setEditPost] = useState();
  const [postToRefresh, setPostToRefresh] = useState();
  const [loadPost, setLoadPost] = useState();

  const toggleComments = () => {
    setCommentsOpen(prev => !prev);
  }

  const toggleNotifications = () => {
    setNotifOpen(prev => !prev);
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
      commentsOpen: commentsOpen,
      notifOpen: notifOpen,
      createPostOpen: createPostOpen,
      editPostOpen: editPostOpen,
      editUserOpen: editUserOpen,
      refreshUser: refreshUser,
      selectedUser: selectedUser,
      selectedPost: selectedPost,
      editPost: editPost,
      postToRefresh: postToRefresh,
      loadPost: loadPost,
      toggleComments, toggleCreatePost, toggleNotifications, toggleInfoEditing, toggleEditPost,
      reloadUser, setSelectedUser, setSelectedPost, setEditPost, setPostToRefresh, setLoadPost
    }}>
      { children }
    </UserContext.Provider>
  )
}
