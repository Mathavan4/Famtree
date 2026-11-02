// Storage service for Family Legacy platform with LocalStorage persistence

const MEMBERS_KEY = 'family_legacy_members';
const RELATIONSHIPS_KEY = 'family_legacy_relationships';
const MEMORIES_KEY = 'family_legacy_memories';

// Sample demonstration dataset reflecting the Sterling-Montgomery family heritage
export const sampleFamilyData = {
  members: [
    {
      id: 'member-arthur',
      firstName: 'Arthur',
      middleName: 'William',
      lastName: 'Sterling',
      position: 'Grandfather',
      bio: 'Master clockmaker and horologist. Traveled from Aberdeen across the North Atlantic with an oak tool chest and apprentice journals. Founded the Canongate Guild workshop in 1938 and taught three generations the precision of timekeeping and devotion to family.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      createdAt: '2026-01-10T10:00:00Z',
      generationLevel: 0
    },
    {
      id: 'member-eleanor',
      firstName: 'Eleanor',
      middleName: 'Vance',
      lastName: 'Sterling',
      position: 'Grandmother',
      bio: 'Botanist, herbalist, and quiet strength of the household. Pioneered Lake District herbarium collections, pressing wildflowers by hand in leather-bound volumes. Known for her Sunday orchard gatherings and her handwritten remedy journals.',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      createdAt: '2026-01-10T10:05:00Z',
      generationLevel: 0
    },
    {
      id: 'member-thomas',
      firstName: 'Thomas',
      middleName: 'Edward',
      lastName: 'Sterling',
      position: 'Father',
      bio: 'Heritage restoration architect. Dedicated his career to preserving ancient stone structures and churches across the Scottish Borders. Custodian of family ledgers, blueprints, and maritime compasses passed down from his father Arthur.',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      createdAt: '2026-01-12T11:00:00Z',
      generationLevel: 1
    },
    {
      id: 'member-claire',
      firstName: 'Claire',
      middleName: 'Montgomery',
      lastName: 'Sterling',
      position: 'Mother',
      bio: 'Biomedical researcher and oral historian. Spent decades recording life narratives from rural coastal communities in Ireland alongside her scientific publications. Believes that every family story is a living strand of DNA.',
      photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
      createdAt: '2026-01-12T11:05:00Z',
      generationLevel: 1
    },
    {
      id: 'member-sophia',
      firstName: 'Sophia',
      middleName: 'Grace',
      lastName: 'Sterling',
      position: 'Daughter',
      bio: 'Documentary historian and author. Founder of the family digital archive. Passionate about preserving ancestors’ spoken recollections and restoring vintage photographs so future generations understand their roots.',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      createdAt: '2026-01-15T09:30:00Z',
      generationLevel: 2
    },
    {
      id: 'member-julian',
      firstName: 'Julian',
      middleName: 'Montgomery',
      lastName: 'Sterling',
      position: 'Son',
      bio: 'Software engineer and chamber cellist. Plays grandfather Arthur’s favorite Scottish airs on a restored 1920s cello and maintains the family photographic archives.',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      createdAt: '2026-01-15T09:35:00Z',
      generationLevel: 2
    }
  ],
  relationships: [
    {
      id: 'rel-arthur-eleanor',
      personAId: 'member-arthur',
      personBId: 'member-eleanor',
      type: 'couple',
      label: 'Husband & Wife',
      notes: 'Married in Kendal, 1920'
    },
    {
      id: 'rel-arthur-thomas',
      personAId: 'member-arthur',
      personBId: 'member-thomas',
      type: 'parent-child',
      label: 'Father to Son'
    },
    {
      id: 'rel-eleanor-thomas',
      personAId: 'member-eleanor',
      personBId: 'member-thomas',
      type: 'parent-child',
      label: 'Mother to Son'
    },
    {
      id: 'rel-thomas-claire',
      personAId: 'member-thomas',
      personBId: 'member-claire',
      type: 'couple',
      label: 'Husband & Wife',
      notes: 'Married in Edinburgh, 1985'
    },
    {
      id: 'rel-thomas-sophia',
      personAId: 'member-thomas',
      personBId: 'member-sophia',
      type: 'parent-child',
      label: 'Father to Daughter'
    },
    {
      id: 'rel-claire-sophia',
      personAId: 'member-claire',
      personBId: 'member-sophia',
      type: 'parent-child',
      label: 'Mother to Daughter'
    },
    {
      id: 'rel-thomas-julian',
      personAId: 'member-thomas',
      personBId: 'member-julian',
      type: 'parent-child',
      label: 'Father to Son'
    },
    {
      id: 'rel-claire-julian',
      personAId: 'member-claire',
      personBId: 'member-julian',
      type: 'parent-child',
      label: 'Mother to Son'
    }
  ],
  memories: [
    {
      id: 'mem-1',
      memberId: 'member-arthur',
      type: 'photo',
      title: 'Arthur at the High Street Guild Workshop',
      description: 'Examining the escapement gear of a parish mantle clock. Note the brass drafting compass tucked into his waistcoat pocket.',
      url: 'https://images.unsplash.com/photo-1507842229440-a10c036c8be4?auto=format&fit=crop&w=800&q=80',
      date: 'Edinburgh, Autumn 1938',
      createdAt: '2026-01-10T12:00:00Z'
    },
    {
      id: 'mem-2',
      memberId: 'member-arthur',
      type: 'audio',
      title: 'On the Art of Keeping Time (Oral History)',
      description: 'Reel-to-reel magnetic tape recorded during his 80th birthday gathering, reflecting on patience and family devotion.',
      url: 'https://actions.google.com/sounds/v1/water/stream_water.ogg', // Sample playable audio
      duration: '2:45',
      date: 'Recorded December 1968',
      createdAt: '2026-01-10T12:15:00Z'
    },
    {
      id: 'mem-3',
      memberId: 'member-arthur',
      type: 'story',
      title: 'The Atlantic Crossing of 1912',
      content: `In March of 1912, my grandfather Arthur boarded the passenger liner with twenty sovereigns in his coat and an oak tool chest containing his grandfather’s brass calipers. 
      
He wrote to Eleanor every evening on linen paper: 'The ocean is vast, Eleanor, but love is the anchor that holds across three thousand miles of cold salt water.' That chest of tools still sits beside the fireplace in our family home.`,
      date: 'March 1912',
      createdAt: '2026-01-10T12:30:00Z'
    },
    {
      id: 'mem-4',
      memberId: 'member-eleanor',
      type: 'photo',
      title: 'Spring Blossom Harvest in Kendal',
      description: 'Gathering alpine herbs and wild rosemary for the family apothecary ledger.',
      url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=80',
      date: 'Westmorland, May 1928',
      createdAt: '2026-01-10T14:00:00Z'
    },
    {
      id: 'mem-5',
      memberId: 'member-eleanor',
      type: 'story',
      title: 'The Orchard Sunday Tea Tradition',
      content: `Every Sunday afternoon between April and October, Eleanor set three long trestle tables beneath the elderberry trees. 
      
She baked gooseberry tarts and served tea from the Sheffield pewter pot that had belonged to her mother. Children ran barefoot between the bee skeps, and no argument was allowed to pass sunset without reconciliation over warm scones.`,
      date: 'Summer 1945',
      createdAt: '2026-01-10T14:20:00Z'
    },
    {
      id: 'mem-6',
      memberId: 'member-thomas',
      type: 'photo',
      title: 'Surveying Dryburgh Abbey Restoration',
      description: 'Inspecting medieval gothic vault ribs with blueprint drafts in hand.',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      date: 'Melrose, 1994',
      createdAt: '2026-01-12T13:00:00Z'
    },
    {
      id: 'mem-7',
      memberId: 'member-claire',
      type: 'audio',
      title: 'Lullabies from the West of Ireland',
      description: 'Claire singing an ancient Gaelic sleep melody passed through five generations of maternal lines.',
      url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_rain_light.ogg',
      duration: '1:50',
      date: 'Dublin, 1990',
      createdAt: '2026-01-12T13:30:00Z'
    },
    {
      id: 'mem-8',
      memberId: 'member-sophia',
      type: 'story',
      title: 'Why I Created the EverRoot Family Legacy',
      content: `I found grandfather Arthur’s pocket watch in a velvet-lined cigar box when I was twelve. Holding it to my ear, the tick was steady, solemn, and alive. 

It struck me that people may leave this earth, but the moments they loved, the laughter they sparked, and the values they lived by deserve a permanent home. This platform is our digital hearthstone.`,
      date: 'Autumn 2025',
      createdAt: '2026-01-15T10:00:00Z'
    }
  ]
};

