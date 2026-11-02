import React, { useState, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  BookOpen, 
  Upload, 
  Check, 
  Trash2, 
  Play, 
  Pause, 
  Volume2, 
  Sparkles,
  Calendar
} from 'lucide-react';
import './MemoryUploadModal.css';

const SAMPLE_HISTORIC_PHOTOS = [
  'https://images.unsplash.com/photo-1507842229440-a10c036c8be4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
];

export default function MemoryUploadModal({
  isOpen,
  member,
  onClose,
  onSaveMemory
}) {
  const [activeTab, setActiveTab] = useState('photo'); // 'photo' | 'video' | 'audio' | 'story'

  // Photo state
  const [photoFiles, setPhotoFiles] = useState([]); // array of { url, name }
  const [photoHeading, setPhotoHeading] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');

  // Video state
  const [videoUrl, setVideoUrl] = useState('');
  const [videoHeading, setVideoHeading] = useState('');
  const [videoDescription, setVideoDescription] = useState('');

  // Audio state
  const [audioUrl, setAudioUrl] = useState('');
  const [audioTitle, setAudioTitle] = useState('');
  const [audioDescription, setAudioDescription] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Story state
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [storyDate, setStoryDate] = useState('');

  const [error, setError] = useState('');
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const audioPlayerRef = useRef(null);

  if (!isOpen || !member) return null;

  // Handle Photo File Upload
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoFiles(prev => [...prev, { url: event.target.result, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
    setError('');
  };

  // Add sample photo
  const handleAddSamplePhoto = (url) => {
    setPhotoFiles(prev => [...prev, { url, name: 'archival-heritage-photo.jpg' }]);
  };

  const handleRemovePhoto = (idx) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Handle Video File Upload
  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setError('');
  };

  // Handle Audio File Upload
  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setError('');
  };

  const toggleAudioPreview = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingPreview) {
      audioPlayerRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'photo') {
      if (photoFiles.length === 0) {
        setError('Please upload at least one photograph or choose a sample.');
        return;
      }

      photoFiles.forEach((p, idx) => {
        onSaveMemory({
          id: `mem-${Date.now()}-${idx}`,
          memberId: member.id,
          type: 'photo',
          title: photoHeading.trim() || 'Family Photograph',
          description: photoDescription.trim(),
          url: p.url,
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          createdAt: new Date().toISOString()
        });
      });
    } else if (activeTab === 'video') {
      const targetUrl = videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';
      onSaveMemory({
        id: `mem-${Date.now()}`,
        memberId: member.id,
        type: 'video',
        title: videoHeading.trim() || 'Family Video Memory',
        description: videoDescription.trim(),
        url: targetUrl,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        createdAt: new Date().toISOString()
      });
    } else if (activeTab === 'audio') {
      const targetUrl = audioUrl || 'https://actions.google.com/sounds/v1/water/stream_water.ogg';
      onSaveMemory({
        id: `mem-${Date.now()}`,
        memberId: member.id,
        type: 'audio',
        title: audioTitle.trim() || 'Voice Recording & Memory',
        description: audioDescription.trim(),
        url: targetUrl,
        duration: '2:15',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        createdAt: new Date().toISOString()
      });
    } else if (activeTab === 'story') {
      if (!storyContent.trim()) {
        setError('Please write a story or memory before saving.');
        return;
      }
      onSaveMemory({
        id: `mem-${Date.now()}`,
        memberId: member.id,
        type: 'story',
        title: storyTitle.trim() || 'Cherished Memory',
        content: storyContent.trim(),
        date: storyDate.trim() || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        createdAt: new Date().toISOString()
      });
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card memory-upload-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-badge-group">
            <span className="header-badge-pip" />
            <span className="header-badge-text">Preserve Heritage</span>
          </div>
          <h2 className="modal-title">Upload Memories</h2>
          <p className="modal-subtitle">
            Preserving moments for <strong>{member.firstName} {member.lastName}</strong>
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

        {/* 4 Category Tabs */}
        <div className="memory-tabs-bar" role="tablist">
          <button 
            type="button" 
            className={`memory-tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
            onClick={() => { setActiveTab('photo'); setError(''); }}
            role="tab"
          >
            <ImageIcon size={16} />
            <span>Photos</span>
          </button>

          <button 
            type="button" 
            className={`memory-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => { setActiveTab('video'); setError(''); }}
            role="tab"
          >
            <Video size={16} />
            <span>Videos</span>
          </button>

          <button 
            type="button" 
            className={`memory-tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => { setActiveTab('audio'); setError(''); }}
            role="tab"
          >
            <Mic size={16} />
            <span>Audio Memories</span>
          </button>

          <button 
            type="button" 
            className={`memory-tab-btn ${activeTab === 'story' ? 'active' : ''}`}
            onClick={() => { setActiveTab('story'); setError(''); }}
            role="tab"
          >
            <BookOpen size={16} />
            <span>Written Stories</span>
          </button>
        </div>

        {/* Tab Content Form */}
        <form onSubmit={handleSubmit} className="modal-form-scrollable">
          {error && (
            <div className="form-error-banner" role="alert">
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: PHOTOS */}
          {activeTab === 'photo' && (
            <div className="tab-pane">
              <div className="upload-dropzone" onClick={() => photoInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={photoInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                />
                <div className="dropzone-icon-ring">
                  <Upload size={22} />
                </div>
                <strong>Click to Upload Multiple Photographs</strong>
                <span>Drag &amp; drop or select files from your computer</span>
              </div>

              {/* Sample Photo Inserter */}
              <div className="sample-photo-tray">
                <span className="tray-label">Or attach archival demo photos:</span>
                <div className="tray-thumbs">
                  {SAMPLE_HISTORIC_PHOTOS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      className="sample-thumb-btn"
                      onClick={() => handleAddSamplePhoto(url)}
                      title="Add this photograph"
                    >
                      <img src={url} alt={`Sample ${i}`} />
                      <span className="thumb-plus">+</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Uploaded Photos Previews */}
              {photoFiles.length > 0 && (
                <div className="previews-grid">
                  {photoFiles.map((p, idx) => (
                    <div key={idx} className="preview-item">
                      <img src={p.url} alt={`Upload ${idx}`} />
                      <button 
                        type="button" 
                        className="remove-preview-btn"
                        onClick={() => handleRemovePhoto(idx)}
                        title="Remove photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="form-group">
                <label className="field-label" htmlFor="photo-heading">
                  Photograph Heading (Optional)
                </label>
                <input 
                  id="photo-heading"
                  type="text" 
                  className="text-input" 
                  placeholder="e.g. Summer Gathering in Kendal Orchard"
                  value={photoHeading}
                  onChange={(e) => setPhotoHeading(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="photo-desc">
                  Description &amp; Memories (Optional)
                </label>
                <textarea 
                  id="photo-desc"
                  rows={3} 
                  className="textarea-input"
                  placeholder="Who is in this photograph? What was happening? Preserve the details..."
                  value={photoDescription}
                  onChange={(e) => setPhotoDescription(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: VIDEOS */}
          {activeTab === 'video' && (
            <div className="tab-pane">
              <div className="upload-dropzone" onClick={() => videoInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={videoInputRef}
                  onChange={handleVideoUpload}
                  accept="video/*"
                  style={{ display: 'none' }}
                />
                <div className="dropzone-icon-ring">
                  <Video size={22} />
                </div>
                <strong>Click to Upload Family Video File</strong>
                <span>Supports MP4, WebM, MOV archival video recordings</span>
              </div>

              {videoUrl ? (
                <div className="video-preview-wrapper">
                  <video src={videoUrl} controls className="video-player-preview" />
                </div>
              ) : (
                <div className="demo-media-notice">
                  <Sparkles size={14} />
                  <span>No video file? A beautiful archival demonstration clip will be linked automatically.</span>
                </div>
              )}

              <div className="form-group">
                <label className="field-label" htmlFor="video-heading">
                  Video Heading (Optional)
                </label>
                <input 
                  id="video-heading"
                  type="text" 
                  className="text-input" 
                  placeholder="e.g. 50th Wedding Anniversary Toast"
                  value={videoHeading}
                  onChange={(e) => setVideoHeading(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="video-desc">
                  Description (Optional)
                </label>
                <textarea 
                  id="video-desc"
                  rows={3} 
                  className="textarea-input"
                  placeholder="Where was this recorded? Who is speaking? Preserve the context..."
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 3: AUDIO MEMORIES */}
          {activeTab === 'audio' && (
            <div className="tab-pane">
              <div className="upload-dropzone" onClick={() => audioInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={audioInputRef}
                  onChange={handleAudioUpload}
                  accept="audio/*"
                  style={{ display: 'none' }}
                />
                <div className="dropzone-icon-ring">
                  <Mic size={22} />
                </div>
                <strong>Upload Voice Recording or Cassette Digitization</strong>
                <span>Supports MP3, WAV, AAC, OGG spoken memoirs</span>
              </div>

              {/* Working Audio Player Preview */}
              <div className="audio-player-preview-card">
                <audio 
                  ref={audioPlayerRef} 
                  src={audioUrl || 'https://actions.google.com/sounds/v1/water/stream_water.ogg'} 
                  onEnded={() => setIsPlayingPreview(false)}
                />
                <button 
                  type="button" 
                  className="audio-preview-toggle-btn"
                  onClick={toggleAudioPreview}
                  aria-label="Test play audio"
                >
                  {isPlayingPreview ? <Pause size={16} /> : <Play size={16} className="play-icon-offset" />}
                </button>
                <div className="audio-preview-info">
                  <strong>{audioTitle || 'Spoken Recollection Preview'}</strong>
                  <span>{audioUrl ? 'Custom uploaded audio recording' : 'Archival audio sample stream ready'}</span>
                </div>
                <Volume2 size={18} className="audio-vol-icon" />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="audio-title">
                  Audio Title (Optional)
                </label>
                <input 
                  id="audio-title"
                  type="text" 
                  className="text-input" 
                  placeholder="e.g. Stories from the River Dee (Winter 1968)"
                  value={audioTitle}
                  onChange={(e) => setAudioTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="audio-desc">
                  Voice Recording Notes (Optional)
                </label>
                <textarea 
                  id="audio-desc"
                  rows={3} 
                  className="textarea-input"
                  placeholder="Transcript highlights, date recorded, equipment used..."
                  value={audioDescription}
                  onChange={(e) => setAudioDescription(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 4: WRITTEN STORIES */}
          {activeTab === 'story' && (
            <div className="tab-pane">
              <div className="form-group">
                <label className="field-label" htmlFor="story-title">
                  Story Title
                </label>
                <input 
                  id="story-title"
                  type="text" 
                  className="text-input" 
                  placeholder="e.g. The Night the Bell Tower Froze in 1947"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="story-date">
                  Era or Approximate Date (Optional)
                </label>
                <input 
                  id="story-date"
                  type="text" 
                  className="text-input" 
                  placeholder="e.g. Winter 1947 or March 1912"
                  value={storyDate}
                  onChange={(e) => setStoryDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="story-body">
                  Written Story &amp; Memories <span className="req-star">*</span>
                </label>
                <textarea 
                  id="story-body"
                  rows={6} 
                  className="textarea-input narrative-editor"
                  placeholder="Write the full narrative here. Share their anecdotes, wisdom, values, triumphs, laughter, and personal legacy..."
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  required
                />
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
            >
              <Check size={16} />
              <span>Save Memory to Archive</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

