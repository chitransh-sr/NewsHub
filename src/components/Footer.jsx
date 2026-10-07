import React, { useState } from "react";
import { Flame, Send, Globe, Shield, Radio, Heart } from "lucide-react";

export const Footer = ({ onSelectCategory, onShowToast }) => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      onShowToast && onShowToast({ message: "Please enter a valid email address", type: "error" });
      return;
    }
    onShowToast && onShowToast({ message: "Subscribed! You'll receive the Morning Briefing daily.", type: "success" });
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <span className="logo-icon-box">
                <Flame size={20} className="flame-icon" />
              </span>
              <span className="brand-text">
                NEWS<span className="brand-accent">HUB</span>
              </span>
            </div>
            <p className="footer-tagline">
              Delivering verified international journalism, technology breakthroughs, financial intelligence, and breaking global stories in real time.
            </p>
            <div className="footer-status-pill">
              <Radio size={13} className="pulse-green" />
              <span>Live Global Wire • 24/7 Monitored</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Desk Categories</h4>
            <ul className="footer-nav-list">
              <li><button onClick={() => onSelectCategory("technology")}>Technology & AI</button></li>
              <li><button onClick={() => onSelectCategory("business")}>Markets & Finance</button></li>
              <li><button onClick={() => onSelectCategory("science")}>Science & Space</button></li>
              <li><button onClick={() => onSelectCategory("sports")}>Global Sports</button></li>
              <li><button onClick={() => onSelectCategory("entertainment")}>Culture & Media</button></li>
            </ul>
          </div>

          <div className="footer-newsletter-col">
            <h4 className="footer-heading">The Morning Briefing</h4>
            <p className="newsletter-desc">
              Curated top 5 stories delivered to your inbox every morning at 07:00 UTC. Zero spam.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe">
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} NewsHub Media Inc. All rights reserved.</span>
            <span className="footer-dot">•</span>
            <span>Independent Digital Journalism</span>
          </div>
          <div className="footer-bottom-right">
            <span>Engineered with precision</span>
            <Heart size={14} className="text-red inline-icon" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
