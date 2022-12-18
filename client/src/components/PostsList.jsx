import { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import "../styles/feedPosts.css";

const PostsList = ({ queryString, category }) => {
  const [posts, setPosts] = useState();

  useEffect(() => {
    let query = queryString + (category !== undefined ? `&categoryId=${category}` : "");
    axios.get(query).then(result => {
      setPosts(JSON.parse(result.data.data));
      console.log(JSON.parse(result.data.data))
    });
  }, [category]);

  if (posts === undefined) {
    return <></>
  }

  if (posts.length === 0) {
    return <h2>В этой ленте ещё нет постов</h2>
  }
  
  return (
    <div className="postsContainer">
      {posts.map(post => {
        return <Post data={post} />
      })}
    </div>
  );
}

export default PostsList
