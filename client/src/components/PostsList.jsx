import { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import "../styles/feedPosts.css";
import { useUser } from "./utilities/userContext";

const PostsList = ({ queryString, category }) => {
  const user = useUser();
  const [posts, setPosts] = useState();

  useEffect(() => {
    let query = queryString + (category !== undefined ? `&categoryId=${category}` : "");
    axios.get(query).then(result => {
      setPosts(JSON.parse(result.data.data));
    });
  }, [category]);

  useEffect(() => {
    if (user.loadPost) {
      axios.get(`http://localhost:8080/getUserPosts?userId=${user.id}`).then(result => {
        if (result.data.state === "Success") {
          setPosts(posts => [{...JSON.parse(result.data.data)[0]}, ...posts]);
          user.setLoadPost(undefined);
        } else {
          user.setErrorMessage("Не удалось загрузить добавленный пост");
          user.toggleError();
        }
      });
    }
  }, [user.loadPost]);

  if (posts === undefined) {
    return <></>
  }

  if (posts.length === 0) {
    return <h2>В этой ленте ещё нет постов</h2>
  }
  
  return (
    <div className="postsContainer">
      {posts.map(post => {
        return <Post key={post.id} data={post} />
      })}
    </div>
  );
}

export default PostsList
