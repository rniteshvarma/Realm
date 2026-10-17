// ═══════════════════════════════════════════════════════════════════════
//  THE VOYAGE — chapter map
//  One continuous flight. Each section is a stop; each stop is a chapter
//  of the story. `realm` matches data-realm on the section in App.jsx.
// ═══════════════════════════════════════════════════════════════════════

export const CHAPTERS = [
  { realm: 1,  key: 'first-light',   name: 'FIRST LIGHT',     stamp: 'T+0',          nav: 'FIRST LIGHT' },
  { realm: 2,  key: 'accretion',     name: 'ACCRETION',       stamp: 'T+2013',       nav: 'ACCRETION' },
  { realm: 3,  key: 'ring-dive',     name: 'THE RING DIVE',   stamp: 'T+2017',       nav: 'THE RING DIVE' },
  { realm: 4,  key: 'gravity-assist',name: 'GRAVITY ASSIST',  stamp: 'T+2019',       nav: 'GRAVITY ASSIST' },
  { realm: 5,  key: 'cartography',   name: 'THE CARTOGRAPHY', stamp: 'T+2020',       nav: 'THE CARTOGRAPHY' },
  { realm: 6,  key: 'nursery',       name: 'STELLAR NURSERY', stamp: 'T+ALWAYS',     nav: 'STELLAR NURSERY' },
  { realm: 7,  key: 'pulsar',        name: 'PULSAR',          stamp: 'T+EVERY DAY',  nav: 'PULSAR' },
  { realm: 8,  key: 'dyson',         name: 'DYSON SWARM',     stamp: 'T+NOW',        nav: 'DYSON SWARM' },
  { realm: 9,  key: 'event-horizon', name: 'EVENT HORIZON',   stamp: 'T+?',          nav: 'EVENT HORIZON' },
  { realm: 10, key: 'transcendence', name: 'TRANSCENDENCE',   stamp: 'T+∞',          nav: 'TRANSCENDENCE', locked: true },
  { realm: 11, key: 'ascension',     name: 'ASCENSION',       stamp: 'T+∞',          nav: 'ASCENSION',     locked: true },
]

export const TOTAL_CHAPTERS = CHAPTERS.length
export const FIRST_LOCKED_REALM = 10

export const chapterFor = (realm) => CHAPTERS.find((c) => c.realm === realm)
