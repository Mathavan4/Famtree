import React from 'react';
import { Plus, RotateCcw, Sparkles, Trash2, Heart, Layers } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ 
  membersCount = 0, 
  memoriesCount = 0, 
  onAddMember, 
  onResetView, 
  onLoadSample, 
  onClearAll 
}) {
  return (
    <header className="legacy-navbar" role="banner">
      <div className="navbar-inner">
        {/* Brand Identity */}
        <div className="brand-group" onClick={onResetView} role="button" tabIndex={0} title="Family Legacy Home">
          <div className="brand-tree-emblem">
            <svg 
              className="tree-svg" 
              viewBox="0 0 36 36" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path 
                d="M18 32V18M18 18C18 13 11 11 7 8M18 18C18 13 25 11 29 8M18 24C14 22 10 20 8 16M18 22C22 20 26 18 28 15" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <circle cx="7" cy="8" r="2.4" fill="var(--color-gold)" />
              <circle cx="29" cy="8" r="2.4" fill="var(--color-gold)" />
              <circle cx="18" cy="6" r="3" fill="var(--color-forest)" stroke="var(--color-gold)" strokeWidth="1.5" />
              <circle cx="8" cy="16" r="2" fill="var(--color-gold-warm)" />
              <circle cx="28" cy="15" r="2" fill="var(--color-gold-warm)" />
            </svg>
          </div>
          <div className="brand-copy">
            <span className="brand-title">Family Legacy</span>
            <span className="brand-tagline">Digital Memory Archive</span>
          </div>
        </div>

        {/* Center: Live Lineage Stats when members exist */}
        {membersCount > 0 && (
          <div className="navbar-stats-pill">
            <Layers size={14} className="stats-icon" />
            <span className="stats-text">
              <strong>{membersCount}</strong> {membersCount === 1 ? 'Family Member' : 'Family Members'} &bull; <strong>{memoriesCount}</strong> Preserved Memories
            </span>
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="navbar-actions">
          {membersCount > 0 ? (
            <>
              <button 
                type="button" 
                className="nav-btn-icon"
                onClick={onResetView}
                title="Center Tree Canvas"
                aria-label="Center tree view"
              >
                <RotateCcw size={16} />
              </button>

              <button 
                type="button" 
                className="btn-primary nav-add-btn"
                onClick={() => onAddMember()}
              >
                <Plus size={16} />
                <span>Add Member</span>
              </button>

              <button 
                type="button" 
                className="nav-btn-ghost-danger"
                onClick={onClearAll}
                title="Clear tree to test empty screen"
                aria-label="Clear all members"
              >
                <Trash2 size={15} />
                <span className="clear-text">Start Fresh</span>
              </button>
            </>
          ) : (
            <button 
              type="button" 
              className="btn-secondary nav-sample-btn"
              onClick={onLoadSample}
              title="Load pre-built multi-generational family archive to explore"
            >
              <Sparkles size={15} className="gold-sparkle" />
              <span>Load Sample Family</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

