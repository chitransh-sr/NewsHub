import React from "react";
import { Zap, ChevronRight } from "lucide-react";
import { getTrendingHeadlines } from "../data/mockNews";

const Ticker = ({ onSelectHeadline }) => {
  const headlines = getTrendingHeadlines();

  return (
    <div className="ticker-wrapper" aria-label="Breaking news updates">
      <div className="ticker-badge">
        <span className="ticker-pulse-dot"></span>
        <Zap size={14} className="ticker-zap" />
        <span className="ticker-label">BREAKING</span>
      </div>

      <div className="ticker-viewport">
        <div className="ticker-track">
          {/* Double track for seamless infinite scroll animation */}
          {[...headlines, ...headlines].map((item, idx) => (
            <div 
              key={`${item.id}-${idx}`} 
              className="ticker-item"
              onClick={() => onSelectHeadline && onSelectHeadline(item.text)}
            >
              <span className="ticker-cat">{item.category}</span>
              <span className="ticker-text">{item.text}</span>
              <ChevronRight size={13} className="ticker-arrow" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ticker;
