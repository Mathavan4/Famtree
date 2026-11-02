import { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  Check, 
  User 
} from 'lucide-react';
import './CreateMemberModal.css';

const POSITION_SUGGESTIONS = [
  'Grandfather',
  'Grandmother',
  'Father',
  'Mother',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Uncle',
  'Aunt',
  'Husband',
  'Wife',
  'Other'
];

const PRESET_AVATARS = [
  { label: 'Grandfather', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Grandmother', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
  { label: 'Father', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Mother', url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80' },
  { label: 'Daughter', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { label: 'Son', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' }
];

export default function CreateMemberModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editMember = null, 
  contextData = null 
}) {
  const [firstName, setFirstName] = useState(editMember?.firstName || '');
  const [middleName, setMiddleName] = useState(editMember?.middleName || '');
  const [lastName, setLastName] = useState(editMember?.lastName || '');
  const [position, setPosition] = useState(editMember?.position || contextData?.defaultPosition || '');
  const [bio, setBio] = useState(editMember?.bio || '');
  const [photoUrl, setPhotoUrl] = useState(editMember?.photoUrl || '');
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle local image file upload & convert to Data URL for LocalStorage persistence
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoUrl(event.target.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url) => {
    setPhotoUrl(url);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('First name is required.');
      return;
    }

    const memberPayload = {
      id: editMember ? editMember.id : `member-${Date.now()}`,
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      position: position.trim() || 'Family Member',
      bio: bio.trim(),
      photoUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      createdAt: editMember ? editMember.createdAt : new Date().toISOString()
    };

    onSave(memberPayload, contextData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card member-creation-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-badge-group">
            <span className="header-badge-pip" />
            <span className="header-badge-text">
              {editMember ? 'Update Profile' : contextData?.coupleNames ? `Add Child of ${contextData.coupleNames}` : 'Add Family Member'}
            </span>
          </div>
          <h2 className="modal-title">
            {editMember ? 'Edit Profile Details' : 'Create Family Member'}
          </h2>
          <p className="modal-subtitle">
            Every family member holds an irreplaceable place in your generational story.
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="modal-form-scrollable">
          {error && (
            <div className="form-error-banner" role="alert">
              <span>{error}</span>
            </div>
          )}

          {/* 1. Profile Photograph Upload & Circular Preview */}
          <div className="photo-upload-section">
            <label className="field-label">Profile Photograph</label>
            <div className="photo-upload-row">
              <div className="circular-avatar-preview">
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="preview-img" />
                ) : (
                  <div className="default-avatar-fallback">
                    <User size={38} className="fallback-user-icon" />
                  </div>
                )}
                <div className="avatar-gold-border" />
              </div>

              <div className="photo-actions-box">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                <div className="btn-group-row">
                  <button 
                    type="button" 
                    className="btn-secondary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    <span>{photoUrl ? 'Replace Photo' : 'Upload Image'}</span>
                  </button>

                  {photoUrl && (
                    <button 
                      type="button" 
                      className="btn-ghost btn-sm btn-remove-photo"
                      onClick={handleRemovePhoto}
                      title="Remove custom photo"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <span className="file-hint-text">Supported: JPG, PNG, WebP (under 5MB)</span>

                {/* Optional Preset Portraits */}
                <div className="preset-portraits-row">
                  <span className="preset-label">Or choose an archival avatar:</span>
                  <div className="preset-avatars-list">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`preset-thumb-btn ${photoUrl === preset.url ? 'active' : ''}`}
                        onClick={() => handleSelectPreset(preset.url)}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Names */}
          <div className="form-names-grid">
            <div className="form-group">
              <label className="field-label" htmlFor="first-name">
                First Name <span className="req-star">*</span>
              </label>
              <input 
                id="first-name"
                type="text" 
                className="text-input" 
                placeholder="e.g. Arthur"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="middle-name">Middle Name (Optional)</label>
              <input 
                id="middle-name"
                type="text" 
                className="text-input" 
                placeholder="e.g. William"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="last-name">Last Name (Optional)</label>
              <input 
                id="last-name"
                type="text" 
                className="text-input" 
                placeholder="e.g. Sterling"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* 3. Family Position */}
          <div className="form-group">
            <label className="field-label" htmlFor="family-position">
              Family Position
            </label>
            <input 
              id="family-position"
              type="text" 
              className="text-input" 
              placeholder="e.g. Grandfather, Mother, Son, Matriarch..."
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />

            {/* Suggestions Pills */}
            <div className="position-suggestions-wrap">
              <span className="sugg-title">Quick suggestions:</span>
              <div className="sugg-pills-container">
                {POSITION_SUGGESTIONS.map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    className={`suggestion-pill ${position === sugg ? 'active' : ''}`}
                    onClick={() => setPosition(sugg)}
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. About This Person (Multiline narrative) */}
          <div className="form-group">
            <label className="field-label" htmlFor="about-person">
              About This Person
            </label>
            <textarea 
              id="about-person"
              rows={4}
              className="textarea-input"
              placeholder="Write about this person's life, personality, achievements, cherished memories, passions, and enduring values..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Modal Actions Footer */}
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
            >
              <Check size={16} />
              <span>{editMember ? 'Save Changes' : 'Save Profile to Tree'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
