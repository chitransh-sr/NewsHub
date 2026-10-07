import React from "react";
import { X, Trash2, Bookmark, ArrowUpRight, BookOpen } from "lucide-react";

export const BookmarksDrawer = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="bookmarks-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-group">
            <Bookmark size={20} className="drawer-bookmark-icon" />
            <div>
              <h2 className="drawer-title">Saved Articles</h2>
              <span className="drawer-subtitle">{bookmarks.length} {bookmarks.length === 1 ? "story" : "stories"} saved offline</span>
            </div>
          </div>

          <button className="drawer-close-btn" onClick={onClose} aria-label="Close bookmarks">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content">
          {bookmarks.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-icon-bubble">
                <BookOpen size={32} />
              </div>
              <h3>Your reading list is empty</h3>
              <p>Bookmark any article while browsing to read it later or save reference stories.</p>
            </div>
          ) : (
            <div className="drawer-items-list">
              {bookmarks.map((article) => (
                <div 
                  key={article.article_id || article.link} 
                  className="drawer-item-card"
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                >
                  {article.image_url && (
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      className="drawer-item-thumb" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="drawer-item-info">
                    <span className="drawer-item-source">{article.source_name || "News Wire"}</span>
                    <h4 className="drawer-item-title">{article.title}</h4>
                    <div className="drawer-item-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="drawer-action-remove"
                        onClick={() => onRemoveBookmark(article)}
                        title="Remove bookmark"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {bookmarks.length > 0 && (
          <div className="drawer-footer">
            <button className="drawer-clear-btn" onClick={onClearAll}>
              <Trash2 size={15} /> Clear All Saved Stories
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default BookmarksDrawer;
