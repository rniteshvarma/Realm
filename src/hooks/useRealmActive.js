import { createContext, useContext } from 'react'

// Provided by each realm section in App.jsx. `true` while the section is on
// (or about to come on) screen — scenes use it to pause their WebGL render
// loop when the visitor is elsewhere so only one realm draws at a time.
export const RealmActiveContext = createContext(true)

export const useRealmActive = () => useContext(RealmActiveContext)

// Convenience for <Canvas frameloop={...}>
export const useRealmFrameloop = () => (useRealmActive() ? 'always' : 'never')
