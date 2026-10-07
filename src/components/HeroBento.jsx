import React from "react";
import { Clock, Bookmark, ArrowUpRight, Flame, Share2 } from "lucide-react";
import { formatCategory, formatSource } from "../utils/format";

export const HeroBento = ({ 
  articles, 
  onArticleClick, 
  onBookmarkToggle, 
  isBookmarked,
  onShare 
}) => {
  if (!articles || articles.length === 0) return null;

  const hero = articles[0];
  const spotlights = articles.slice(1, 3);

  const formatTime = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
      if (diffMinutes < 60) return `${Math.max(1, diffMinutes)}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  return (
    <section className="hero-bento-section" aria-label="Top stories bento showcase">
      <div className="bento-grid-container">
        {/* Main Hero Card */}
        {hero && (
          <div className="bento-main-hero" onClick={() => onArticleClick(hero)}>
            <div className="bento-hero-img-wrap">
              <img 
                src={hero.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80"} 
                alt={hero.title}
                className="bento-hero-img"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";
                }}
              />
              <div className="bento-hero-overlay"></div>
            </div>

            <div className="bento-hero-content">
              <div className="bento-hero-top-row">
                <span className="featured-pill">
                  <Flame size={13} className="inline-icon" /> FEATURED STORY
                </span>
                <div className="hero-action-buttons" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className={`bento-icon-btn ${isBookmarked(hero) ? "saved" : ""}`}
                    onClick={() => onBookmarkToggle(hero)}
                    title={isBookmarked(hero) ? "Remove Bookmark" : "Save Story"}
                    aria-label="Bookmark"
                  >
                    <Bookmark size={16} fill={isBookmarked(hero) ? "currentColor" : "none"} />
                  </button>
                  <button 
                    className="bento-icon-btn"
                    onClick={() => onShare(hero)}
                    title="Share story"
                    aria-label="Share"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              <h2 className="bento-hero-title">{hero.title}</h2>
              <p className="bento-hero-desc">{hero.description}</p>

              <div className="bento-hero-footer">
                <div className="bento-meta-group">
                  <span className="bento-source-name">{formatSource(hero.source_name || hero.source_id, "Global News")}</span>
                  <span className="bento-dot">•</span>
                  <span className="bento-time">
                    <Clock size={12} className="inline-clock" />
                    {formatTime(hero.pubDate)}
                  </span>
                  {hero.reading_time && (
                    <>
                      <span className="bento-dot">•</span>
                      <span className="bento-reading-time">{hero.reading_time}</span>
                    </>
                  )}
                </div>

                <span className="bento-read-btn">
                  Read Full <ArrowUpRight size={16} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Right Column Spotlights */}
        <div className="bento-side-column">
          {spotlights.map((item, index) => (
            <div 
              key={item.article_id || index}
              className="bento-spotlight-card"
              onClick={() => onArticleClick(item)}
            >
              <div className="bento-spotlight-img-wrap">
                <img 
                  src={item.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"} 
                  alt={item.title}
                  className="bento-spotlight-img"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="bento-spotlight-overlay"></div>
              </div>

              <div className="bento-spotlight-body">
                <div className="spotlight-top-meta">
                  <span className="spotlight-badge">
                    {formatCategory(item.category, "TRENDING")}
                  </span>
                  <button 
                    className={`bento-mini-bookmark ${isBookmarked(item) ? "saved" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookmarkToggle(item);
                    }}
                    title="Bookmark"
                    aria-label="Bookmark"
                  >
                    <Bookmark size={14} fill={isBookmarked(item) ? "currentColor" : "none"} />
                  </button>
                </div>

                <h3 className="bento-spotlight-title">{item.title}</h3>

                <div className="bento-spotlight-meta">
                  <span className="spotlight-source">{formatSource(item.source_name || item.source_id, "News Wire")}</span>
                  <span className="bento-dot">•</span>
                  <span className="spotlight-time">{formatTime(item.pubDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBento;
