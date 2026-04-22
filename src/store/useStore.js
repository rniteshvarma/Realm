import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // ── Realm state ──────────────────────────────────────
  // 0=Gate 1=Manifesto 2=Forge 3=Cartography 4=Nebula 5=Frequency 6=LookingGlass
  realm: 0,
  setRealm: (realm) => set({ realm }),

  // ── Loading state ────────────────────────────────────
  isLoading: true,
  loadProgress: 0,
  setLoadProgress: (p) => set({ loadProgress: p }),
  setReady: () => set({ isLoading: false, realm: 1 }),

  // ── Sound state ──────────────────────────────────────
  soundEnabled: false,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setSoundEnabled: (v) => set({ soundEnabled: v }),

  // ── Cursor state ─────────────────────────────────────
  // 'default' | 'hover-link' | 'hover-drag' | 'active'
  cursorState: 'default',
  setCursorState: (state) => set({ cursorState: state }),

  // ── Performance mode ─────────────────────────────────
  performanceLow: false,
  quality: 'HIGH', // 'AUTO' | 'LOW' | 'HIGH'
  setPerformanceLow: (v) => set({ performanceLow: v }),
  setQuality: (q) => set({ quality: q }),

  // ── Mouse position (normalized 0-1) ──────────────────
  mouse: { x: 0.5, y: 0.5 },
  setMouse: (x, y) => set({ mouse: { x, y } }),

  // ── Project state (Realm 3 — Cartography) ────────────
  activeProject: null, // null | { id, title, role, image }
  setActiveProject: (project) => set({ activeProject: project }),

  // ── Visited realms (for Constellation Nav) ───────────
  visitedRealms: new Set([0]),
  markRealmVisited: (realmIndex) => set((s) => ({
    visitedRealms: new Set([...s.visitedRealms, realmIndex])
  })),

  // ── Lore / Easter Egg System ─────────────────────────
  // Egg IDs: 'patient' | 'morse' | 'freq-ghost' | 'observer'
  loreEggs: {
    patient:    false, // Egg 1: Manifesto — idle 12s → ghost word
    morse:      false, // Egg 2: Looking Glass — triple-click compass
    'freq-ghost': false, // Egg 3: Frequency — full 5-segment scroll
    observer:   false, // Egg 4: Loading — wait 33s before clicking
  },
  allEggsFound: false,

  // ── Realm VI — Signal / Looking Glass ─────────────
  signalShattered: false,
  setSignalShattered: (v) => set({ signalShattered: v }),

  discoverEgg: (eggId) => set((s) => {
    if (s.loreEggs[eggId]) return {} // already found
    const updated = { ...s.loreEggs, [eggId]: true }
    const allFound = Object.values(updated).every(Boolean)
    return { loreEggs: updated, allEggsFound: allFound }
  }),
}))
