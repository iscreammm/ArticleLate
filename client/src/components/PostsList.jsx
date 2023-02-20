import { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import "../styles/feedPosts.css";

const PostsList = ({ queryString, category, newPost, setNewPost }) => {
  const [posts, setPosts] = useState();

  useEffect(() => {
    let query = queryString + (category !== undefined ? `&categoryId=${category}` : "");
    axios.get(query).then(result => {
      setPosts(JSON.parse(result.data.data));
    });
  }, [category]);

  useEffect(() => {
    if (newPost) {
      setPosts(posts => [newPost, ...posts]);
      setNewPost(undefined);
    }
  }, [newPost]);

  if (posts === undefined) {
    return <></>
  }

  if (posts.length === 0) {
    return <h2 style={{padding: "5.55vw 0", fontSize: "1.5em", textAlign: "center"}}>В этой ленте ещё нет постов</h2>
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
