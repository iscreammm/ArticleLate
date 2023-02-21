import { Route, Routes } from 'react-router-dom';
import News from '../pages/News';
import Subscriptions from '../pages/Subscriptions';
import Profile from '../pages/Profile';
import UserProfile from '../pages/UserProfile';
import Layout from './Layout';
import { useUser } from './utilities/userContext';
import Login from '../pages/Login';
import RequireAuth from './utilities/RequireAuth';

const App = () => {
  const user = useUser();
  
  return (
    <>
      <Routes>
        <Route path="login" element={<Login />}></Route>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <RequireAuth>
              <News />
            </RequireAuth>
          }></Route>
          <Route path="subs" element={
            <RequireAuth>
              <Subscriptions />
            </RequireAuth>
          }></Route>
          <Route path="profile/:identifier" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>}></Route>
          <Route path={`profile/${user.identificator}`}  element={
            <RequireAuth>
              <UserProfile />
            </RequireAuth>
          }></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App
