import React, { useState } from 'react';
import { X, Link2, Heart, Users, Check, ArrowRight } from 'lucide-react';
import './RelationshipModal.css';

const RELATIONSHIP_TYPES = [
  { id: 'couple', label: 'Husband / Wife', icon: Heart, description: 'Display next to each other as a couple with a shared family addition point' },
  { id: 'father-son', label: 'Father to Son', icon: Users, description: 'Direct generational descent from father to son' },
  { id: 'father-daughter', label: 'Father to Daughter', icon: Users, description: 'Direct generational descent from father to daughter' },
  { id: 'mother-son', label: 'Mother to Son', icon: Users, description: 'Direct generational descent from mother to son' },
  { id: 'mother-daughter', label: 'Mother to Daughter', icon: Users, description: 'Direct generational descent from mother to daughter' },
  { id: 'sibling', label: 'Brother / Sister', icon: Users, description: 'Shared sibling branch under same generation' },
  { id: 'other', label: 'Other Kinship / Custom', icon: Link2, description: 'Custom relationship label' }
];

export default function RelationshipModal({
  isOpen,
  sourceMember,
  members = [],
  onClose,
  onSaveRelationship
}) {
  const [targetMemberId, setTargetMemberId] = useState('');
  const [selectedRelType, setSelectedRelType] = useState('couple');
  const [customLabel, setCustomLabel] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !sourceMember) return null;

  // Filter out the source member themselves
  const eligibleMembers = members.filter(m => m.id !== sourceMember.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetMemberId) {
      setError('Please choose a family member to connect with.');
      return;
    }

    const relObj = {
      id: `rel-${Date.now()}`,
      personAId: sourceMember.id,
      personBId: targetMemberId,
      type: selectedRelType === 'couple' ? 'couple' : 'parent-child',
      label: selectedRelType === 'other' ? (customLabel.trim() || 'Kinship') : RELATIONSHIP_TYPES.find(r => r.id === selectedRelType)?.label,
      createdAt: new Date().toISOString()
    };

    onSaveRelationship(relObj);
    onClose();
  };

  const targetMember = members.find(m => m.id === targetMemberId);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card relationship-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-badge-group">
            <span className="header-badge-pip" />
            <span className="header-badge-text">Lineage Kinship</span>
          </div>
          <h2 className="modal-title">Connect Family Relationship</h2>
          <p className="modal-subtitle">
            Link <strong>{sourceMember.firstName} {sourceMember.lastName}</strong> with another family member in the living tree.
          </p>

          <button 
            type="button" 
            className="modal-close-icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form-scrollable">
          {error && (
            <div className="form-error-banner" role="alert">
              <span>{error}</span>
            </div>
          )}

          {/* Visual Connection Preview Pills */}
          <div className="kinship-preview-stage">
            <div className="preview-node">
              <div className="node-avatar-circle">
                <img src={sourceMember.photoUrl} alt={sourceMember.firstName} />
              </div>
              <strong className="node-name">{sourceMember.firstName}</strong>
              <span className="node-role">{sourceMember.position}</span>
            </div>

            <div className="connection-bridge">
              <div className="bridge-line" />
              <div className="bridge-pill">
                {selectedRelType === 'couple' ? <Heart size={14} className="heart-pink" /> : <Link2 size={14} />}
                <span>
                  {selectedRelType === 'other' ? (customLabel || 'Kinship') : RELATIONSHIP_TYPES.find(r => r.id === selectedRelType)?.label}
                </span>
              </div>
              <div className="bridge-line" />
            </div>

            <div className={`preview-node ${targetMember ? 'assigned' : 'empty'}`}>
              <div className="node-avatar-circle">
                {targetMember ? (
                  <img src={targetMember.photoUrl} alt={targetMember.firstName} />
                ) : (
                  <div className="placeholder-avatar">?</div>
                )}
              </div>
              <strong className="node-name">{targetMember ? targetMember.firstName : 'Select Person'}</strong>
              <span className="node-role">{targetMember ? targetMember.position : 'Target relative'}</span>
            </div>
          </div>

          {/* 1. Target Member Selection */}
          <div className="form-group">
            <label className="field-label" htmlFor="target-person-select">
              1. Choose Family Member to Connect With
            </label>
            {eligibleMembers.length === 0 ? (
              <p className="no-members-hint">
                There are no other family members yet. Add another person to the tree first!
              </p>
            ) : (
              <div className="target-members-picker">
                {eligibleMembers.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    className={`target-member-item ${targetMemberId === m.id ? 'active' : ''}`}
                    onClick={() => { setTargetMemberId(m.id); setError(''); }}
                  >
                    <div className="target-item-avatar">
                      <img src={m.photoUrl} alt={m.firstName} />
                    </div>
                    <div className="target-item-info">
                      <strong>{m.firstName} {m.lastName}</strong>
                      <span>{m.position}</span>
                    </div>
                    {targetMemberId === m.id && <Check size={16} className="target-check" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Relationship Type Selection */}
          <div className="form-group">
            <label className="field-label">2. Define Relationship</label>
            <div className="relationship-options-grid">
              {RELATIONSHIP_TYPES.map(rel => {
                const IconComponent = rel.icon;
                const isSelected = selectedRelType === rel.id;
                return (
                  <button
                    key={rel.id}
                    type="button"
                    className={`rel-card-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedRelType(rel.id)}
                  >
                    <div className="rel-card-icon">
                      <IconComponent size={16} />
                    </div>
                    <div className="rel-card-copy">
                      <strong>{rel.label}</strong>
                      <span>{rel.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom label input if "other" is chosen */}
          {selectedRelType === 'other' && (
            <div className="form-group">
              <label className="field-label" htmlFor="custom-label">
                Custom Relationship Label
              </label>
              <input 
                id="custom-label"
                type="text" 
                className="text-input"
                placeholder="e.g. Great-Aunt, Guardian, Godparent..."
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
              />
            </div>
          )}

          {/* Couple Logic Highlight Callout */}
          {selectedRelType === 'couple' && (
            <div className="couple-logic-banner">
              <Heart size={16} className="banner-heart-icon" />
              <div>
                <strong>Connected Couple Logic Enabled</strong>
                <p>
                  These two will appear side-by-side with a single shared circular <strong>+</strong> button to add their children.
                </p>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>

            <button 
              type="submit" 
              className="btn-primary modal-save-btn"
              disabled={!targetMemberId}
            >
              <Check size={16} />
              <span>Confirm Relationship</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

