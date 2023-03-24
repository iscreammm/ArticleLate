import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Auth from "../components/Auth";
import Registration from "../components/Registration";
import "../styles/login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const fromPage = location.state?.from?.pathname || '/';

  return (
    <div className="main">
      <img className="firstSakura" src="login/firstsakura.png" alt="Sakura1"/>
      <img className="secondSakura" src="login/secondsakura.png" alt="Sakura2"/>
      <div className="wrapper">
        <img className="logo" src="common/logo.PNG" alt="Logo"/>
        <div className="content">
          <Routes>
            <Route path="auth" element={<Auth navigate={navigate} fromPage={fromPage} />} />
            <Route path="register" element={<Registration navigate={navigate} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
