import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  UploadCloud, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  Maximize2, 
  Quote, 
  Heart, 
  User 
} from 'lucide-react';
import './MemoryArchive.css';

export default function MemoryArchive({
  member,
  memories = [],
  onClose,
  onOpenUpload
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'photos' | 'videos' | 'audio' | 'stories'
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  if (!member) return null;

  // Filter memories belonging to this family member
  const memberMemories = memories.filter(m => m.memberId === member.id);
  const photos = memberMemories.filter(m => m.type === 'photo');
  const videos = memberMemories.filter(m => m.type === 'video');
  const audios = memberMemories.filter(m => m.type === 'audio');
  const stories = memberMemories.filter(m => m.type === 'story');

  const togglePlayAudio = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };

  return (
    <div className="memory-archive-overlay" role="dialog" aria-modal="true">
      <div className="memory-archive-container">
        {/* Top Sticky Navigation Bar */}
        <div className="archive-top-bar">
          <button 
            type="button" 
            className="btn-secondary archive-back-btn"
            onClick={onClose}
          >
            <ArrowLeft size={16} />
            <span>Return to Living Tree</span>
          </button>

          <div className="archive-title-pill">
            <Sparkles size={14} className="gold-sparkle" />
            <span>Personal Heritage Archive</span>
          </div>

          <div className="archive-top-actions">
            <button 
              type="button" 
              className="btn-primary archive-upload-btn"
              onClick={() => onOpenUpload(member)}
            >
              <UploadCloud size={16} />
              <span>Add Memories</span>
            </button>

            <button 
              type="button" 
              className="archive-close-icon-btn"
              onClick={onClose}
              aria-label="Close archive"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Archive Canvas */}
        <div className="archive-scrollable-body">
          {/* Hero Profile Banner */}
          <div className="archive-hero-banner">
            <div className="hero-avatar-wrapper">
              <div className="archive-circular-avatar">
                <img src={member.photoUrl} alt={member.firstName} />
                <div className="avatar-ambient-glow" />
              </div>
              <span className="hero-pos-pill">{member.position}</span>
            </div>

            <div className="hero-text-block">
              <div className="hero-badge">
                <span className="badge-dot" />
                <span>Generational Archive Record</span>
              </div>
              <h1 className="hero-fullname">
                {member.firstName} {member.middleName ? `${member.middleName} ` : ''}{member.lastName}
              </h1>
              <p className="hero-bio-lead">
                {member.bio || 'Preserved in honor and love. Every memory recorded here remains an enduring testament for generations to come.'}
              </p>

              {/* Memory Counts Strip */}
              <div className="hero-stats-strip">
                <div className="stat-pill" onClick={() => setActiveTab('photos')}>
                  <ImageIcon size={14} />
                  <span><strong>{photos.length}</strong> Photographs</span>
                </div>
                <div className="stat-pill" onClick={() => setActiveTab('videos')}>
                  <Video size={14} />
                  <span><strong>{videos.length}</strong> Videos</span>
                </div>
                <div className="stat-pill" onClick={() => setActiveTab('audio')}>
                  <Mic size={14} />
                  <span><strong>{audios.length}</strong> Spoken Recordings</span>
                </div>
                <div className="stat-pill" onClick={() => setActiveTab('stories')}>
                  <BookOpen size={14} />
                  <span><strong>{stories.length}</strong> Written Stories</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation Ribbon */}
          <div className="archive-nav-ribbon" role="tablist">
            <button 
              type="button" 
              className={`ribbon-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              role="tab"
            >
              <span>Overview &amp; Life Story</span>
            </button>

            <button 
              type="button" 
              className={`ribbon-tab-btn ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
              role="tab"
            >
              <ImageIcon size={15} />
              <span>Photos ({photos.length})</span>
            </button>

            <button 
              type="button" 
              className={`ribbon-tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => setActiveTab('videos')}
              role="tab"
            >
              <Video size={15} />
              <span>Videos ({videos.length})</span>
            </button>

            <button 
              type="button" 
              className={`ribbon-tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
              onClick={() => setActiveTab('audio')}
              role="tab"
            >
              <Mic size={15} />
              <span>Audio Memories ({audios.length})</span>
            </button>

            <button 
              type="button" 
              className={`ribbon-tab-btn ${activeTab === 'stories' ? 'active' : ''}`}
              onClick={() => setActiveTab('stories')}
              role="tab"
            >
              <BookOpen size={15} />
              <span>Written Stories ({stories.length})</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="archive-tab-content overview-layout">
              <div className="overview-main-col">
                <div className="archive-card biography-card">
                  <h3 className="card-section-title">Archival Biography</h3>
                  <div className="bio-prose">
                    <p>{member.bio || 'No biography written yet. Click "Edit Profile" or "Add Memories" to document their achievements, personality, and life journey.'}</p>
                  </div>
                </div>

                {/* Highlighted Written Story if available */}
                {stories.length > 0 && (
                  <div className="archive-card featured-story-card">
                    <div className="featured-story-badge">
                      <BookOpen size={14} />
                      <span>Featured Family Memory</span>
                    </div>
                    <h3 className="story-title">{stories[0].title}</h3>
                    {stories[0].date && <span className="story-date">{stories[0].date}</span>}
                    <div className="story-excerpt">
                      <p>{stories[0].content}</p>
                    </div>
                  </div>
                )}

                {/* Recent Photo Strip Preview */}
                {photos.length > 0 && (
                  <div className="archive-card photo-strip-card">
                    <div className="card-head-row">
                      <h3 className="card-section-title">Photographs</h3>
                      <button 
                        type="button" 
                        className="btn-ghost view-all-btn"
                        onClick={() => setActiveTab('photos')}
                      >
                        View all {photos.length} &rarr;
                      </button>
                    </div>
                    <div className="photo-strip-grid">
                      {photos.slice(0, 4).map(p => (
                        <div 
                          key={p.id} 
                          className="photo-thumb-card"
                          onClick={() => setActiveLightboxImg(p.url)}
                        >
                          <img src={p.url} alt={p.title} />
                          <div className="photo-thumb-overlay">
                            <span>{p.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: Preservation Details */}
              <div className="overview-side-col">
                <div className="archive-card custody-card">
                  <h3 className="card-section-title">Kinship Custody</h3>
                  <p className="custody-text">
                    This profile is preserved within your private family vault. Only authenticated relatives have access to view and contribute memories.
                  </p>
                  <button 
                    type="button" 
                    className="btn-primary upload-more-full-btn"
                    onClick={() => onOpenUpload(member)}
                  >
                    <UploadCloud size={16} />
                    <span>Upload Memories</span>
                  </button>
                </div>

                {/* Audio snippet if available */}
                {audios.length > 0 && (
                  <div className="archive-card audio-callout-card">
                    <div className="audio-callout-badge">
                      <Mic size={14} />
                      <span>Spoken Recollection</span>
                    </div>
                    <strong className="audio-callout-title">{audios[0].title}</strong>
                    <p className="audio-callout-desc">{audios[0].description}</p>
                    <button 
                      type="button" 
                      className="btn-secondary play-callout-btn"
                      onClick={() => setActiveTab('audio')}
                    >
                      <Play size={14} />
                      <span>Listen to Recording</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PHOTOS */}
          {activeTab === 'photos' && (
            <div className="archive-tab-content">
              {photos.length === 0 ? (
                <div className="empty-category-card">
                  <ImageIcon size={38} className="empty-cat-icon" />
                  <h3>No Photographs Yet</h3>
                  <p>Preserve historic tintypes, family gatherings, and portrait prints.</p>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => onOpenUpload(member)}
                  >
                    <UploadCloud size={16} />
                    <span>Upload Photographs</span>
                  </button>
                </div>
              ) : (
                <div className="gallery-masonry-grid">
                  {photos.map(p => (
                    <div key={p.id} className="gallery-item-card">
                      <div 
                        className="gallery-image-frame"
                        onClick={() => setActiveLightboxImg(p.url)}
                      >
                        <img src={p.url} alt={p.title} />
                        <div className="gallery-hover-glass">
                          <Maximize2 size={20} />
                          <span>View Full Photograph</span>
                        </div>
                      </div>
                      <div className="gallery-item-meta">
                        <strong className="gallery-title">{p.title}</strong>
                        {p.date && <span className="gallery-date"><Calendar size={12} /> {p.date}</span>}
                        {p.description && <p className="gallery-desc">{p.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VIDEOS */}
          {activeTab === 'videos' && (
            <div className="archive-tab-content">
              {videos.length === 0 ? (
                <div className="empty-category-card">
                  <Video size={38} className="empty-cat-icon" />
                  <h3>No Videos Uploaded Yet</h3>
                  <p>Preserve digitized home movies, wedding toasts, and video interviews.</p>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => onOpenUpload(member)}
                  >
                    <UploadCloud size={16} />
                    <span>Upload Video Memories</span>
                  </button>
                </div>
              ) : (
                <div className="video-cards-grid">
                  {videos.map(v => (
                    <div key={v.id} className="video-archive-card">
                      <video src={v.url} controls className="video-player-frame" />
                      <div className="video-meta-block">
                        <strong className="video-title">{v.title}</strong>
                        {v.date && <span className="video-date"><Calendar size={12} /> {v.date}</span>}
                        {v.description && <p className="video-desc">{v.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIO MEMORIES */}
          {activeTab === 'audio' && (
            <div className="archive-tab-content">
              {audios.length === 0 ? (
                <div className="empty-category-card">
                  <Mic size={38} className="empty-cat-icon" />
                  <h3>No Voice Recordings Preserved Yet</h3>
                  <p>A voice carries a person's soul across generations. Save oral histories, cassettes, and voicemail recordings.</p>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => onOpenUpload(member)}
                  >
                    <UploadCloud size={16} />
                    <span>Upload Audio Memories</span>
                  </button>
                </div>
              ) : (
                <div className="audio-cards-list">
                  {audios.map(a => {
                    const isPlaying = playingAudioId === a.id;
                    return (
                      <div key={a.id} className="audio-archive-card">
                        <div className="audio-main-row">
                          <button 
                            type="button" 
                            className="audio-circle-play-btn"
                            onClick={() => togglePlayAudio(a.id)}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                          >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} className="play-icon-offset" />}
                          </button>

                          <div className="audio-content-wrap">
                            <div className="audio-header-line">
                              <h4 className="audio-item-title">{a.title}</h4>
                              {a.duration && <span className="audio-duration-pill">{a.duration}</span>}
                            </div>
                            {a.date && <span className="audio-item-date"><Calendar size={12} /> {a.date}</span>}
                            {a.description && <p className="audio-item-desc">{a.description}</p>}
                          </div>
                        </div>

                        {/* Working HTML5 Audio element */}
                        <audio 
                          src={a.url} 
                          controls={isPlaying}
                          autoPlay={isPlaying}
                          className="audio-hidden-element"
                          onEnded={() => setPlayingAudioId(null)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: STORIES */}
          {activeTab === 'stories' && (
            <div className="archive-tab-content">
              {stories.length === 0 ? (
                <div className="empty-category-card">
                  <BookOpen size={38} className="empty-cat-icon" />
                  <h3>No Written Stories Yet</h3>
                  <p>Document their childhood, wedding memories, beloved recipes, lessons, and anecdotes.</p>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => onOpenUpload(member)}
                  >
                    <UploadCloud size={16} />
                    <span>Write First Story</span>
                  </button>
                </div>
              ) : (
                <div className="stories-editorial-list">
                  {stories.map(s => (
                    <article key={s.id} className="story-editorial-card">
                      <div className="story-card-top">
                        <Quote size={24} className="story-quote-icon" />
                        <div className="story-meta-col">
                          <h3 className="story-headline">{s.title}</h3>
                          {s.date && <span className="story-time-tag"><Calendar size={13} /> {s.date}</span>}
                        </div>
                      </div>
                      <div className="story-card-body">
                        <p>{s.content}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {activeLightboxImg && (
        <div 
          className="lightbox-backdrop" 
          onClick={() => setActiveLightboxImg(null)}
          role="dialog"
        >
          <button 
            type="button" 
            className="lightbox-close-btn"
            onClick={() => setActiveLightboxImg(null)}
            aria-label="Close image preview"
          >
            <X size={24} />
          </button>
          <img 
            src={activeLightboxImg} 
            alt="Enlarged view" 
            className="lightbox-image" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

