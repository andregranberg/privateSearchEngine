import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState(new Set());

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

  const handleArticleSelection = (id, isSelected) => {
    const newSelectedArticles = new Set(selectedArticles);
    if (isSelected) {
      newSelectedArticles.add(id);
    } else {
      newSelectedArticles.delete(id);
    }
    setSelectedArticles(newSelectedArticles);
  };

  const handleRemoveSelected = async () => {
    try {
      await axios.post("http://localhost:5000/remove-articles", {
        articleIds: Array.from(selectedArticles),
      });
  
      // Filter out the removed articles from the searchResults state
      setSearchResults(searchResults.filter((article) => !selectedArticles.has(article._id)));
  
      setSelectedArticles(new Set());
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  const handleRetrieveEverything = async () => {
    try {
      const response = await axios.get("http://localhost:5000/retrieve-everything");
  
      setSearchResults(response.data.articles);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="container">
      <h1>The Information Bank</h1>
      <h2>New Information</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="article-input"
        />
      </div>
      <div>
        <label>Text:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="article-textarea"
        />
      </div>
      <button onClick={handleSubmit}>Add</button>

      <div>
        <h2>Find Information</h2>
        <div className="search-controls">
          <label>Search:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleRetrieveEverything} className="show-all-btn">
            Show All Articles
          </button>
        </div>
      </div>

      <h3>Search Results</h3>
      <button onClick={handleRemoveSelected}>Remove Selected</button>
      <ul>
        {searchResults.map((article, index) => (
          <li key={index}>
            <input
              type="checkbox"
              onChange={(e) =>
                handleArticleSelection(article._id, e.target.checked)
              }
            />
            <h4 className="article-title">{article.title}</h4>
            <p>{article.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;