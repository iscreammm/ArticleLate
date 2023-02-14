import { useUser } from "../utilities/userContext";
import "../../styles/modals/modal.css";

const ErrorModal = () => {
  const user = useUser();

  if(!user.errorOpen) {
    return null;
  }

  return (
    <div className='overlay'
      onClick={user.toggleError}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer notificationsModal'
        style={{zIndex: "20"}}
      >
        <p style={{fontSize: "1.6em", fontWeigth: "bold"}}>Ошибка</p>
        <p style={{fontSize: "1.3em", textAlign: "center"}}>{user.errorMessage}</p>
      </div>
    </div>
  );
};

export default ErrorModal
