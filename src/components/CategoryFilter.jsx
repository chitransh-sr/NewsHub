import React from "react";
import { 
  Globe2, 
  Cpu, 
  TrendingUp, 
  Sparkles, 
  Trophy, 
  Film, 
  Hash 
} from "lucide-react";

const categories = [
  { id: "technology", label: "Technology", icon: Cpu },
  { id: "business", label: "Markets & Biz", icon: TrendingUp },
  { id: "science", label: "Science & Space", icon: Sparkles },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "entertainment", label: "Culture & Media", icon: Film }
];

const trendingTags = [
  "Artificial Intelligence",
  "Quantum Computing",
  "Clean Energy",
  "Global Economy",
  "Deep Space",
  "Biotech"
];

const CategoryFilter = ({ activeCategory, onSelectCategory, onTagClick }) => {
  return (
    <div className="filter-section-wrapper">
      <div className="category-tabs-container">
        <div className="category-tabs-scroll">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`category-pill-btn ${isActive ? "active" : ""}`}
                aria-pressed={isActive}
              >
                <Icon size={16} className="category-pill-icon" />
                <span>{cat.label}</span>
                {isActive && <span className="active-glow-dot"></span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="trending-tags-row">
        <div className="tags-label">
          <Hash size={13} />
          <span>TRENDING TOPICS:</span>
        </div>
        <div className="tags-scroll">
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className="trending-tag-btn"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
