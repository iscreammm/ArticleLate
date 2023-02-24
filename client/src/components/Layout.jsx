import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './utilities/userContext';
import CommentModal from './modals/commentModal';
import NotificationsModal from './modals/notificationsModal';
import ErrorModal from './modals/errorModal';
import "../styles/layout.css";

const Layout = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:8080/getNotificationsCount?userId=${user.id}`).then(result => {
      setNotificationsCount(result.data.data);
    });
  }, []);

  return (
    <>
      <NotificationsModal />
      <CommentModal />
      <ErrorModal />

      <div className="main">
        <div className='menu'>
          <Link className="avatar" to={`profile/${user.identificator}`}>
            <img src={user.avatar} alt="Avatar" style={{display: user.avatar === undefined ? "none" : "block"}} />
          </Link>
          <p className='notificationsContainer'> 
            <img className='notificationsIcon' src="layout/bell.PNG" alt="Bell" 
              onClick={() => {
                user.toggleNotifications();
              }}
            />  
            <p className='notificationsCount'>{notificationsCount}</p>
          </p>
          <Link to="/"><img className='menuButton' src="layout/news.PNG" alt="News" style={{margin: '2rem 0 0.7rem'}} /></Link> 
          <Link to="/subs"><img className='menuButton' src="layout/subs.PNG" alt="Subs" /></Link> 
        </div>
        <img className='logoMenu' src="common/logo.PNG" alt="Logo" />
        <img className='exit menuButton' src="layout/exit.PNG" alt="Exit" 
          onClick={() => {
            user.signOut(() => navigate('/', {replace: true}))
          }}
        />
        <Outlet />
      </div>
    </>
  );
}

export default Layout