// Storage helper functions
export const getStoredMembers = () => {
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load members from localStorage', err);
    return [];
  }
};

export const saveStoredMembers = (members) => {
  try {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  } catch (err) {
    console.error('Failed to save members to localStorage', err);
  }
};

export const getStoredRelationships = () => {
  try {
    const raw = localStorage.getItem(RELATIONSHIPS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load relationships from localStorage', err);
    return [];
  }
};

export const saveStoredRelationships = (relationships) => {
  try {
    localStorage.setItem(RELATIONSHIPS_KEY, JSON.stringify(relationships));
  } catch (err) {
    console.error('Failed to save relationships to localStorage', err);
  }
};

export const getStoredMemories = () => {
  try {
    const raw = localStorage.getItem(MEMORIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load memories from localStorage', err);
    return [];
  }
};

export const saveStoredMemories = (memories) => {
  try {
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
  } catch (err) {
    console.error('Failed to save memories to localStorage', err);
  }
};

// Load prebuilt sample data into localStorage
export const loadSampleData = () => {
  saveStoredMembers(sampleFamilyData.members);
  saveStoredRelationships(sampleFamilyData.relationships);
  saveStoredMemories(sampleFamilyData.memories);
  return {
    members: sampleFamilyData.members,
    relationships: sampleFamilyData.relationships,
    memories: sampleFamilyData.memories
  };
};

// Clear all data to return to the empty state
export const clearAllData = () => {
  localStorage.removeItem(MEMBERS_KEY);
  localStorage.removeItem(RELATIONSHIPS_KEY);
  localStorage.removeItem(MEMORIES_KEY);
};

