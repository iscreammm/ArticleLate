import "../styles/news.css"

const News = () => {
  return (
    <div className="feedContainer">
      <div className="headersContainer">
        <div className="headerLeft">
          <img src="postfeed/newsheader.PNG" alt="NewsHeader" />
        </div>
        <div className="headerRight">
          <img src="postfeed/categoriesheader.PNG" alt="NewsHeader" />
        </div>
      </div>
      <div className="feed">
        fghjkl;
      </div>
      <div className="categories">
        <ul className="categoriesList">
          <li className="categoryItem"> <img src="postfeed/it.PNG" alt="It" /> </li>
          <li className="categoryItem"> <img src="postfeed/games.PNG" alt="Games" /> </li>
          <li className="categoryItem"> <img src="postfeed/kino.PNG" alt="Kino" /> </li>
          <li className="categoryItem"> <img src="postfeed/arts.PNG" alt="Arts" /> </li>
          <li className="categoryItem"> <img src="postfeed/humor.PNG" alt="Humor" /> </li>
          <li className="categoryItem"> <img src="postfeed/science.PNG" alt="Science" /> </li>
          <li className="categoryItem"> <img src="postfeed/music.PNG" alt="Music" /> </li>
          <li className="categoryItem"> <img src="postfeed/news.PNG" alt="News" /> </li>
        </ul>
      </div>
    </div>
  );
}

export default News
