import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Move, 
  Plus 
} from 'lucide-react';
import FamilyMemberNode from './FamilyMemberNode';
import './FamilyTree.css';

export default function FamilyTree({
  members = [],
  relationships = [],
  memories = [],
  onNodeClick, // single click: opens contextual menu
  onNodeDoubleClick, // double click: opens memory archive
  onAddFromNode, // clicking single node's +
  onAddChildForCouple, // clicking shared couple's +
  selectedMemberId = null,
  connectHighlightId = null
}) {
  const containerRef = useRef(null);

  // Zoom & Pan Canvas State
  const [scale, setScale] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Compute Layout & Coordinates for every member and couple
  const { nodePositions, coupleUnions, layoutDimensions } = useMemo(() => {
    if (!members.length) {
      return { nodePositions: {}, coupleUnions: [], layoutDimensions: { width: 1400, height: 900 } };
    }

    // 1. Identify Couples
    const couplePairs = [];
    const pairedMemberIds = new Set();

    relationships
      .filter(r => r.type === 'couple')
      .forEach(rel => {
        if (!pairedMemberIds.has(rel.personAId) && !pairedMemberIds.has(rel.personBId)) {
          const m1 = members.find(m => m.id === rel.personAId);
          const m2 = members.find(m => m.id === rel.personBId);
          if (m1 && m2) {
            couplePairs.push({ id: rel.id, personA: m1, personB: m2, label: rel.label || 'Couple' });
            pairedMemberIds.add(rel.personAId);
            pairedMemberIds.add(rel.personBId);
          }
        }
      });

    // 2. Determine Generation Levels for members
    const parentMap = {}; // childId -> [parentId]
    relationships
      .filter(r => r.type === 'parent-child')
      .forEach(rel => {
        if (!parentMap[rel.personBId]) parentMap[rel.personBId] = [];
        parentMap[rel.personBId].push(rel.personAId);
      });

    // Calculate level (depth)
    const memberLevels = {};
    const getLevel = (mId, visited = new Set()) => {
      if (visited.has(mId)) return 0;
      visited.add(mId);
      const parents = parentMap[mId] || [];
      if (!parents.length) return 0;
      return 1 + Math.max(...parents.map(pId => getLevel(pId, visited)));
    };

    members.forEach(m => {
      memberLevels[m.id] = getLevel(m.id);
    });

    // Harmonize couple levels so partners always sit on the same horizontal row
    couplePairs.forEach(cp => {
      const maxL = Math.max(memberLevels[cp.personA.id] || 0, memberLevels[cp.personB.id] || 0);
      memberLevels[cp.personA.id] = maxL;
      memberLevels[cp.personB.id] = maxL;
    });

    // 3. Group members into Generational Tiers
    const tiers = {};
    members.forEach(m => {
      const lvl = memberLevels[m.id] || 0;
      if (!tiers[lvl]) tiers[lvl] = [];
      tiers[lvl].push(m);
    });

    // 4. Position nodes horizontally and vertically
    const positions = {};
    const unions = [];
    const tierKeys = Object.keys(tiers).map(Number).sort((a, b) => a - b);
    const ROW_HEIGHT = 270;
    const START_Y = 140;
    let maxRowWidth = 1400;

    tierKeys.forEach((lvl, tierIdx) => {
      const tierMembers = tiers[lvl];
      const y = START_Y + tierIdx * ROW_HEIGHT;

      const placedInTier = new Set();
      const units = [];

      tierMembers.forEach(m => {
        if (placedInTier.has(m.id)) return;

        const foundCouple = couplePairs.find(cp => cp.personA.id === m.id || cp.personB.id === m.id);
        if (foundCouple && tierMembers.some(tm => tm.id === (foundCouple.personA.id === m.id ? foundCouple.personB.id : foundCouple.personA.id))) {
          units.push({
            type: 'couple',
            couple: foundCouple
          });
          placedInTier.add(foundCouple.personA.id);
          placedInTier.add(foundCouple.personB.id);
        } else {
          units.push({
            type: 'single',
            member: m
          });
          placedInTier.add(m.id);
        }
      });

      let totalWidth = 0;
      units.forEach(u => {
        totalWidth += u.type === 'couple' ? 340 : 220;
      });
      maxRowWidth = Math.max(maxRowWidth, totalWidth + 300);

      const canvasCenter = 750;
      let currentX = canvasCenter - totalWidth / 2;

      units.forEach(u => {
        if (u.type === 'couple') {
          const xA = currentX + 75;
          const xB = currentX + 255;
          const unionX = (xA + xB) / 2;
          const unionY = y;

          positions[u.couple.personA.id] = { x: xA, y };
          positions[u.couple.personB.id] = { x: xB, y };

          unions.push({
            id: u.couple.id,
            personA: u.couple.personA,
            personB: u.couple.personB,
            unionX,
            unionY,
            xA,
            xB,
            y
          });

          currentX += 340;
        } else {
          const x = currentX + 105;
          positions[u.member.id] = { x, y };
          currentX += 220;
        }
      });
    });

    const totalHeight = Math.max(900, START_Y + tierKeys.length * ROW_HEIGHT + 150);

    return {
      nodePositions: positions,
      coupleUnions: unions,
      layoutDimensions: { width: Math.max(1500, maxRowWidth), height: totalHeight }
    };
  }, [members, relationships]);

  // Center or Fit View
  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const containerW = containerRef.current.clientWidth;
    const containerH = containerRef.current.clientHeight;

    const scaleX = (containerW - 80) / layoutDimensions.width;
    const scaleY = (containerH - 80) / layoutDimensions.height;
    const newScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.45), 1.05);

    const initialX = (containerW - layoutDimensions.width * newScale) / 2;
    const initialY = Math.max((containerH - layoutDimensions.height * newScale) / 2, 20);

    setScale(newScale);
    setPan({ x: initialX, y: initialY });
  }, [layoutDimensions]);

  const resetView = useCallback(() => {
    if (!containerRef.current) return;
    const containerW = containerRef.current.clientWidth;
    const containerH = containerRef.current.clientHeight;

    const targetScale = 0.88;
    const focusX = 750; // middle
    const focusY = 280;

    const targetX = containerW / 2 - focusX * targetScale;
    const targetY = Math.max(40, containerH / 2 - focusY * targetScale);

    setScale(targetScale);
    setPan({ x: targetX, y: targetY });
  }, []);

  useEffect(() => {
    fitToScreen();
  }, [members.length, fitToScreen]);

  // Zoom handlers
  const handleZoom = (delta) => {
    setScale(prev => Math.min(Math.max(prev + delta, 0.4), 2.2));
  };

  const handleWheel = (e) => {
    if (!containerRef.current) return;
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
    setScale(prev => Math.min(Math.max(prev + zoomFactor, 0.4), 2.2));
  };

  // Drag to pan
  const handleMouseDown = (e) => {
    if (e.target.closest('.family-node-item') || e.target.closest('.couple-plus-hub') || e.target.closest('.tree-toolbar')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      if (e.target.closest('.family-node-item') || e.target.closest('.couple-plus-hub') || e.target.closest('.tree-toolbar')) {
        return;
      }
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Set of members belonging to a couple to hide their redundant individual plus buttons
  const coupleMemberIds = useMemo(() => {
    const set = new Set();
    coupleUnions.forEach(cu => {
      set.add(cu.personA.id);
      set.add(cu.personB.id);
    });
    return set;
  }, [coupleUnions]);

  return (
    <div 
      className="family-tree-canvas-viewport"
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      aria-label="Interactive Living Family Tree"
    >
      {/* Ambient Lighting & Archival Canvas Watermark */}
      <div className="canvas-radial-glow glow-nw" aria-hidden="true" />
      <div className="canvas-radial-glow glow-se" aria-hidden="true" />

      {/* Floating Canvas Toolbar (Pill-Shaped) */}
      <div className="tree-toolbar ui-control">
        <button 
          type="button" 
          className="toolbar-btn"
          onClick={() => handleZoom(0.15)}
          title="Zoom In (+)"
          aria-label="Zoom in"
        >
          <ZoomIn size={17} />
        </button>

        <span className="toolbar-zoom-label">
          {Math.round(scale * 100)}%
        </span>

        <button 
          type="button" 
          className="toolbar-btn"
          onClick={() => handleZoom(-0.15)}
          title="Zoom Out (-)"
          aria-label="Zoom out"
        >
          <ZoomOut size={17} />
        </button>

        <div className="toolbar-sep" />

        <button 
          type="button" 
          className="toolbar-btn"
          onClick={fitToScreen}
          title="Fit Tree to Screen"
          aria-label="Fit to screen"
        >
          <Maximize2 size={16} />
        </button>

        <button 
          type="button" 
          className="toolbar-btn"
          onClick={resetView}
          title="Center View"
          aria-label="Reset view"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Bottom Instruction Pill */}
      <div className="canvas-instruction-pill ui-control" aria-hidden="true">
        <Move size={13} />
        <span>Click node for options &bull; Double-click for personal memory archive &bull; Drag to pan &bull; Scroll to zoom</span>
      </div>

      {/* ================= PANNABLE & SCALABLE STAGE ================= */}
      <div 
        className="scalable-tree-stage"
        style={{
          width: `${layoutDimensions.width}px`,
          height: `${layoutDimensions.height}px`,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0'
        }}
      >
        {/* SVG Relationship Connector Lines */}
        <svg 
          className="tree-svg-connectors"
          width={layoutDimensions.width}
          height={layoutDimensions.height}
          viewBox={`0 0 ${layoutDimensions.width} ${layoutDimensions.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldFilament" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B58B59" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#B58B59" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="branchStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B58B59" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#263D32" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#263D32" stopOpacity="0.35" />
            </linearGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Couple Unions (Horizontal Marriages) */}
          {coupleUnions.map(u => (
            <g key={u.id} className="svg-couple-connection">
              {/* Arched golden ribbon connecting couple */}
              <path 
                d={`M ${u.xA + 45} ${u.y} Q ${u.unionX} ${u.y + 6}, ${u.xB - 45} ${u.y}`}
                stroke="url(#goldFilament)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />

              {/* Central Union Knot */}
              <circle 
                cx={u.unionX} 
                cy={u.unionY} 
                r="11" 
                fill="#FAF6F0" 
                stroke="#B58B59" 
                strokeWidth="2" 
                filter="url(#goldGlow)"
              />
              <circle cx={u.unionX} cy={u.unionY} r="4" fill="#263D32" />
            </g>
          ))}

          {/* 2. Parent-to-Child Descents */}
          {relationships
            .filter(r => r.type === 'parent-child')
            .map(r => {
              const childPos = nodePositions[r.personBId];
              if (!childPos) return null;

              // Check if parent is part of a couple union
              const parentCouple = coupleUnions.find(u => u.personA.id === r.personAId || u.personB.id === r.personAId);
              
              // Start coordinate is couple union center, or individual parent
              const startX = parentCouple ? parentCouple.unionX : (nodePositions[r.personAId]?.x || 0);
              const startY = parentCouple ? parentCouple.unionY + 12 : (nodePositions[r.personAId]?.y + 45 || 0);
              const endX = childPos.x;
              const endY = childPos.y - 45;
              const midY = (startY + endY) / 2;

              return (
                <g key={r.id} className="svg-parent-child-line">
                  {/* Organic Smooth S-Curve */}
                  <path 
                    d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
                    stroke="url(#branchStemGrad)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  {/* Small gold node dot above child avatar */}
                  <circle cx={endX} cy={endY} r="3" fill="#B58B59" />
                </g>
              );
            })}
        </svg>

        {/* Shared Circular + Button Between Couples (IMPORTANT RELATIONSHIP LOGIC) */}
        {coupleUnions.map(u => (
          <div 
            key={`hub-${u.id}`}
            className="couple-plus-hub"
            style={{ left: `${u.unionX}px`, top: `${u.unionY - 24}px` }}
          >
            <button 
              type="button" 
              className="couple-shared-plus-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAddChildForCouple(u.personA, u.personB);
              }}
              title={`Add child for ${u.personA.firstName} & ${u.personB.firstName}`}
              aria-label={`Add son or daughter for ${u.personA.firstName} and ${u.personB.firstName}`}
            >
              <Plus size={15} />
              <span className="plus-child-tooltip">Add Child</span>
            </button>
          </div>
        ))}

        {/* Member Nodes Layer */}
        <div className="tree-nodes-layer">
          {members.map(member => {
            const pos = nodePositions[member.id] || { x: 750, y: 300 };
            const memberMemoriesCount = memories.filter(m => m.memberId === member.id).length;
            const isPartOfCouple = coupleMemberIds.has(member.id);

            return (
              <FamilyMemberNode 
                key={member.id}
                member={member}
                position={pos}
                memoriesCount={memberMemoriesCount}
                isSelected={selectedMemberId === member.id}
                isConnectHighlight={connectHighlightId === member.id}
                hidePlus={isPartOfCouple}
                onNodeClick={(m, e) => onNodeClick(m, e)}
                onNodeDoubleClick={(m) => onNodeDoubleClick(m)}
                onAddChildOrRelative={(m) => onAddFromNode(m)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
