import root from "../index";
import "../styles/login.css";
import React, { useState, useEffect } from "react";
import MainPage from "./MainPage";
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

const App = () => {
  const [isReg, setIsReg] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/verifyLogin?login=Slark228").then(result => {
      console.log(result)
    })
  }, [])

  return (
    <div className="main">
      <img className="firstSakura" src="login/firstsakura.png" alt="Sakura1"/>
      <img className="secondSakura" src="login/secondsakura.png" alt="Sakura2"/>
      <div className="wrapper">
        <img className="logo" src="common/logo.PNG" alt="Logo"/>
        <div className="content">
          { isReg === false ? (
            <div className="authorization">
              <img className="authorizationLogo" src="login/authorization.PNG" alt="Authorization"/>
              <input className="loginInput" placeholder="Введите логин"/>
              <p className="password"> <input className="loginInput"  placeholder="Введите пароль" /> <img className="passwordIcon" src="login/eye.jpg"/> </p>
              <button className="buttonLogin" style={{marginTop: "0.5vw"}}
                onClick={() => {
                  root.render(
                    <BrowserRouter>
                      <MainPage />
                    </BrowserRouter>
                  )
                }}
              >
                Войти
              </button>
              <button className="buttonLogin" style={{margin: "3vw auto 0"}} onClick={() => { setIsReg(true) }}> Регистрация </button>
            </div>) : (
              <div className="registration">
                <img className="backLogo" src="login/back.PNG" alt="Back" onClick={() => { setIsReg(false) }}/>
                <img className="registrationLogo" src="login/registration.PNG" alt="Registration"/>
                <input className="loginInput registrationInput" style={{width: "30%"}} placeholder="Введите имя"/>
                <input className="loginInput registrationInput"  placeholder="Введите логин"/>
                <button className="buttonCheck"> Проверить </button>
                <p className="password"> <input className="loginInput registrationInput"  placeholder="Введите пароль" /> <img className="passwordIcon" src="login/eye.jpg"/> </p>
                <p className="password"> <input className="loginInput registrationInput"  placeholder="Повторите пароль" /> <img className="passwordIcon" src="login/eye.jpg"/> </p>
                <button className="buttonLogin" style={{margin: "3vw auto 0"}}> Зарегистрироваться </button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );

  
}

export default App
