import { useState } from "react";
import PostsList from "../components/PostsList";
import { useUser } from "../components/utilities/userContext";
import "../styles/news.css"

const Subscriptions = () => {
  const user = useUser();
  const [category, setCategory] = useState();

  return (
    <div className="pageContainer">
      <div className="headersContainer">
        <div className="headerLeft">
          <img src="postfeed/subsheader.PNG" alt="NewsHeader" />
        </div>
        <div className="headerRight">
          <img src="postfeed/categoriesheader.PNG" alt="NewsHeader" />
        </div>
      </div>
      <div className="feed">
        <PostsList queryString={`http://localhost:8080/getSubPosts?userId=${user.id}`}
          category={category}
        />
      </div>
      <div className="categories">
        <ul className="categoriesList">
        <li className="categoryItem" onClick={() => setCategory(1)}>
            <img src="postfeed/it.PNG" alt="It" />
          </li>
          <li className="categoryItem" onClick={() => setCategory(2)}>
            <img src="postfeed/games.PNG" alt="Games" />
          </li>
          <li className="categoryItem" onClick={() => setCategory(3)}>
            <img src="postfeed/kino.PNG" alt="Kino" />
          </li>
          <li className="categoryItem" onClick={() => setCategory(4)}>
            <img src="postfeed/arts.PNG" alt="Arts" />
          </li>
          <li className="categoryItem" onClick={() => setCategory(5)}>
            <img src="postfeed/humor.PNG" alt="Humor" />
          </li>
          <li className="categoryItem" onClick={() => setCategory(6)}>
            <img src="postfeed/science.PNG" alt="Science" />
          </li>
          <li className="categoryItem" onClick={() => setCategory(7)}>
            <img src="postfeed/music.PNG" alt="Music" />
          </li>
          <li className="categoryItem" onClick={() => setCategory(8)}>
            <img src="postfeed/news.PNG" alt="News" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Subscriptions