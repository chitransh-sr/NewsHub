import React from "react";

const Card = ({ articles }) => {
  if (!articles || !Array.isArray(articles)) {
    return <div>No articles to display</div>;
  }

  return (
    <div className="news-grid">
      {articles.map((article) => (
        <div key={article.article_id} className="news-card">
          <h3>{article.title}</h3>
          {article.image_url && (
            <img 
              src={article.image_url} 
              alt={article.title}
              className="news-image"
            />
          )}
          <p>{article.description}</p>
          <a 
            href={article.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="read-more"
          >
            Read full article
          </a>
          <div className="article-meta">
            <span>{article.source_name}</span>
            <span>{new Date(article.pubDate).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;