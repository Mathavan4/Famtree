import { useRef } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import './FamilyMemberNode.css';

export default function FamilyMemberNode({
  member,
  position = { x: 0, y: 0 },
  memoriesCount = 0,
  isSelected = false,
  isConnectHighlight = false,
  onNodeClick, // single click: opens contextual menu
  onNodeDoubleClick, // double click: opens personal memory archive
  onAddChildOrRelative, // clicking the + button on upper right
  hidePlus = false // if couple shared plus is used instead
}) {
  const clickTimeoutRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    // Discriminate between single and double clicks smoothly
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      if (onNodeDoubleClick) onNodeDoubleClick(member, e);
    } else {
      const nativeEvent = e;
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        if (onNodeClick) onNodeClick(member, nativeEvent);
      }, 240);
    }
  };

  const handlePlusClick = (e) => {
    e.stopPropagation();
    if (onAddChildOrRelative) {
      onAddChildOrRelative(member);
    }
  };

  return (
    <div 
      className={`family-node-item ${isSelected ? 'selected' : ''} ${isConnectHighlight ? 'connect-highlight' : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title={`${member.firstName} ${member.lastName} (${member.position}) - Single click for menu, double click for memory archive`}
    >
      {/* Circular Avatar Shell with Gold Bezel */}
      <div className="node-avatar-shell">
        <div className="avatar-circle-frame">
          <img 
            src={member.photoUrl} 
            alt={`${member.firstName} ${member.lastName}`}
            className="avatar-photo"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
            }}
          />
          <div className="avatar-sepia-tint" />
        </div>

        {/* Circular + Button on Upper-Right */}
        {!hidePlus && (
          <button 
            type="button" 
            className="node-upper-plus-btn"
            onClick={handlePlusClick}
            title={`Add family member related to ${member.firstName}`}
            aria-label={`Add relative for ${member.firstName}`}
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {/* Name and Position Caption Card (20-24px Fully Rounded) */}
      <div className="node-info-card">
        <span className="node-position-tag">{member.position || 'Family Member'}</span>
        <h4 className="node-person-name">
          {member.firstName} {member.lastName}
        </h4>

        {/* Small Preserved Memories Pill if memories exist */}
        {memoriesCount > 0 && (
          <div className="node-memories-badge" title={`${memoriesCount} memories preserved`}>
            <Sparkles size={11} className="badge-sparkle" />
            <span>{memoriesCount} {memoriesCount === 1 ? 'memory' : 'memories'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
