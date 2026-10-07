import React, { useState } from "react";
import { X, KeyRound, Check, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

export const ApiKeyModal = ({
  isOpen,
  onClose,
  currentApiKey,
  onSaveApiKey,
  onClearApiKey
}) => {
  const [keyValue, setKeyValue] = useState(currentApiKey || "");

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(keyValue.trim());
    onClose();
  };

  const handleClear = () => {
    setKeyValue("");
    onClearApiKey();
    onClose();
  };

  return (
    <div className="modal-backdrop-layer" onClick={onClose} role="dialog">
      <div className="api-key-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-bar">
          <div className="modal-header-meta">
            <span className="modal-category-chip">PREFERENCES</span>
            <span className="modal-source-pill">
              <KeyRound size={13} className="inline-icon" /> News API Configuration
            </span>
          </div>
          <button className="modal-ctrl-btn close-btn" onClick={onClose} aria-label="Close">
            <X size={19} />
          </button>
        </div>

        <div className="api-modal-content">
          <div className="api-banner">
            <div className="api-banner-icon">
              <Sparkles size={24} />
            </div>
            <div>
              <h3>NewsData.io API Connection</h3>
              <p>
                Connect your personal API key for unrestricted live international news queries, or browse with NewsHub's high-fidelity curated global feed.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="api-key-form">
            <label htmlFor="api-key-input" className="form-label">
              NewsData.io API Key
            </label>
            <div className="input-group">
              <input
                id="api-key-input"
                type="password"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                placeholder="pub_xxxxxxxxxxxxxxxxxxxxxxxxx"
                className="api-input"
              />
            </div>
            <p className="input-hint">
              Keys are stored securely in your local browser session and never sent to third-party tracking servers.
            </p>

            <div className="api-actions-row">
              {currentApiKey && (
                <button 
                  type="button" 
                  onClick={handleClear}
                  className="btn-danger-outline"
                >
                  Clear Key & Use Demo Mode
                </button>
              )}
              <div className="spacer"></div>
              <button 
                type="button" 
                onClick={onClose} 
                className="btn-ghost"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
              >
                <Check size={16} /> Save & Apply
              </button>
            </div>
          </form>

          <div className="api-footer-info">
            <div className="info-badge">
              <ShieldCheck size={16} className="text-emerald" />
              <span>Free tier keys include 200 requests/day.</span>
            </div>
            <a 
              href="https://newsdata.io/register" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="register-link"
            >
              Get free API key at NewsData.io <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
