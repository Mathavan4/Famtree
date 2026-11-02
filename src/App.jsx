import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import EmptyState from './components/EmptyState';
import FamilyTree from './components/FamilyTree';
import CreateMemberModal from './components/CreateMemberModal';
import MemberContextMenu from './components/MemberContextMenu';
import RelationshipModal from './components/RelationshipModal';
import MemoryUploadModal from './components/MemoryUploadModal';
import MemoryArchive from './components/MemoryArchive';
import ConfirmationDialog from './components/ConfirmationDialog';
import { 
  getStoredMembers, 
  saveStoredMembers, 
  getStoredRelationships, 
  saveStoredRelationships, 
  getStoredMemories, 
  saveStoredMemories,
  loadSampleData,
  clearAllData 
} from './services/storage';

export default function App() {
  // Main Data States with Lazy LocalStorage Initializers
  const [members, setMembers] = useState(() => getStoredMembers());
  const [relationships, setRelationships] = useState(() => getStoredRelationships());
  const [memories, setMemories] = useState(() => getStoredMemories());

  // UI Interactive States
  const [createModal, setCreateModal] = useState({ isOpen: false, editMember: null, contextData: null });
  const [contextMenu, setContextMenu] = useState({ isOpen: false, member: null, position: { x: 0, y: 0 } });
  const [relationshipModal, setRelationshipModal] = useState({ isOpen: false, sourceMember: null });
  const [uploadModal, setUploadModal] = useState({ isOpen: false, member: null });
  const [activeArchiveMember, setActiveArchiveMember] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', confirmLabel: 'Delete', onConfirm: () => {} });
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [treeResetKey, setTreeResetKey] = useState(0);

  // Synchronize state changes to LocalStorage
  useEffect(() => {
    saveStoredMembers(members);
  }, [members]);

  useEffect(() => {
    saveStoredRelationships(relationships);
  }, [relationships]);

  useEffect(() => {
    saveStoredMemories(memories);
  }, [memories]);

  // Handler: Open creation modal for the very first member
  const handleOpenCreateFirst = () => {
    setCreateModal({ isOpen: true, editMember: null, contextData: null });
  };

  // Handler: Open creation modal from single node plus button
  const handleAddFromNode = (member) => {
    setCreateModal({
      isOpen: true,
      editMember: null,
      contextData: {
        relativePerson: member,
        defaultPosition: 'Son / Daughter'
      }
    });
  };

  // Handler: Open creation modal from shared couple plus button
  const handleAddChildForCouple = (personA, personB) => {
    setCreateModal({
      isOpen: true,
      editMember: null,
      contextData: {
        parentAId: personA.id,
        parentBId: personB.id,
        coupleNames: `${personA.firstName} & ${personB.firstName}`,
        defaultPosition: 'Son'
      }
    });
  };

  // Handler: Save created or updated member
  const handleSaveMember = (memberPayload, contextData) => {
    if (createModal.editMember) {
      // Edit existing member
      setMembers(prev => prev.map(m => m.id === memberPayload.id ? { ...m, ...memberPayload } : m));
    } else {
      // Create new member
      setMembers(prev => [...prev, memberPayload]);

      // If added as child of a couple, automatically establish both parent-child relationships!
      if (contextData?.parentAId && contextData?.parentBId) {
        const rel1 = {
          id: `rel-${Date.now()}-1`,
          personAId: contextData.parentAId,
          personBId: memberPayload.id,
          type: 'parent-child',
          label: 'Parent to Child',
          createdAt: new Date().toISOString()
        };
        const rel2 = {
          id: `rel-${Date.now()}-2`,
          personAId: contextData.parentBId,
          personBId: memberPayload.id,
          type: 'parent-child',
          label: 'Parent to Child',
          createdAt: new Date().toISOString()
        };
        setRelationships(prev => [...prev, rel1, rel2]);
      } else if (contextData?.relativePerson) {
        // Connected to individual parent
        const rel = {
          id: `rel-${Date.now()}`,
          personAId: contextData.relativePerson.id,
          personBId: memberPayload.id,
          type: 'parent-child',
          label: 'Parent to Child',
          createdAt: new Date().toISOString()
        };
        setRelationships(prev => [...prev, rel]);
      }
    }
  };

  // Handler: Open contextual menu on single click
  const handleNodeClick = (member, event) => {
    setSelectedMemberId(member.id);
    const clickX = event.clientX || window.innerWidth / 2;
    const clickY = event.clientY || window.innerHeight / 2;
    setContextMenu({
      isOpen: true,
      member,
      position: { x: clickX + 15, y: clickY - 20 }
    });
  };

  // Handler: Open dedicated memory archive on double-click
  const handleNodeDoubleClick = (member) => {
    setSelectedMemberId(member.id);
    setContextMenu({ isOpen: false, member: null, position: { x: 0, y: 0 } });
    setActiveArchiveMember(member);
  };

  // Context Menu Actions
  const handleEditFromMenu = (member) => {
    setCreateModal({ isOpen: true, editMember: member, contextData: null });
  };

  const handleUploadMemoriesFromMenu = (member) => {
    setUploadModal({ isOpen: true, member });
  };

  const handleConnectFromMenu = (member) => {
    setRelationshipModal({ isOpen: true, sourceMember: member });
  };

  const handleDeleteFromMenu = (member) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${member.firstName} ${member.lastName}?`,
      message: `Are you sure you want to remove ${member.firstName} from the family tree? All associated memories and relationships will also be safely removed.`,
      confirmLabel: 'Delete Person',
      isDanger: true,
      onConfirm: () => {
        // Remove member
        setMembers(prev => prev.filter(m => m.id !== member.id));
        // Remove relationships
        setRelationships(prev => prev.filter(r => r.personAId !== member.id && r.personBId !== member.id));
        // Remove memories
        setMemories(prev => prev.filter(mem => mem.memberId !== member.id));
        if (selectedMemberId === member.id) setSelectedMemberId(null);
        if (activeArchiveMember?.id === member.id) setActiveArchiveMember(null);
      }
    });
  };

  // Handler: Save relationship
  const handleSaveRelationship = (newRel) => {
    setRelationships(prev => [...prev, newRel]);
  };

  // Handler: Save uploaded memory
  const handleSaveMemory = (memoryItem) => {
    setMemories(prev => [memoryItem, ...prev]);
  };

  // Handler: Load sample demonstration family archive
  const handleLoadSample = () => {
    const data = loadSampleData();
    setMembers(data.members);
    setRelationships(data.relationships);
    setMemories(data.memories);
    setTreeResetKey(prev => prev + 1);
  };

  // Handler: Clear all data to return to empty state
  const handleClearAll = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Start Fresh with Empty Tree?',
      message: 'This will reset your family tree and display the initial "Your Family Story Begins Here" screen. All temporary demo records will be cleared.',
      confirmLabel: 'Start Fresh',
      isDanger: false,
      onConfirm: () => {
        clearAllData();
        setMembers([]);
        setRelationships([]);
        setMemories([]);
        setSelectedMemberId(null);
        setActiveArchiveMember(null);
      }
    });
  };

  // Handler: Reset tree view center
  const handleResetView = () => {
    setTreeResetKey(prev => prev + 1);
    setSelectedMemberId(null);
  };

  return (
    <div className="family-legacy-app">
      {/* Top Slim Navigation Bar */}
      <Navbar 
        membersCount={members.length}
        memoriesCount={memories.length}
        onAddMember={() => setCreateModal({ isOpen: true, editMember: null, contextData: null })}
        onResetView={handleResetView}
        onLoadSample={handleLoadSample}
        onClearAll={handleClearAll}
      />

      {/* Main Viewport */}
      <main className="main-viewport">
        {members.length === 0 ? (
          /* SECTION 3: EMPTY FAMILY TREE SCREEN */
          <EmptyState 
            onCreateFirstMember={handleOpenCreateFirst}
            onLoadSample={handleLoadSample}
          />
        ) : (
          /* SECTIONS 4, 5, 6, 7: INTERACTIVE LIVING FAMILY TREE */
          <FamilyTree 
            key={treeResetKey}
            members={members}
            relationships={relationships}
            memories={memories}
            selectedMemberId={selectedMemberId}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
            onAddFromNode={handleAddFromNode}
            onAddChildForCouple={handleAddChildForCouple}
          />
        )}
      </main>

      {/* Contextual Menu on Single Click */}
      {contextMenu.isOpen && (
        <MemberContextMenu 
          member={contextMenu.member}
          position={contextMenu.position}
          onClose={() => setContextMenu({ isOpen: false, member: null, position: { x: 0, y: 0 } })}
          onEdit={handleEditFromMenu}
          onUploadMemories={handleUploadMemoriesFromMenu}
          onConnect={handleConnectFromMenu}
          onDelete={handleDeleteFromMenu}
          onOpenArchive={handleNodeDoubleClick}
        />
      )}

      {/* Profile Creation & Editing Modal */}
      <CreateMemberModal 
        isOpen={createModal.isOpen}
        editMember={createModal.editMember}
        contextData={createModal.contextData}
        onClose={() => setCreateModal({ isOpen: false, editMember: null, contextData: null })}
        onSave={handleSaveMember}
      />

      {/* Relationship Connection Modal */}
      <RelationshipModal 
        isOpen={relationshipModal.isOpen}
        sourceMember={relationshipModal.sourceMember}
        members={members}
        onClose={() => setRelationshipModal({ isOpen: false, sourceMember: null })}
        onSaveRelationship={handleSaveRelationship}
      />

      {/* Upload Family Memories Modal */}
      <MemoryUploadModal 
        isOpen={uploadModal.isOpen}
        member={uploadModal.member}
        onClose={() => setUploadModal({ isOpen: false, member: null })}
        onSaveMemory={handleSaveMemory}
      />

      {/* Dedicated Personal Memory Archive (Double Click View) */}
      {activeArchiveMember && (
        <MemoryArchive 
          member={activeArchiveMember}
          memories={memories}
          onClose={() => setActiveArchiveMember(null)}
          onOpenUpload={(member) => setUploadModal({ isOpen: true, member })}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        isDanger={confirmDialog.isDanger}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
      />
    </div>
  );
}
