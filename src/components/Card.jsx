import React, { useState } from "react";
import { Clock, Bookmark, ArrowUpRight, Share2, Compass } from "lucide-react";
import { formatCategory, formatSource } from "../utils/format";

export const Card = ({ 
  articles, 
  onArticleClick, 
  onBookmarkToggle, 
  isBookmarked, 
  onShare 
}) => {
  if (!articles || !Array.isArray(articles) || articles.length === 0) {
    return null;
  }

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

  const getFallbackImage = (idx) => {
    const images = [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ];
    return images[idx % images.length];
  };

  return (
    <div className="news-cards-grid">
      {articles.map((article, index) => {
        const bookmarked = isBookmarked ? isBookmarked(article) : false;

        return (
          <article 
            key={article.article_id || article.link || index} 
            className="modern-news-card"
            style={{ animationDelay: `${(index % 8) * 60}ms` }}
            onClick={() => onArticleClick && onArticleClick(article)}
          >
            <div className="card-media-wrapper">
              <img 
                src={article.image_url || getFallbackImage(index)} 
                alt={article.title}
                className="card-image"
                loading="lazy"
                onError={(e) => {
                  e.target.src = getFallbackImage(index);
                }}
              />
              <div className="card-media-overlay"></div>
              
              <div className="card-floating-badges">
                <span className="card-category-tag">
                  {formatCategory(article.category, "NEWS")}
                </span>

                <div className="card-floating-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className={`card-action-circle ${bookmarked ? "saved" : ""}`}
                    onClick={() => onBookmarkToggle && onBookmarkToggle(article)}
                    title={bookmarked ? "Remove Bookmark" : "Save Story"}
                    aria-label="Bookmark"
                  >
                    <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
                  </button>
                  <button
                    className="card-action-circle"
                    onClick={() => onShare && onShare(article)}
                    title="Share story"
                    aria-label="Share"
                  >
                    <Share2 size={15} />
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="card-source-row">
                <span className="card-source">{formatSource(article.source_name || article.source_id)}</span>
                <span className="card-dot">•</span>
                <span className="card-time">
                  <Clock size={12} className="inline-clock" />
                  {formatTime(article.pubDate)}
                </span>
              </div>

              <h3 className="card-title" title={article.title}>
                {article.title}
              </h3>

              <p className="card-description">
                {article.description || "Click to explore the detailed coverage and primary sources for this developing report."}
              </p>

              <div className="card-footer">
                <span className="card-reading-estimate">
                  {article.reading_time || "4 min read"}
                </span>

                <span className="card-view-btn">
                  Read Story <ArrowUpRight size={15} className="card-arrow" />
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="news-cards-grid">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="modern-news-card skeleton-card">
          <div className="skeleton-media shimmer"></div>
          <div className="card-body">
            <div className="skeleton-line sm shimmer"></div>
            <div className="skeleton-line shimmer"></div>
            <div className="skeleton-line md shimmer"></div>
            <div className="skeleton-line shimmer" style={{ height: "40px", marginTop: "1rem" }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;