import { useState, useEffect } from "react";
import axios from "axios";
import Comment from "./Comment";

const CommentsList = ({ postId }) => {
  const [comments, setComments] = useState();

  useEffect(() => {
    axios.get(`http://localhost:8080/getComments?postId=${postId}`).then(result => {
      setComments(JSON.parse(result.data.data))
    });
  }, []);

  if ((comments === undefined) || (comments.length === 0)) {
    return <></>
  }
  
  return (
    <div className="commentsContainer">
      {comments.map(comment => {
        return <Comment key={comment.id} data={comment} />
      })}
    </div>
  );
}

export default CommentsList
