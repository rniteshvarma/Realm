import { create } from 'zustand'
import { IS_LOW } from '../utils/deviceTier'

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

  // ── Big Bang (Singularity click) — starts the universe expanding ──
  bigBang: false,
  setBigBang: () => set({ bigBang: true }),

  // ── Sound state ──────────────────────────────────────
  soundEnabled: false,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setSoundEnabled: (v) => set({ soundEnabled: v }),

  // ── Cursor state ─────────────────────────────────────
  // 'default' | 'hover-link' | 'hover-drag' | 'active'
  cursorState: 'default',
  setCursorState: (state) => set({ cursorState: state }),

  // ── Performance mode ─────────────────────────────────
  // Decided once at startup (utils/deviceTier) so chapters mounting at any
  // moment read the same answer
  performanceLow: IS_LOW,
  quality: IS_LOW ? 'LOW' : 'HIGH', // 'AUTO' | 'LOW' | 'HIGH'
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
    patient:    false, // Egg 1: First Light — sit still 12s, find the ghost word
    morse:      false, // Egg 2: Pulsar — tap the neutron star three times
    'freq-ghost': false, // Egg 3: Dyson Swarm — close the shell to 100%
    observer:   false, // Egg 4: Loading — wait 33s before touching the singularity
  },
  allEggsFound: false,

  // ── Realm VI — Signal / Looking Glass ─────────────
  signalShattered: false,
  setSignalShattered: (v) => set({ signalShattered: v }),

  discoverEgg: (eggId) => set((s) => {
    if (s.loreEggs[eggId]) return s // already found — no state change
    const updated = { ...s.loreEggs, [eggId]: true }
    const allFound = Object.values(updated).every(Boolean)
    return { loreEggs: updated, allEggsFound: allFound }
  }),
}))
