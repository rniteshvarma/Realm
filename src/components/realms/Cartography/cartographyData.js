// ═══════════════════════════════════════════════════════
//  CARTOGRAPHY DATA — The 5 project worlds
//  All [PLACEHOLDER] fields are ready for real content.
// ═══════════════════════════════════════════════════════

import * as THREE from 'three'

export const PROJECTS = [
  {
    index: 0,
    id: 'genesis',
    title: 'GENESIS SYSTEM',
    role: 'Lead Design Engineer',
    year: '2024',
    tags: ['Design Systems', 'React', 'Figma API'],
    pullQuote: 'The hardest thing isn\'t building the system — it\'s deciding what the system believes.',
    verb: 'ENGINEERED.',
    challenge: 'How do you create a design system that scales across 40 product teams without becoming a cage?',
    metric: '340%',
    metricDesc: 'increase in design-to-dev velocity',
    reflection: 'Constraints, when chosen deliberately, are the most generative force in design.',
    liveUrl: '#',
    readMoreUrl: '#',
    // Orb properties
    orbRadius: 1.1,
    orbShader: 'electric',
    orbColor1: new THREE.Color(0x050a1a), // deep navy
    orbColor2: new THREE.Color(0x0066ff), // electric blue
    orbPosition: new THREE.Vector3(-6, 2, -20),
    // Interior
    interiorType: 'neuralGrid',
    interiorBg: '#000D1A',
    // Audio
    frequency: 174, // foundation
    // Case study
    panels: {
      brief:    'A Fortune 500 fintech company needed a single design system to serve 40 product teams spanning 8 time zones.',
      process:  'Started with a token audit across 140 active components. Built a component genealogy tree. Defined the philosophy before the pixels.',
      solution: 'A living design system with automated Figma-to-code pipelines, semantic token architecture, and a governance model that treats contributors as first-class citizens.',
      impact:   '340% velocity increase. 60% reduction in design inconsistencies. 14 previously siloed teams shipping coherently.',
      learning: 'The real deliverable wasn\'t the system — it was the shared language it gave the organization.',
    }
  },
  {
    index: 1,
    id: 'tidal',
    title: 'TIDAL',
    role: 'Creative Technologist & Frontend Lead',
    year: '2023',
    tags: ['D3.js', 'WebGL', 'Real-time Data'],
    pullQuote: 'Data only matters when it makes someone feel the weight of a number.',
    verb: 'VISUALIZED.',
    challenge: 'Turn 12 years of ocean temperature data into something that could change how people feel about climate change.',
    metric: '2.4M',
    metricDesc: 'unique visitors in first 3 months',
    reflection: 'The most powerful visualization I\'ve ever built is the one that made a senator cry.',
    liveUrl: '#',
    readMoreUrl: '#',
    // Orb properties
    orbRadius: 0.9,
    orbShader: 'ocean',
    orbColor1: new THREE.Color(0x001530), // deep ocean
    orbColor2: new THREE.Color(0x009999), // teal
    orbPosition: new THREE.Vector3(7, -1, -22),
    // Interior
    interiorType: 'liquidMetal',
    interiorBg: '#030D12',
    // Audio
    frequency: 285, // clarity
    panels: {
      brief:    'NOAA needed a public-facing visualization of 12 years of ocean temperature anomaly data.',
      process:  'Synthesized 4TB of raw sensor data. Prototyped 23 visualization forms. Tested emotional response with 40 participants.',
      solution: 'An interactive 3D globe with time-scrubbing, animated thermal layers, and a "witness" mode that plays the full 12 years in 90 seconds.',
      impact:   '2.4M visitors. Featured in The Guardian, WIRED, and Atlantic. Used in 3 congressional briefings.',
      learning: 'Restraint in animation is the difference between data art and propaganda.',
    }
  },
  {
    index: 2,
    id: 'ember',
    title: 'EMBER',
    role: 'Design Director',
    year: '2023',
    tags: ['Brand Identity', 'Motion Design', 'CSS Architecture'],
    pullQuote: 'A brand is not a logo. It\'s a promise made visible.',
    verb: 'DIRECTED.',
    challenge: 'Rebuild a 15-year-old enterprise software brand from zero without alienating its 200,000 existing users.',
    metric: '89%',
    metricDesc: 'brand recognition among target segment post-launch',
    reflection: 'The moment I stopped trying to make it look "modern" was the moment it became timeless.',
    liveUrl: '#',
    readMoreUrl: '#',
    // Orb properties
    orbRadius: 1.2,
    orbShader: 'lava',
    orbColor1: new THREE.Color(0x1a0300), // deep red
    orbColor2: new THREE.Color(0xff4400), // orange
    orbPosition: new THREE.Vector3(-4, -3, -18),
    // Interior
    interiorType: 'digitalGarden',
    interiorBg: '#010800',
    // Audio
    frequency: 396, // liberation
    panels: {
      brief:    'Reposition and rebrand Hestia Software, a 15-year legacy project management tool, to compete in the modern dev-tools market.',
      process:  ' 6-month discovery. 40 stakeholder interviews. 3 brand territory explorations. Tested with existing users before committing line 1 of CSS.',
      solution: 'Ember — a brand built around the metaphor of sustained creative heat. Warm palette, confident typography, motion system rooted in acceleration curves.',
      impact:   '89% unprompted recognition among ICP. 40% increase in trial sign-ups in Q1. Covered in Brand New.',
      learning: 'Legacy users aren\'t resistant to change. They\'re resistant to being abandoned. Bring them with you.',
    }
  },
  {
    index: 3,
    id: 'prism',
    title: 'PRISM',
    role: 'Product Designer & Prototyper',
    year: '2022',
    tags: ['VSCode Extension', 'Semantic Analysis', 'TypeScript'],
    pullQuote: 'The best tools are the ones that disappear — you only notice them when they\'re gone.',
    verb: 'INVENTED.',
    challenge: 'Help developers understand their own codebase structure the way architects understand a building.',
    metric: '47K',
    metricDesc: 'active installs on VSCode Marketplace',
    reflection: 'I shipped a thing that programmers use every day and most of them don\'t know my name. That\'s what success looks like.',
    liveUrl: '#',
    readMoreUrl: '#',
    // Orb properties
    orbRadius: 0.7,
    orbShader: 'ice',
    orbColor1: new THREE.Color(0xc8e8f8), // pale blue
    orbColor2: new THREE.Color(0x00aacc), // crystal cyan
    orbPosition: new THREE.Vector3(8, 4, -25),
    // Interior
    interiorType: 'frequencyRoom',
    interiorBg: '#010510',
    // Audio
    frequency: 417, // change
    panels: {
      brief:    'Design a VSCode extension that gives developers a spatial map of their codebase\'s dependency graph.',
      process:  'Spent 3 weeks as a developer using competing tools. Found the core pain: cognitive load of invisible dependencies. Designed around reducing mental model burden.',
      solution: 'Prism — a living dependency map that updates as you type, surfaces hidden coupling, and suggests refactor opportunities. Zero config, zero friction.',
      impact:   '47K active installs. 4.8/5 marketplace rating. Featured in the VSCode official blog.',
      learning: 'Zero → one is the hardest distance. Not because of the code. Because of the courage to ship before it\'s perfect.',
    }
  },
  {
    index: 4,
    id: 'codex',
    title: 'CODEX',
    role: 'Founder & Full-Stack Developer',
    year: '2022',
    tags: ['Next.js', 'Postgres', 'OpenAI API'],
    pullQuote: 'We don\'t have a knowledge problem. We have a retrieval problem.',
    verb: 'BUILT.',
    challenge: 'Make institutional knowledge — the stuff that lives in people\'s heads — searchable and alive.',
    metric: '12,000',
    metricDesc: 'hours of institutional knowledge captured in beta',
    reflection: 'The hardest part of building knowledge tools is convincing people their knowledge is worth preserving.',
    liveUrl: '#',
    readMoreUrl: '#',
    // Orb properties
    orbRadius: 0.85,
    orbShader: 'circuit',
    orbColor1: new THREE.Color(0x010a03), // dark green
    orbColor2: new THREE.Color(0x00cc44), // bright green
    orbPosition: new THREE.Vector3(-2, 1, -15),
    // Interior
    interiorType: 'archiveWithin',
    interiorBg: '#0A0101',
    // Audio
    frequency: 528, // transformation
    panels: {
      brief:    'Build a knowledge management platform for research teams where information decays as fast as people leave.',
      process:  'Spent 6 months embedded with 3 research teams. Mapped knowledge flows. Found 73% of critical context lived in Slack and heads, not docs.',
      solution: 'Codex — an AI-augmented knowledge graph that captures expertise from conversations, meetings, and code comments. Surfaces relevant context proactively.',
      impact:   '12,000 hours of institutional knowledge captured. 3 enterprise clients in beta. $280K ARR pre-Series A.',
      learning: 'If you\'re building for knowledge workers, you have to understand that time is their scarcest resource. Every extra click is a moral failure.',
    }
  }
]

