import { useState } from "react";
import axios from "axios";
import { getDateFormat } from "../js/functions";
import { useUser } from "./utilities/userContext";
import "../styles/modals/comments.css";

const Comment = ({ data }) => {
  const user = useUser();
  const [text, setText] = useState(data.text);
  const [modifying, setModifying] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) {
    return <></>
  }

  const handleText = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="commentContainer">
      <img className="commentAvatar" src={data.imagePath} alt="Avatar" />
      <div className="commentInfo">
        <p className="commentatorInfo"><b>{data.name}</b> {getDateFormat(data.time)}</p>
        {modifying === false ? <p className="commentText">{text}</p> :
          <textarea className="commentInput modifyComment" name="commentMod"
            placeholder="Введите комментарий"
            maxLength={3000}
            value={text}
            onChange={handleText}
          >
          </textarea>
        }
      </div>
      {data.authorId !== user.id ? <></> :
        <div className="commentButtons">
          <button onClick={() => setModifying(true)}
            disabled={modifying}
          >
            <img className="modifyCommentBtn" src="common/logo.png" alt="Modify" />
          </button>
          <button onClick={() => {
              axios.delete(`http://localhost:8080/deleteComment?commentId=${data.id}`).then(result => {
                if (result.data.state === "Success") {
                  setDeleted(true);
                } else {
                  console.log(result.data.message)
                }
              });
            }}
          >
            <img className="modifyCommentBtn" src="common/logo.png" alt="Delete" />
          </button>
        </div>  
      }
      {!modifying ? <></> :
        <button className="saveComment"
          onClick={() => {
            axios.put(`http://localhost:8080/changeComment?commentId=${data.id}&commentText=${text}`).then(result => {
              if (result.data.state === "Success") {
                setModifying(false);
              } else {
                console.log(result.data.message)
              }
            });
          }}
        >
          Сохранить
        </button>
      }
    </div>
  );
}

export default Comment
