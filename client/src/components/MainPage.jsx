import { Route, Routes, Navigate } from 'react-router-dom';
import News from '../pages/News';
import Subscriptions from '../pages/Subscriptions';
import Profile from '../pages/Profile';
import UserProfile from '../pages/UserProfile';
import Layout from './Layout';
import { useUser } from './utilities/userContext';


const MainPage = () => {
  const user = useUser();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<News />}></Route>
          <Route path="subs" element={<Subscriptions />}></Route>
          <Route path="userprofile" element={<UserProfile />}></Route>
          <Route path="profile/:identifier" element={<Profile />}></Route>
          <Route path={`profile/${user.identificator}`} element={<Navigate to="/userprofile" replace />}></Route>
        </Route>
      </Routes>
    </>
  );

}

export default MainPage
