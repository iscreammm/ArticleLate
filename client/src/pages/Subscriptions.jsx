import { useState } from "react";
import PostsList from "../components/PostsList";
import { useUser } from "../components/utilities/userContext";
import "../styles/news.css"

const Subscriptions = () => {
  const user = useUser();
  const [categor, setCategor] = useState();

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
          category={categor}
        />
      </div>
      <div className="categories">
        <ul className="categoriesList">
        <li className="categoryItem" onClick={() => setCategor(1)}>
            <img src="postfeed/it.PNG" alt="It" />
          </li>
          <li className="categoryItem" onClick={() => setCategor(2)}>
            <img src="postfeed/games.PNG" alt="Games" />
          </li>
          <li className="categoryItem" onClick={() => setCategor(3)}>
            <img src="postfeed/kino.PNG" alt="Kino" />
          </li>
          <li className="categoryItem" onClick={() => setCategor(4)}>
            <img src="postfeed/arts.PNG" alt="Arts" />
          </li>
          <li className="categoryItem" onClick={() => setCategor(5)}>
            <img src="postfeed/humor.PNG" alt="Humor" />
          </li>
          <li className="categoryItem" onClick={() => setCategor(6)}>
            <img src="postfeed/science.PNG" alt="Science" />
          </li>
          <li className="categoryItem" onClick={() => setCategor(7)}>
            <img src="postfeed/music.PNG" alt="Music" />
          </li>
          <li className="categoryItem" onClick={() => setCategor(8)}>
            <img src="postfeed/news.PNG" alt="News" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Subscriptions