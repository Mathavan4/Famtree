import React, { useEffect, useRef } from 'react';
import { 
  Edit3, 
  UploadCloud, 
  Link2, 
  Trash2, 
  BookOpen, 
  X, 
  Heart 
} from 'lucide-react';
import './MemberContextMenu.css';

export default function MemberContextMenu({ 
  member, 
  position, // { x, y } in viewport coordinates
  onClose, 
  onEdit, 
  onUploadMemories, 
  onConnect, 
  onDelete,
  onOpenArchive
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!member) return null;

  // Clamp menu coordinates so it doesn't overflow screen
  const menuX = Math.min(Math.max(position.x, 20), window.innerWidth - 260);
  const menuY = Math.min(Math.max(position.y, 20), window.innerHeight - 300);

  return (
    <div 
      className="context-menu-backdrop" 
      onClick={onClose}
    >
      <div 
        ref={menuRef}
        className="member-context-menu"
        style={{ left: `${menuX}px`, top: `${menuY}px` }}
        onClick={(e) => e.stopPropagation()}
        role="menu"
        aria-label={`Options for ${member.firstName} ${member.lastName}`}
      >
        {/* Menu Header with Member Pill */}
        <div className="menu-header">
          <div className="menu-avatar-small">
            <img src={member.photoUrl} alt={member.firstName} />
          </div>
          <div className="menu-member-names">
            <strong className="menu-fullname">
              {member.firstName} {member.lastName}
            </strong>
            <span className="menu-pos-tag">{member.position}</span>
          </div>
          <button 
            type="button" 
            className="menu-close-btn" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={14} />
          </button>
        </div>

        {/* Menu Options List */}
        <div className="menu-items-list">
          <button 
            type="button" 
            className="menu-item-btn highlight-archive"
            onClick={() => { onClose(); onOpenArchive(member); }}
            role="menuitem"
          >
            <BookOpen size={16} className="menu-icon gold" />
            <div className="menu-item-text">
              <strong>View Memory Archive</strong>
              <span>Biographies, photos &amp; audio (or double-click)</span>
            </div>
          </button>

          <button 
            type="button" 
            className="menu-item-btn"
            onClick={() => { onClose(); onUploadMemories(member); }}
            role="menuitem"
          >
            <UploadCloud size={16} className="menu-icon" />
            <div className="menu-item-text">
              <strong>Upload Memories</strong>
              <span>Photos, videos, audio &amp; written stories</span>
            </div>
          </button>

          <button 
            type="button" 
            className="menu-item-btn"
            onClick={() => { onClose(); onConnect(member); }}
            role="menuitem"
          >
            <Link2 size={16} className="menu-icon" />
            <div className="menu-item-text">
              <strong>Connect Family Member</strong>
              <span>Define couple or parent-child link</span>
            </div>
          </button>

          <button 
            type="button" 
            className="menu-item-btn"
            onClick={() => { onClose(); onEdit(member); }}
            role="menuitem"
          >
            <Edit3 size={16} className="menu-icon" />
            <div className="menu-item-text">
              <strong>Edit Profile</strong>
              <span>Update photo, names &amp; biography</span>
            </div>
          </button>

          <div className="menu-divider" />

          <button 
            type="button" 
            className="menu-item-btn danger-item"
            onClick={() => { onClose(); onDelete(member); }}
            role="menuitem"
          >
            <Trash2 size={16} className="menu-icon danger" />
            <div className="menu-item-text">
              <strong>Delete Person</strong>
              <span>Safely remove from tree</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

