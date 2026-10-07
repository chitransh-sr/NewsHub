import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";
import Ticker from "./Ticker";
import CategoryFilter from "./CategoryFilter";
import HeroBento from "./HeroBento";
import Card, { CardSkeleton } from "./Card";
import ArticleModal from "./ArticleModal";
import BookmarksDrawer from "./BookmarksDrawer";
import ApiKeyModal from "./ApiKeyModal";
import Footer from "./Footer";
import Toast from "./Toast";
import { fallbackArticles } from "../data/mockNews";
import { ArrowUp, RefreshCw, AlertTriangle, Sparkles } from "lucide-react";

const NewsApp = () => {
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("technology");
  const [queryTerm, setQueryTerm] = useState("technology");

  // Data State
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Theme & Preferences State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("newshub_dark_mode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("newshub_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // API Key State
  const [apiKey, setApiKey] = useState(() => {
    return (
      localStorage.getItem("newshub_api_key") ||
      import.meta.env.VITE_APP_NEWS_API_KEY ||
      ""
    );
  });

  // Modals & Drawers
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync theme to root class & localStorage
  useEffect(() => {
    localStorage.setItem("newshub_dark_mode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("newshub_bookmarks", JSON.stringify(bookmarks));
    } catch (e) {
      console.warn("Failed to persist bookmarks", e);
    }
  }, [bookmarks]);

  // Scroll detection for back-to-top button
  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((msgObj) => {
    setToast(msgObj);
  }, []);

  // Debounced search input sync
  useEffect(() => {
    if (search.trim()) {
      const timer = setTimeout(() => {
        setQueryTerm(search.trim());
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [search]);

  // Main News Fetcher
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    // If an API key is available, attempt live fetch
    if (apiKey) {
      try {
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(
            queryTerm
          )}&language=en`
        );

        if (!response.ok) {
          throw new Error(`NewsData API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
          setNewsData(data.results.slice(0, 15));
          setUsingFallback(false);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Live API fetch failed, switching to curated feed:", err);
        setError("Live API unavailable or limit reached. Displaying verified curated feed.");
      }
    }

    // Curated fallback data
    setUsingFallback(true);
    const categoryKey = activeCategory || "technology";
    const fallbackList = fallbackArticles[categoryKey] || fallbackArticles.technology;

    // Filter by query if user searched
    let filtered = fallbackList;
    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = Object.values(fallbackArticles)
        .flat()
        .filter(
          (art) =>
            art.title.toLowerCase().includes(term) ||
            art.description.toLowerCase().includes(term)
        );
    }

    // Delay slightly to give natural feedback
    setTimeout(() => {
      setNewsData(filtered);
      setLoading(false);
    }, 250);
  }, [apiKey, queryTerm, activeCategory, search]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Category Selection
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSearch("");
    setQueryTerm(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Tag Selection
  const handleTagClick = (tag) => {
    setSearch(tag);
    setQueryTerm(tag);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Search Submit
  const handleSearchSubmit = () => {
    if (search.trim()) {
      setQueryTerm(search.trim());
    } else {
      setQueryTerm(activeCategory);
    }
  };

  // Bookmark Management
  const isBookmarked = useCallback(
    (article) => {
      if (!article) return false;
      const id = article.article_id || article.link;
      return bookmarks.some((b) => (b.article_id || b.link) === id);
    },
    [bookmarks]
  );

  const handleBookmarkToggle = useCallback(
    (article) => {
      if (!article) return;
      const id = article.article_id || article.link;
      const exists = bookmarks.some((b) => (b.article_id || b.link) === id);

      if (exists) {
        setBookmarks((prev) => prev.filter((b) => (b.article_id || b.link) !== id));
        showToast({ message: "Article removed from reading list", type: "info" });
      } else {
        setBookmarks((prev) => [article, ...prev]);
        showToast({ message: "Article saved to reading list", type: "success" });
      }
    },
    [bookmarks, showToast]
  );

  const handleRemoveBookmark = (article) => {
    const id = article.article_id || article.link;
    setBookmarks((prev) => prev.filter((b) => (b.article_id || b.link) !== id));
    showToast({ message: "Article removed", type: "info" });
  };

  const handleClearAllBookmarks = () => {
    setBookmarks([]);
    showToast({ message: "Reading list cleared", type: "info" });
  };

  // Share functionality
  const handleShare = (article) => {
    if (!article) return;
    const url = article.link || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast({ message: "Article link copied to clipboard!", type: "success" });
    } else {
      showToast({ message: "Shared link: " + url, type: "info" });
    }
  };

  // API Key handlers
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("newshub_api_key", key);
    showToast({ message: "API key updated! Refreshing feed...", type: "success" });
  };

  const handleClearApiKey = () => {
    setApiKey("");
    localStorage.removeItem("newshub_api_key");
    showToast({ message: "Switched to Curated Demo Feed", type: "info" });
  };

  // Split newsData into Hero Bento (first 3) and Feed Grid (remaining)
  const heroArticles = newsData.slice(0, 3);
  const remainingArticles = newsData.slice(3);

  return (
    <div className={`news-app-root ${darkMode ? "dark" : "light"}`}>
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Primary Sticky World-Class Navigation */}
      <Navbar
        search={search}
        setSearch={setSearch}
        onSearchSubmit={handleSearchSubmit}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        bookmarksCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenSettings={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Breaking News Marquee */}
      <Ticker onSelectHeadline={(headline) => handleTagClick(headline)} />

      <main className="main-content-flow">
        {/* Categories & Trending Pills */}
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
          onTagClick={handleTagClick}
        />

        {/* Status / Feed Notice Banner */}
        {usingFallback && !apiKey && (
          <div className="demo-notice-bar">
            <Sparkles size={16} className="text-amber" />
            <span>
              Browsing curated high-res global feed. Want live queries? Click{" "}
              <button onClick={() => setIsApiKeyModalOpen(true)} className="notice-link-btn">
                Connect API Key
              </button>{" "}
              to unlock unlimited international queries.
            </span>
          </div>
        )}

        {/* Error Notice if API failed */}
        {error && (
          <div className="api-error-banner">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="content-container">
            <CardSkeleton />
          </div>
        )}

        {/* Content Area */}
        {!loading && newsData.length > 0 && (
          <div className="content-container">
            {/* Bento Grid Editorial Showcase */}
            {!search && heroArticles.length > 0 && (
              <HeroBento
                articles={heroArticles}
                onArticleClick={(art) => setSelectedArticle(art)}
                onBookmarkToggle={handleBookmarkToggle}
                isBookmarked={isBookmarked}
                onShare={handleShare}
              />
            )}

            {/* Section Heading */}
            <div className="section-header-row">
              <div className="heading-group">
                <span className="section-eyebrow">
                  {search ? "SEARCH RESULTS" : `${(typeof activeCategory === "string" ? activeCategory : "NEWS").toUpperCase()} DESK`}
                </span>
                <h2 className="section-main-title">
                  {search ? `Headlines matching "${search}"` : `Latest in ${activeCategory}`}
                </h2>
              </div>

              <button 
                onClick={fetchNews} 
                className="refresh-btn"
                title="Refresh feed"
                disabled={loading}
              >
                <RefreshCw size={15} className={loading ? "spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Main Cards Grid */}
            <Card
              articles={search ? newsData : (remainingArticles.length > 0 ? remainingArticles : newsData)}
              onArticleClick={(art) => setSelectedArticle(art)}
              onBookmarkToggle={handleBookmarkToggle}
              isBookmarked={isBookmarked}
              onShare={handleShare}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && newsData.length === 0 && (
          <div className="empty-results-box">
            <div className="empty-results-icon">🔍</div>
            <h3>No stories found for "{queryTerm}"</h3>
            <p>Try searching for a broader term like AI, energy, space, or select a category above.</p>
            <button 
              onClick={() => handleCategorySelect("technology")}
              className="btn-primary"
            >
              Browse Top Stories
            </button>
          </div>
        )}
      </main>

      {/* Immersive Article Modal Reader */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          isBookmarked={isBookmarked}
          onBookmarkToggle={handleBookmarkToggle}
          onShare={handleShare}
        />
      )}

      {/* Bookmarks Slide-over Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectArticle={(art) => setSelectedArticle(art)}
        onRemoveBookmark={handleRemoveBookmark}
        onClearAll={handleClearAllBookmarks}
      />

      {/* API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentApiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        onClearApiKey={handleClearApiKey}
      />

      {/* Back to top floating button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="scroll-top-btn"
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* Luxury Editorial Footer */}
      <Footer
        onSelectCategory={handleCategorySelect}
        onShowToast={showToast}
      />
    </div>
  );
};

export default NewsApp;