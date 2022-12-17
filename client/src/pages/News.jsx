import { useState } from "react";
import PostsList from "../components/PostsList";
import { useUser } from "../components/utilities/userContext";
import "../styles/news.css"

const News = () => {
  const user = useUser();
  const [category, setCategory] = useState();

  return (
    <div className="pageContainer">
      <div className="headersContainer">
        <div className="headerLeft">
          <img src="postfeed/newsheader.PNG" alt="NewsHeader" />
        </div>
        <div className="headerRight">
          <img src="postfeed/categoriesheader.PNG" alt="NewsHeader" />
        </div>
      </div>
      <div className="feed">
        <PostsList queryString={`http://localhost:8080/getPosts?userId=${user.id}`}
          category={category}
        />
      </div>
      <div className="categories">
        <ul className="categoriesList">
          <li className="categoryItem">
            <img src="postfeed/it.PNG" onClick={() => setCategory(1)} alt="It" />
          </li>
          <li className="categoryItem">
            <img src="postfeed/games.PNG" onClick={() => setCategory(2)} alt="Games" />
          </li>
          <li className="categoryItem">
            <img src="postfeed/kino.PNG" onClick={() => setCategory(3)} alt="Kino" />
          </li>
          <li className="categoryItem">
            <img src="postfeed/arts.PNG" onClick={() => setCategory(4)} alt="Arts" />
          </li>
          <li className="categoryItem">
            <img src="postfeed/humor.PNG" onClick={() => setCategory(5)} alt="Humor" />
          </li>
          <li className="categoryItem">
            <img src="postfeed/science.PNG" onClick={() => setCategory(6)} alt="Science" />
          </li>
          <li className="categoryItem">
            <img src="postfeed/music.PNG" onClick={() => setCategory(7)} alt="Music" />
          </li>
          <li className="categoryItem">
            <img src="postfeed/news.PNG" onClick={() => setCategory(8)} alt="News" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default News
