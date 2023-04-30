import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState(new Set());
  const [editingArticles, setEditingArticles] = useState(new Set());
  const [showSuccessSymbol, setShowSuccessSymbol] = useState(false);

  const handleDownloadJSON = () => {
    const json = JSON.stringify(searchResults, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "articles.json";
    a.click();
  };

  const handleEditArticle = (id) => {
    const newEditingArticles = new Set(editingArticles);
    if (newEditingArticles.has(id)) {
      newEditingArticles.delete(id);
    } else {
      newEditingArticles.add(id);
    }
    setEditingArticles(newEditingArticles);
  };
  
  const handleUpdateArticle = async (id, title, text) => {
    try {
      await axios.post("http://localhost:5000/update-article", {
        id,
        title,
        text,
      });
  
      const updatedArticleIndex = searchResults.findIndex((article) => article._id === id);
      const updatedSearchResults = [...searchResults];
      updatedSearchResults[updatedArticleIndex] = { ...updatedSearchResults[updatedArticleIndex], title, text };
      setSearchResults(updatedSearchResults);
  
      handleEditArticle(id);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };
  

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/add-article", {
        title,
        text,
      });

      if (response.data.result === "success") {
        // Replace the alert line with the following code
        setShowSuccessSymbol(true);
        setTimeout(() => {
          setShowSuccessSymbol(false);
        }, 5000); // Set the delay to 5 seconds; change to 7000 for 7 seconds

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
      <button onClick={handleSubmit} className="add-btn">Add</button>
      {showSuccessSymbol && (
        <span className="success-symbol" onAnimationEnd={() => setShowSuccessSymbol(false)}>added</span>
      )}

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
          <button onClick={handleSearch} className="search-btn">Search</button>
          <button onClick={handleRetrieveEverything} className="show-all-btn">
            Show All Articles
          </button>
        </div>
      </div>

      <h3>Search Results</h3>
      {selectedArticles.size > 0 && (
        <button onClick={handleRemoveSelected} className="remove-btn">Remove Selected</button>
      )}
      {searchResults.length > 0 && (
        <button onClick={handleDownloadJSON} className="download-btn">Download as JSON</button>
      )}
      <ul>
      {searchResults.map((article, index) => (
        <li key={index}>
          <input
            type="checkbox"
            onChange={(e) =>
              handleArticleSelection(article._id, e.target.checked)
            }
          />
          {editingArticles.has(article._id) ? (
            <>
              <input
                type="text"
                value={article.title}
                onChange={(e) =>
                  setSearchResults(
                    searchResults.map((art) =>
                      art._id === article._id
                        ? { ...art, title: e.target.value }
                        : art
                    )
                  )
                }
                className="article-input"
              />
              <textarea
                value={article.text}
                onChange={(e) =>
                  setSearchResults(
                    searchResults.map((art) =>
                      art._id === article._id
                        ? { ...art, text: e.target.value }
                        : art
                    )
                  )
                }
                className="article-textarea"
              />
            </>
          ) : (
            <>
              <h4 className="article-title">{article.title}</h4>
              <p>{article.text}</p>
            </>
          )}
          <button
            onClick={() =>
              editingArticles.has(article._id)
                ? handleUpdateArticle(article._id, article.title, article.text)
                : handleEditArticle(article._id)
            }
            className={editingArticles.has(article._id) ? "done-btn" : "edit-btn"}
            >
            {editingArticles.has(article._id) ? "Done" : "Edit"}
          </button>
        </li>
      ))}
      </ul>
    </div>
  );
}

export default App;