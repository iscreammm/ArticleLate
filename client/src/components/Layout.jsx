import { Outlet, Link } from 'react-router-dom';
import App from './App';
import "../styles/layout.css";
import root from "../index";
import CommentModal from './modals/commentModal';
import { useState } from 'react';
import { useUser } from './utilities/userContext';
import NotificationsModal from './modals/notificationsModal';
import EditUserModal from './modals/editUserModal';
import CreatePostModal from './modals/createPostModal';

const Layout = () => {
  const user = useUser();

  return (
    <>
      <NotificationsModal />
      <EditUserModal />
      <CommentModal />
      <CreatePostModal />
      <div className="main">
        <div className='menu'>
          <Link to="/userprofile"><img className='avatar' src="layout/avatar.png" alt="Avatar" /></Link> 
          <p className='notificationsContainer'> 
            <img className='notificationsIcon' src="layout/bell.PNG" alt="Bell" 
              onClick={() => {
                user.toggleNotifications();
              }}
            />  
            <p className='notificationsCount'>0</p>
          </p>
          <Link to="/"><img className='menuButton' src="layout/news.PNG" alt="News" style={{margin: '2rem 0 0.7rem'}} /></Link> 
          <Link to="/subs"><img className='menuButton' src="layout/subs.PNG" alt="Subs" /></Link> 
              
        </div>
        <img className='logoMenu' src="common/logo.PNG" alt="Logo" />
        <img className='exit menuButton' src="layout/exit.PNG" alt="Exit" 
          onClick={() => {
            localStorage.removeItem('userId');
            root.render(
              <App />
            );
          }}
        />
        <Outlet />
      </div>
    </>
  );
}

export default Layout