import { Outlet } from 'react-router-dom';
import "../styles/layout.css";

const Layout = () => {
  return (
    <div className="main">
      <div className='menu'>
        <img className='avatar' src="layout/avatar.png" alt="Avatar" /> 
        <p className='notificationsContainer'> 
          <img className='notificationsIcon' src="layout/bell.PNG" alt="Bell" />  
          <p className='notificationsCount'>0</p>
        </p>
        <img className='menuButton' src="layout/news.PNG" alt="News" style={{margin: '2rem 0 0.7rem'}} />  
        <img className='menuButton' src="layout/subs.PNG" alt="Subs" />      
      </div>
      <img className='logoMenu' src="common/logo.PNG" alt="Logo" />
      <img className='exit menuButton' src="layout/exit.PNG" alt="Exit" />
      <Outlet />
    </div>
  );

}

export default Layout