// Camera path keypoints for each orbital zone
// Each project gets an array of positions the camera moves through
export function buildOrbitalPath(project, prevOrbPos) {
  const c = project.orbPosition
  const from = prevOrbPos || c.clone().add(new THREE.Vector3(0, 0, 60))

  return new THREE.CatmullRomCurve3([
    from,
    c.clone().add(new THREE.Vector3(3,  1.5,  15)),  // approach far
    c.clone().add(new THREE.Vector3(4,  0.5,   5)),  // approach near
    c.clone().add(new THREE.Vector3(-5, 0.8,   2)),  // orbit pt 1
    c.clone().add(new THREE.Vector3(-3, -1.2, -2)),  // orbit pt 2
    c.clone().add(new THREE.Vector3(1,  0.4,   0.5)),// descent
    c.clone().add(new THREE.Vector3(0,  0,    -1.5)),// inside
  ], false, 'catmullrom', 0.5)
}

// Phase boundaries (fraction within a zone 0–1)
export const PHASE = {
  APPROACH_END: 0.20,
  ORBIT_END:    0.40,
  DESCENT_END:  0.60,
  INSIDE_END:   0.85,
  // ESCAPE: 0.85 – 1.0
}

export function getProjectPhase(totalProgress, numProjects) {
  const zoneSize = 1.0 / numProjects
  const rawZone  = totalProgress / zoneSize
  const zoneIndex = Math.min(Math.floor(rawZone), numProjects - 1)
  const zoneProgress = (totalProgress - zoneIndex * zoneSize) / zoneSize

  let phase = 'escape'
  let phaseStart = PHASE.INSIDE_END
  let phaseEnd   = 1.0

  if (zoneProgress < PHASE.APPROACH_END) {
    phase = 'approach'; phaseStart = 0; phaseEnd = PHASE.APPROACH_END
  } else if (zoneProgress < PHASE.ORBIT_END) {
    phase = 'orbit';    phaseStart = PHASE.APPROACH_END; phaseEnd = PHASE.ORBIT_END
  } else if (zoneProgress < PHASE.DESCENT_END) {
    phase = 'descent';  phaseStart = PHASE.ORBIT_END;    phaseEnd = PHASE.DESCENT_END
  } else if (zoneProgress < PHASE.INSIDE_END) {
    phase = 'inside';   phaseStart = PHASE.DESCENT_END;  phaseEnd = PHASE.INSIDE_END
  }

  const phaseProgress = phaseEnd > phaseStart
    ? (zoneProgress - phaseStart) / (phaseEnd - phaseStart)
    : 0

  return {
    projectIndex: zoneIndex,
    zoneProgress,
    phase,
    phaseProgress: Math.max(0, Math.min(1, phaseProgress))
  }
}
