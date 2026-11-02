import { motion } from 'framer-motion';
import { Sparkles, Heart, Plus, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({ onCreateFirstMember, onLoadSample }) {
  return (
    <div className="empty-tree-container">
      {/* Background Archival Radial Glows */}
      <div className="empty-ambient-glow glow-top" aria-hidden="true" />
      <div className="empty-ambient-glow glow-bottom" aria-hidden="true" />

      {/* Subtle Family Tree Inspired Visual Element in Background */}
      <svg 
        className="empty-tree-bg-svg" 
        viewBox="0 0 1000 700" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="treeBranchGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#263D32" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#B58B59" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.12" />
          </linearGradient>
          <filter id="branchSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Tree Roots & Trunk Rising Upwards */}
        <path 
          d="M 500 700 C 500 550, 500 480, 500 400" 
          stroke="url(#treeBranchGrad)" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        {/* Left Ancestor Branch */}
        <path 
          d="M 500 400 C 420 360, 320 320, 260 220 C 220 150, 200 100, 180 60" 
          stroke="url(#treeBranchGrad)" 
          strokeWidth="2.2" 
          strokeDasharray="4 6" 
        />
        {/* Right Ancestor Branch */}
        <path 
          d="M 500 400 C 580 360, 680 320, 740 220 C 780 150, 800 100, 820 60" 
          stroke="url(#treeBranchGrad)" 
          strokeWidth="2.2" 
          strokeDasharray="4 6" 
        />
        {/* Intermediate Foliage Arcs */}
        <path 
          d="M 380 290 Q 500 230 620 290" 
          stroke="url(#treeBranchGrad)" 
          strokeWidth="1.8" 
          strokeDasharray="3 5" 
        />
        {/* Glowing Node Buds */}
        <circle cx="500" cy="400" r="8" fill="#B58B59" opacity="0.35" filter="url(#branchSoftGlow)" />
        <circle cx="260" cy="220" r="6" fill="#B58B59" opacity="0.3" />
        <circle cx="740" cy="220" r="6" fill="#B58B59" opacity="0.3" />
        <circle cx="180" cy="60" r="5" fill="#B58B59" opacity="0.25" />
        <circle cx="820" cy="60" r="5" fill="#B58B59" opacity="0.25" />
      </svg>

      {/* Framer Motion Animated Empty Hero Card */}
      <motion.div 
        className="empty-hero-card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Emotional Badge */}
        <motion.div 
          className="empty-eyebrow-pill"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="eyebrow-dot" />
          <span>Digital Family Memory Archive</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          className="empty-headline"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Your Family Story <span className="headline-italic">Begins Here.</span>
        </motion.h1>

        {/* Supporting Text */}
        <motion.p 
          className="empty-subtext"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Preserve the people, moments, and memories that make your family unique.
        </motion.p>

        {/* Central Philosophy Quote */}
        <motion.blockquote 
          className="empty-philosophy-quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <span className="quote-mark">“</span>
          People may leave this world, but their memories live forever.
          <span className="quote-mark">”</span>
        </motion.blockquote>

        {/* Prominent Rounded CTA Button */}
        <motion.div 
          className="empty-actions-row"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button 
            type="button" 
            className="btn-primary empty-main-cta"
            onClick={onCreateFirstMember}
          >
            <Plus size={18} />
            <span>Create Your Family Tree</span>
            <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* Quick Demo Exploration Alternative */}
        <motion.div 
          className="empty-sample-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <span>Want to explore first?</span>
          <button 
            type="button" 
            className="sample-trigger-link"
            onClick={onLoadSample}
          >
            <Sparkles size={14} />
            <span>Load demonstration family archive</span>
          </button>
        </motion.div>

        {/* Heritage Trust Badges */}
        <div className="empty-trust-strip">
          <div className="trust-cell">
            <ShieldCheck size={15} />
            <span>Private &amp; Sovereign Archive</span>
          </div>
          <span className="trust-sep">&bull;</span>
          <div className="trust-cell">
            <BookOpen size={15} />
            <span>Photos, Videos, Audio &amp; Stories</span>
          </div>
          <span className="trust-sep">&bull;</span>
          <div className="trust-cell">
            <Heart size={15} />
            <span>Preserved for Generations</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
