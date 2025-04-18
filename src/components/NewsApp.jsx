import React, { useEffect, useState } from "react";
import Card from "./Card";

const NewsApp = () => {
  const [search, setSearch] = useState("technology");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("india");
  const API_KEY = import.meta.env.VITE_APP_NEWS_API_KEY;

  if (!API_KEY) {
    throw new Error("Missing News API Key - Check your .env file");
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timerId);
  }, [search]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${API_KEY}` +
          `&q=${encodeURIComponent(debouncedSearch)}` +
          `&language=en`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          setNewsData(data.results.slice(0, 12));
        } else {
          setNewsData([]);
        }
      } catch (err) {
        console.error("News fetch error:", err);
        setError(err.message || "Failed to fetch news. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [debouncedSearch, API_KEY]);

  const handleCategoryClick = (category) => {
    setSearch(category);
  };

  return (
    <div className="news-app">
      <nav className="nav-bar">
        <div className="nav-content">
          <h1 className="logo">NewsHub</h1>
          <div className="search-container">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for news..."
              className="search-input"
            />
            <button 
              className="search-btn"
              onClick={() => setDebouncedSearch(search)}
            >
              🔍
            </button>
          </div>
        </div>
      </nav>

      <div className="categories">
        {["technology", "business", "sports", "science", "entertainment"].map(
          (category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`category-btn ${
                debouncedSearch === category ? "active" : ""
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          )
        )}
      </div>

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          Loading latest news...
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && newsData.length === 0 && (
        <div className="no-results">
          No news found for "{debouncedSearch}". Try another search term.
        </div>
      )}

      {!loading && !error && newsData.length > 0 && (
        <>
          <h2 className="results-heading">
            Latest {debouncedSearch} news
          </h2>
          <Card articles={newsData} />
        </>
      )}
    </div>
  );
};

export default NewsApp;