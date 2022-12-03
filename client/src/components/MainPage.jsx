import { Route, Routes, Link } from 'react-router-dom';

import News from '../pages/News';
import Subscriptions from '../pages/Subscriptions';
import Profile from '../pages/Profile';
import UserProfile from '../pages/UserProfile';
import Layout from './Layout';

const MainPage = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<News />}></Route>
          <Route path="/subs" element={<Subscriptions />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/userprofile" element={<UserProfile />}></Route>
        </Route>
      </Routes>
    </>
  );

}

export default MainPage
