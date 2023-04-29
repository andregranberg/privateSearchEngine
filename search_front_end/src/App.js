import React, { useState } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/add-article", {
        title,
        text,
      });

      if (response.data.result === "success") {
        alert("Article added successfully!");
        setTitle("");
        setText("");
      } else {
        alert("An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post("http://localhost:5000/search-articles", {
        query: searchQuery,
      });

      setSearchResults(response.data.articles);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div>
      <h1>Add Article</h1>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Text:</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <button onClick={handleSubmit}>Submit</button>

      <h2>Search Articles</h2>
      <div>
        <label>Search:</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <h3>Search Results</h3>
      <ul>
        {searchResults.map((article, index) => (
          <li key={index}>
            <h4>{article.title}</h4>
            <p>{article.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;