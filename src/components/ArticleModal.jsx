import React, { useEffect } from "react";
import { 
  X, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Clock, 
  Calendar, 
  Building2, 
  Volume2,
  Check
} from "lucide-react";

export const ArticleModal = ({ 
  article, 
  onClose, 
  isBookmarked, 
  onBookmarkToggle, 
  onShare 
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  if (!article) return null;

  const bookmarked = isBookmarked ? isBookmarked(article) : false;

  return (
    <div className="modal-backdrop-layer" onClick={onClose} role="dialog" aria-modal="true">
      <div className="article-reader-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-bar">
          <div className="modal-header-meta">
            <span className="modal-category-chip">
              {article.category ? article.category.toUpperCase() : "BREAKING"}
            </span>
            <span className="modal-source-pill">
              <Building2 size={13} className="inline-icon" /> {article.source_name || "Official Source"}
            </span>
          </div>

          <div className="modal-header-controls">
            <button 
              className={`modal-ctrl-btn ${bookmarked ? "saved" : ""}`}
              onClick={() => onBookmarkToggle && onBookmarkToggle(article)}
              title={bookmarked ? "Bookmarked" : "Save article"}
            >
              <Bookmark size={17} fill={bookmarked ? "currentColor" : "none"} />
            </button>
            <button 
              className="modal-ctrl-btn"
              onClick={() => onShare && onShare(article)}
              title="Share article"
            >
              <Share2 size={17} />
            </button>
            <button 
              className="modal-ctrl-btn close-btn" 
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        <div className="modal-scroll-body">
          <h1 className="modal-article-title">{article.title}</h1>

          <div className="modal-published-meta">
            <span className="meta-item">
              <Calendar size={14} className="inline-icon" />
              {new Date(article.pubDate || Date.now()).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
            <span className="meta-separator">•</span>
            <span className="meta-item">
              <Clock size={14} className="inline-icon" />
              {article.reading_time || "4 min read"}
            </span>
          </div>

          {article.image_url && (
            <div className="modal-feature-media">
              <img 
                src={article.image_url} 
                alt={article.title} 
                className="modal-feature-img"
              />
            </div>
          )}

          <div className="modal-article-body">
            <p className="modal-lead-paragraph">
              {article.description}
            </p>

            {article.content && (
              <div className="modal-extended-content">
                <p>{article.content}</p>
              </div>
            )}

            <div className="modal-disclaimer-box">
              <p>
                This story is curated via global digital distribution channels. For unedited source materials, follow the primary link below.
              </p>
            </div>
          </div>

          <div className="modal-action-footer">
            <a 
              href={article.link || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="modal-read-source-btn"
            >
              <span>Visit Publisher & Full Coverage</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
