import React, { useState, useEffect } from "react";
import { 
  Search, 
  Moon, 
  Sun, 
  Bookmark, 
  KeyRound, 
  X, 
  Compass, 
  Flame, 
  Radio
} from "lucide-react";

const Navbar = ({
  search,
  setSearch,
  onSearchSubmit,
  darkMode,
  setDarkMode,
  bookmarksCount,
  onOpenBookmarks,
  onOpenSettings,
  hasApiKey
}) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric"
        }) + " • " + now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit"
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearchSubmit();
    }
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-top-bar">
        <div className="navbar-top-inner">
          <div className="top-meta-left">
            <span className="live-edition-badge">
              <span className="live-pulse"></span>
              LIVE PULSE
            </span>
            <span className="top-divider">|</span>
            <span className="time-display">{currentTime}</span>
          </div>

          <div className="top-meta-right">
            <span className={`api-indicator-pill ${hasApiKey ? "active" : "demo"}`}>
              <Radio size={12} className={hasApiKey ? "text-emerald" : "text-amber"} />
              {hasApiKey ? "Live API Feed" : "Curated Edition"}
            </span>
            <button 
              className="top-action-btn"
              onClick={onOpenSettings}
              title="Configure API Key & Preferences"
            >
              <KeyRound size={13} />
              <span>{hasApiKey ? "API Connected" : "Connect API"}</span>
            </button>
          </div>
        </div>
      </div>

      <nav className="navbar-main">
        <div className="navbar-container">
          <div className="logo-group">
            <a href="/" className="brand-logo" onClick={(e) => { e.preventDefault(); setSearch(""); onSearchSubmit(); }}>
              <span className="logo-icon-box">
                <Flame size={20} className="flame-icon" />
              </span>
              <span className="brand-text">
                NEWS<span className="brand-accent">HUB</span>
              </span>
            </a>
            <span className="edition-tag">Global</span>
          </div>

          <div className="nav-search-bar">
            <div className="search-input-wrapper">
              <Search size={18} className="search-lead-icon" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search headlines, topics, or trends..."
                className="header-search-input"
              />
              {search && (
                <button 
                  className="search-clear-btn"
                  onClick={() => { setSearch(""); onSearchSubmit(); }}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <button 
              className="search-submit-btn"
              onClick={onSearchSubmit}
              title="Search"
            >
              Search
            </button>
          </div>

          <div className="nav-actions">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="theme-toggle-btn"
              aria-label="Toggle theme"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={19} className="theme-sun" /> : <Moon size={19} className="theme-moon" />}
            </button>

            <button
              onClick={onOpenBookmarks}
              className="bookmarks-toggle-btn"
              aria-label="View Saved Articles"
              title="Saved Articles"
            >
              <Bookmark size={19} />
              {bookmarksCount > 0 && (
                <span className="bookmark-counter-badge">{bookmarksCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
