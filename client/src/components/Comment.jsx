import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getDateFormat } from "../js/functions";
import { useUser } from "./utilities/userContext";
import "../styles/modals/comments.css";

const Comment = ({ data }) => {
  const user = useUser();
  const [text, setText] = useState(data.text);
  const [textElem, setTextElem] = useState();
  const [modifying, setModifying] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    addLinks();
  }, []);
  
  if (deleted) {
    return <></>
  }

  async function addLinks() {
    let temp = text;
    const reg = new RegExp("@\\w{1,30}", "g");
    let matches = temp.match(reg);
    let result = [];
    let start;
    let end;

    if (matches) {
      for (let i = 0; i < matches.length; i++) {
        if(i === 0) {
          start = temp.indexOf(matches[i]);
          end = start + matches[i].length;
          console.log(matches[i].slice(1))
          result.push(temp.slice(0, start));
          await axios.get(`http://localhost:8080/verifyIdentificator?identificator=${matches[i].slice(1)}&userId=${user.id}`).then(res => {
            if (res.data.state === "Success") {
              if (res.data.data) {
                result.push(<Link key={matches[i]} to={`/profile/${matches[i].slice(1)}`}>{matches[i]}</Link>);
              } else {
                result.push(matches[i]);
              }
            }
          })
        } else {
          start = temp.indexOf(matches[i]);
          result.push(temp.slice(end, start));

          end = start + matches[i].length;
          await axios.get(`http://localhost:8080/verifyIdentificator?identificator=${matches[i].slice(1)}&userId=${user.id}`).then(res => {
            if (res.data.state === "Success") {
              if (res.data.data) {
                result.push(
                  <Link key={matches[i]} to={`/profile/${matches[i].slice(1)}`}
                    onClick={() => user.toggleComments()}
                  >{matches[i]}</Link>
                );
              } else {
                result.push(matches[i]);
              }
            }
          })
          
          if (i === (matches.length - 1)) {
            result.push(temp.slice(end, temp.length));
          }
        }
      }
      setTextElem(result);
    }
  };

  const handleText = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="commentContainer">
      <Link to={`/profile/${data.identificator}`}>
        <img className="commentAvatar" src={data.imagePath} alt="Avatar" />
      </Link>
      <div className="commentInfo">
        <p className="commentatorInfo"><b>{data.name}</b> {getDateFormat(data.time)}</p>
        {modifying === false ? <p className="commentText">{textElem ? textElem : text}</p> :
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
            <img src="common/edit.jpg" alt="Modify" />
          </button>
          <button onClick={() => {
              axios.delete(`http://localhost:8080/deleteComment?commentId=${data.id}`).then(result => {
                if (result.data.state === "Success") {
                  setDeleted(true);
                } else {
                  user.setErrorMessage(result.data.message);
                  user.toggleError();
                }
              });
            }}
          >
            <img src="common/delete.jpg" alt="Delete" />
          </button>
        </div>  
      }
      {!modifying ? <></> :
        <button className="saveComment"
          onClick={() => {
            axios.put(`http://localhost:8080/changeComment?commentId=${data.id}&commentText=${text}`).then(result => {
              if (result.data.state === "Success") {
                addLinks();
                setModifying(false);
              } else {
                user.setErrorMessage(result.data.message);
                user.toggleError();
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
