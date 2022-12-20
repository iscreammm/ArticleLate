import ReactDOM from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import MainPage from "./components/MainPage";
import { UserProvider } from "./components/utilities/userContext";
import './styles/reset.css';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

function restoreSession() {
  const id = localStorage.getItem('userId');

  if (id) {
    root.render(
      <BrowserRouter>
        <UserProvider id={parseInt(id)}>
          <MainPage />
        </UserProvider>
      </BrowserRouter>
    )
  } else {
    root.render(
      <App />
    );
  }
}

restoreSession();

export default root
