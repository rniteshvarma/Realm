// ═══════════════════════════════════════════════════════
//  CARTOGRAPHY DATA — 4 real project worlds
//  BRIEF 11 — Realm IV: THE CARTOGRAPHY
// ═══════════════════════════════════════════════════════

import * as THREE from 'three'

export const PROJECTS = [
  {
    index: 0,
    id: 'lighthouse',
    title: 'LIGHTHOUSE',
    role: 'Co-founder, Product & Engineering',
    year: '2023 — Present',
    tags: ['Real-time IoT', 'AI Copilot', 'SaaS'],
    pullQuote: 'A factory floor that talks back.',
    verb: 'BUILT.',
    challenge: 'Manufacturing facilities running blind — no real-time visibility into what machines are doing.',
    metric: '5M+',
    metricDesc: 'events processed daily',
    reflection: 'The hardest part wasn\'t the technology. It was earning trust from people who\'d never used software on a factory floor.',
    liveUrl: 'https://www.wavefuel.in',
    readMoreUrl: 'https://www.wavefuel.in',
    // Orb properties
    orbRadius: 1.2,
    orbShader: 'electric',
    orbColor1: new THREE.Color(0x050a1a),
    orbColor2: new THREE.Color(0x0066ff),
    orbPosition: new THREE.Vector3(-6, 2, -20),
    // Interior
    interiorType: 'neuralGrid',
    interiorBg: '#000D1A',
    // Audio
    frequency: 174,
    // Case study
    panels: {
      brief:    'Enterprise SaaS platform for real-time monitoring and automation across manufacturing — IoT, cloud, AI.',
      process:  'Co-built with enterprise customers from day one. Weekly on-site sessions. Every decision validated against operational reality, not assumptions.',
      solution: 'Lighthouse — real-time event processing at 5M+ events/day, AI copilot for conversational machine control, monitoring dashboards, OEE tracking.',
      impact:   '5+ enterprise deployments. $20K+ ACV. 13% increase in OEE. 50–60% improvement in feature utilization.',
      learning: 'B2B SaaS in manufacturing taught me that the interface with the most impact is often the one that gets out of the way.',
    }
  },
  {
    index: 1,
    id: 'bight',
    title: 'BIGHT',
    role: 'Co-founder, Product & Operations',
    year: '2020 — 2021',
    tags: ['EdTech', 'LMS', 'B2B SaaS'],
    pullQuote: 'Education infrastructure for the next generation.',
    verb: 'LAUNCHED.',
    challenge: 'Universities managing coursework through email threads and spreadsheets.',
    metric: '12+',
    metricDesc: 'engineers and designers led',
    reflection: 'My first real lesson in the distance between "users want this" and "users will change their behavior for this."',
    liveUrl: '#',
    readMoreUrl: '#',
    // Orb properties
    orbRadius: 0.9,
    orbShader: 'ocean',
    orbColor1: new THREE.Color(0x001530),
    orbColor2: new THREE.Color(0x009999),
    orbPosition: new THREE.Vector3(7, -1, -22),
    // Interior
    interiorType: 'digitalGarden',
    interiorBg: '#030D12',
    // Audio
    frequency: 285,
    panels: {
      brief:    'B2B SaaS LMS for universities — centralized coursework, assessment, and academic progress management.',
      process:  'Led cross-functional team of 12+. Defined agile processes, sprint cadences, and QA standards from scratch.',
      solution: 'Full LMS with automated grading, progress tracking, faculty tools, and university admin dashboards.',
      impact:   'Pilot programs with universities. Automated grading reduced workflow time. Measurable improvement in university operational efficiency.',
      learning: 'Co-founding taught me that vision is cheap. Execution is everything. The team that ships wins.',
    }
  },
  {
    index: 2,
    id: 'searce-cloud',
    title: 'CLOUD AT SCALE',
    role: 'Project Manager, Searce',
    year: '2022 — 2023',
    tags: ['AWS', 'GCP', 'Kubernetes'],
    pullQuote: '12 cloud projects. Zero late deliveries.',
    verb: 'DELIVERED.',
    challenge: 'Complex cloud migrations with misaligned client expectations and distributed teams.',
    metric: '100%',
    metricDesc: 'on-time delivery rate',
    reflection: 'Delivery is a trust game. When people believe you\'ll ship, they give you harder problems.',
    liveUrl: '#',
    readMoreUrl: '#',
    // Orb properties
    orbRadius: 0.75,
    orbShader: 'lava',
    orbColor1: new THREE.Color(0x1a0300),
    orbColor2: new THREE.Color(0xff4400),
    orbPosition: new THREE.Vector3(-4, -3, -18),
    // Interior
    interiorType: 'liquidMetal',
    interiorBg: '#010800',
    // Audio
    frequency: 396,
    panels: {
      brief:    'Managed 12 cloud projects in 12 months including 4 simultaneous large-scale migrations on AWS, GCP, and Kubernetes.',
      process:  'Translated technical complexity into clear client language. Weekly alignment. Risk tracking from day one.',
      solution: 'End-to-end project delivery framework — scope definition, execution plans, stakeholder management, escalation paths.',
      impact:   '100% on-time delivery. Lowest escalation rate in the company. Leadership recognition.',
      learning: 'The best project managers make complex work feel calm. Calm is a skill.',
    }
  },
  {
    index: 3,
    id: 'ibm-att',
    title: 'ENTERPRISE PROGRAMS',
    role: 'Project Manager, IBM',
    year: '2020 — 2021',
    tags: ['Agile', 'SAFe', 'Enterprise IT'],
    pullQuote: 'Enterprise scale. Human problems.',
    verb: 'COORDINATED.',
    challenge: 'Multi-location AT&T programs with hundreds of stakeholders and zero tolerance for delay.',
    metric: 'Multi-location',
    metricDesc: 'enterprise programs delivered',
    reflection: 'IBM is where I learned that process is not bureaucracy — it\'s the language that lets large teams move as one.',
    liveUrl: '#',
    readMoreUrl: '#',
    // Orb properties
    orbRadius: 0.65,
    orbShader: 'circuit',
    orbColor1: new THREE.Color(0x011a01),
    orbColor2: new THREE.Color(0x00ff88),
    orbPosition: new THREE.Vector3(8, 4, -25),
    // Interior
    interiorType: 'archiveWithin',
    interiorBg: '#010510',
    // Audio
    frequency: 417,
    panels: {
      brief:    'Directed multiple enterprise IT programs for AT&T coordinating engineering and business teams across locations.',
      process:  'Agile, SAFe, and Waterfall. Adapted framework to project needs. Sprint planning, backlog prioritization, milestone tracking.',
      solution: 'Standardized reporting and stakeholder dashboards in JIRA and IBM tools. Improved executive visibility.',
      impact:   'Complex multi-location initiatives delivered on time and within budget. Improved efficiency and reduced delays.',
      learning: 'Large organizations move slowly by design. Your job is to find the path of least resistance without cutting corners.',
    }
  },
]

// Camera path keypoints for each orbital zone
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
