import { getDateFormat } from "../js/functions";
import "../styles/modals/comments.css";

const Comment = ({ data }) => {
  return (
    <div className="commentContainer">
      <img className="commentAvatar" src={data.imagePath} alt="Avatar" />
      <div className="commentInfo">
        <p className="commentatorInfo"><b>{data.name}</b> {getDateFormat(data.time)}</p>
        <p className="commentText">{data.text}</p>
      </div>
    </div>
  );
}

export default Comment
