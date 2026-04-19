━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
REALM 5 — DEFINITIVE REBUILD: "THE NEBULA"  
Theme: Deep space. Particle morphing. Cinematic scroll.  
Text as visual matter — not content, not copy.  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CORE CONCEPT — ONE SENTENCE:  
Millions of particles drift as a living nebula  
in deep space, and as you scroll they collapse,  
ignite, and reform into five exact shapes —  
each one a statement about who you are —  
before finally exploding into a supernova  
and leaving only silence and stars.

DESIGN LAW FOR THIS REALM:  
Text is not on screen. Text IS the screen.  
Every word is made of particles.  
Every sentence is a star being born.  
The visitor does not read — they witness.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
MASTER PALETTE — REALM EXACT VALUES  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\--void:        \#000000   backgrounds, deep space  
\--heaven-deep: \#0D1B2A   nebula depth color  
\--plasma:      \#7B2FBE   particle glow (purple)  
\--neural:      \#00F5FF   particle glow (teal)  
\--sacred:      \#C9A84C   particle glow (gold) — primary  
\--ghost:       \#F0F0F0   text particles when formed  
\--aurora-1:    \#B44FE8   nebula cloud color  
\--aurora-2:    \#4FABE8   nebula cloud color  
\--haze:        \#1A1A2E   mid-ground depth

Typography (only for generating particle targets):  
  Font: "Bebas Neue" — uppercase, tight, bold  
  Body quotes: "DM Mono" — monospace  
  These fonts are rendered to canvas to extract  
  pixel positions for particle targets. The fonts  
  themselves are NEVER visible as HTML text.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
THE FIVE MORPHS — SCROLL STORY  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total scroll height: 600vh.  
Five morphs \+ entry \+ exit \= 7 acts.

Each MORPH \= particles collapsing from nebula  
cloud → forming a shape → holding → dissolving  
back to nebula cloud → next morph begins.

MORPH 1 — YOUR NAME                (scroll 15–30%)  
MORPH 2 — YOUR TITLE               (scroll 30–45%)  
MORPH 3 — A ONE-LINE MANIFESTO     (scroll 45–58%)  
MORPH 4 — THREE CORE WORDS         (scroll 58–72%)  
MORPH 5 — A SINGLE SYMBOL (sigil)  (scroll 72–85%)  
SUPERNOVA                           (scroll 85–100%)

\[PLACEHOLDER — fill before building:\]  
  MORPH 1: \[YOUR FULL NAME in caps\]  
  MORPH 2: \[YOUR TITLE/ROLE in caps\]  
  MORPH 3: \[YOUR 1-LINE MANIFESTO — max 6 words\]  
            e.g. "I BUILD WORLDS FROM NOTHING"  
  MORPH 4: \[THREE WORDS that define you — separated\]  
            e.g. "DESIGN" / "CODE" / "VISION"  
  MORPH 5: A geometric sigil — the same sigil from  
            Realm 0 (The Gate). The site's symbol.  
            This creates a visual rhyme with the  
            beginning — the journey has come full arc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
THE PARTICLE SYSTEM — TECHNICAL FOUNDATION  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARTICLE COUNT: 120,000  
This is the number that makes it feel like  
looking at an actual astronomical object —  
not a particle demo, an actual nebula.  
Each particle is a single point rendered with  
additive blending — they build on each other,  
creating genuine luminosity and glow.

PARTICLE DATA STRUCTURE:  
Each particle stores in Float32Arrays:  
  \- Current position (x, y, z)  
  \- Target position (x, y, z) — morph destination  
  \- Nebula position (x, y, z) — home in the cloud  
  \- Color (r, g, b) — shifts per morph  
  \- Size (float) — varies by role  
  \- Phase offset (float) — for async animation  
  \- Velocity (x, y, z) — for physics  
  \- Life (float) — for twinkle/shimmer

MORPH INTERPOLATION:  
Use vertex shader lerp between current and target:

\`\`\`glsl  
  // vertex.glsl  
  attribute vec3 aCurrentPos;  
  attribute vec3 aTargetPos;  
  attribute vec3 aColor;  
  attribute float aSize;  
  attribute float aPhase;

  uniform float uMorphProgress;  // 0.0 → 1.0  
  uniform float uTime;  
  uniform float uPixelRatio;

  varying vec3 vColor;  
  varying float vAlpha;

  // Smooth cubic ease  
  float easeInOutCubic(float t) {  
    return t \< 0.5  
      ? 4.0 \* t \* t \* t  
      : 1.0 \- pow(-2.0 \* t \+ 2.0, 3.0) / 2.0;  
  }

  void main() {  
    // Staggered morph — each particle arrives  
    // at a slightly different time (aPhase offset)  
    float staggeredProgress \= clamp(  
      (uMorphProgress \- aPhase \* 0.3) / 0.7,  
      0.0, 1.0  
    );  
    float eased \= easeInOutCubic(staggeredProgress);

    // Interpolate position  
    vec3 pos \= mix(aCurrentPos, aTargetPos, eased);

    // Shimmer — tiny position noise when fully formed  
    float shimmer \= sin(uTime \* 2.0 \+ aPhase \* 6.28)  
                    \* (1.0 \- eased) \* 0.08;  
    pos.x \+= shimmer;  
    pos.y \+= shimmer \* 0.7;

    vColor \= aColor;

    // Fade in as particle arrives at target  
    vAlpha \= eased \* 0.85 \+ 0.15;

    // Size — larger when formed, smaller in nebula  
    float sz \= aSize \* (0.4 \+ eased \* 0.6);

    vec4 mvPos \= modelViewMatrix \* vec4(pos, 1.0);  
    gl\_PointSize \= sz \* uPixelRatio  
                   \* (200.0 / \-mvPos.z);  
    gl\_Position \= projectionMatrix \* mvPos;  
  }  
\`\`\`

\`\`\`glsl  
  // fragment.glsl  
  varying vec3 vColor;  
  varying float vAlpha;

  void main() {  
    // Soft circular particle with glow falloff  
    vec2 uv \= gl\_PointCoord \- 0.5;  
    float d \= length(uv);  
    if(d \> 0.5) discard;

    // Soft edge — glowing dot not hard circle  
    float alpha \= (1.0 \- d \* 2.0);  
    alpha \= pow(alpha, 1.5);  // sharpen center  
    alpha \*= vAlpha;

    // Core brighter than edge — true glow look  
    float core \= max(0.0, 1.0 \- d \* 4.0);  
    vec3 col \= vColor \+ core \* vColor \* 0.6;

    gl\_FragColor \= vec4(col, alpha \* 0.9);  
  }  
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
HOW TEXT BECOMES PARTICLES — THE EXTRACTION SYSTEM  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is the technical heart of the realm.  
Text is rendered to an offscreen canvas,  
pixel data is sampled, and bright pixels become  
3D particle target positions.

\`\`\`javascript  
  // /src/realms/Nebula/textToParticles.js

  export function extractTextPositions(  
    text,  
    font,  
    fontSize,  
    targetCount,  
    canvasWidth \= 1200,  
    canvasHeight \= 400  
  ) {  
    const canvas \= document.createElement('canvas')  
    canvas.width \= canvasWidth  
    canvas.height \= canvasHeight  
    const ctx \= canvas.getContext('2d')

    // Render text to canvas  
    ctx.fillStyle \= '\#000000'  
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)  
    ctx.fillStyle \= '\#ffffff'  
    ctx.font \= \`${fontSize}px ${font}\`  
    ctx.textAlign \= 'center'  
    ctx.textBaseline \= 'middle'  
    ctx.fillText(text, canvasWidth / 2, canvasHeight / 2\)

    // Sample bright pixels  
    const imageData \= ctx.getImageData(  
      0, 0, canvasWidth, canvasHeight  
    )  
    const pixels \= imageData.data  
    const positions \= \[\]

    for(let y \= 0; y \< canvasHeight; y \+= 3\) {  
      for(let x \= 0; x \< canvasWidth; x \+= 3\) {  
        const i \= (y \* canvasWidth \+ x) \* 4  
        const brightness \= pixels\[i\] / 255  
        if(brightness \> 0.5) {  
          // Convert 2D pixel → 3D world space  
          // Center the text in world space  
          positions.push({  
            x: (x / canvasWidth \- 0.5) \* 16,  
            y: \-(y / canvasHeight \- 0.5) \* 5,  
            z: (Math.random() \- 0.5) \* 0.4, // slight depth  
          })  
        }  
      }  
    }

    // If we have more positions than particles,  
    // sample evenly. If fewer, duplicate with jitter.  
    return samplePositions(positions, targetCount)  
  }

  function samplePositions(positions, count) {  
    const result \= \[\]  
    const step \= positions.length / count

    for(let i \= 0; i \< count; i++) {  
      const src \= positions\[Math.floor(i \* step)  
                            % positions.length\]  
      result.push({  
        x: src.x \+ (Math.random() \- 0.5) \* 0.05,  
        y: src.y \+ (Math.random() \- 0.5) \* 0.05,  
        z: src.z,  
      })  
    }  
    return result  
  }  
\`\`\`

For MORPH 5 (the sigil): instead of canvas text,  
generate the sigil geometry mathematically —  
a vesica piscis (two overlapping circles).  
Sample points along the circle arcs:

\`\`\`javascript  
  export function extractSigilPositions(count) {  
    const positions \= \[\]  
    const r \= 2.0         // circle radius  
    const offset \= 1.0    // horizontal offset

    // Two circles forming vesica piscis  
    for(let i \= 0; i \< count; i++) {  
      const t \= (i / count) \* Math.PI \* 2  
      const circle \= i \< count / 2 ? \-offset : offset  
      positions.push({  
        x: Math.cos(t) \* r \+ circle,  
        y: Math.sin(t) \* r,  
        z: (Math.random() \- 0.5) \* 0.3  
      })  
    }  
    return positions  
  }  
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
THE NEBULA — IDLE STATE BETWEEN MORPHS  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Between morphs, all particles return to their  
NEBULA POSITION — their home in the cloud.  
This is their resting state. The nebula is alive.

NEBULA SHAPE GENERATION:  
  Particles are distributed across three  
  overlapping volumes to create a realistic  
  nebula cloud with density variation:

\`\`\`javascript  
  function generateNebulaPositions(count) {  
    const positions \= \[\]

    for(let i \= 0; i \< count; i++) {  
      // Which cloud region (weighted distribution)  
      const region \= Math.random()

      let x, y, z  
      if(region \< 0.5) {  
        // Dense core — tight gaussian distribution  
        x \= gaussRandom() \* 4  
        y \= gaussRandom() \* 2  
        z \= gaussRandom() \* 3  
      } else if(region \< 0.8) {  
        // Mid cloud — wider spread  
        x \= gaussRandom() \* 8  
        y \= gaussRandom() \* 4  
        z \= gaussRandom() \* 5  
      } else {  
        // Wispy tendrils — very spread, thin  
        const theta \= Math.random() \* Math.PI \* 2  
        const phi \= Math.random() \* Math.PI  
        const r \= 8 \+ Math.random() \* 6  
        x \= r \* Math.sin(phi) \* Math.cos(theta)  
        y \= r \* Math.cos(phi) \* 0.4 // flat disc  
        z \= r \* Math.sin(phi) \* Math.sin(theta)  
      }

      positions.push({ x, y, z })  
    }  
    return positions  
  }

  function gaussRandom() {  
    // Box-Muller transform  
    const u \= 1 \- Math.random()  
    const v \= Math.random()  
    return Math.sqrt(-2 \* Math.log(u))  
           \* Math.cos(2 \* Math.PI \* v)  
  }  
\`\`\`

NEBULA PARTICLE COLORS:  
  Each particle in nebula state gets a color  
  from the REALM palette based on its region:  
  \- Core (dense center): mix of \--neural \+ \--sacred  
  \- Mid cloud: mix of \--plasma \+ \--aurora-1  
  \- Tendrils: \--aurora-2 \+ \--heaven-deep

  The nebula looks like it has a warm gold/teal  
  core bleeding out into violet and ice-blue edges.  
  Exactly the REALM aesthetic — a heaven in the dark.

NEBULA ANIMATION (in useFrame):  
  Each particle drifts slowly in a curl-noise  
  flow field — never still, never repeating.  
  Amplitude: 0.003 per frame.  
  This makes the nebula breathe.

  Additionally: the entire nebula cloud rotates  
  VERY slowly on the Y axis — 0.015°/frame.  
  Over 60 seconds the nebula has made a quarter turn.  
  It feels cosmological, not animated.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
THE CAMERA — CINEMATIC SCROLL CHOREOGRAPHY  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The camera does not sit still. It moves through  
the nebula like a documentary camera moving  
through space — slow, weighted, deliberate.

Each morph has a unique camera position that  
gives a different perspective on the same particles:

  ENTRY (0–15%):  
    Camera far back: position (0, 2, 18\)  
    Looking at: (0, 0, 0\)  
    The whole nebula visible — vast, overwhelming.

  MORPH 1 — NAME (15–30%):  
    Camera: (0, 0, 10\)  
    The name fills most of viewport — intimate.  
    Camera tilts 2° as particles form.

  MORPH 2 — TITLE (30–45%):  
    Camera: (-1.5, 1, 9\)  
    Slightly off-center — creates dynamism.  
    The title is slightly above center.

  MORPH 3 — MANIFESTO (45–58%):  
    Camera: (0, \-0.5, 11\)  
    Pulled back slightly for the longer text.  
    Camera rises 0.5 units during the hold.

  MORPH 4 — THREE WORDS (58–72%):  
    Camera: (0, 0, 8\)  
    Closest position — the three words are huge.  
    They appear one by one left-to-right.  
    Camera pans slightly right as each appears.

  MORPH 5 — SIGIL (72–85%):  
    Camera: (0, 0, 12\)  
    Full sigil visible. Camera slowly orbits  
    the sigil in a 15° arc — reveals its 3D depth.

  SUPERNOVA (85–100%):  
    Camera rapidly pulls back to (0, 0, 30\)  
    as particles explode outward.

Implement with GSAP ScrollTrigger \+ camera lerp:

\`\`\`javascript  
  // Camera waypoints  
  const waypoints \= \[  
    { scroll: 0,    pos: \[0, 2, 18\],   look: \[0,0,0\] },  
    { scroll: 0.15, pos: \[0, 0, 10\],   look: \[0,0,0\] },  
    { scroll: 0.30, pos: \[-1.5,1, 9\],  look: \[0,0,0\] },  
    { scroll: 0.45, pos: \[0, \-0.5,11\], look: \[0,0,0\] },  
    { scroll: 0.58, pos: \[0, 0, 8\],    look: \[0,0,0\] },  
    { scroll: 0.72, pos: \[0, 0, 12\],   look: \[0,0,0\] },  
    { scroll: 0.85, pos: \[0, 0, 30\],   look: \[0,0,0\] },  
  \]

  // In useFrame: lerp camera toward current waypoint  
  // based on scroll progress interpolation  
  // Use THREE.CatmullRomCurve3 for smooth path  
\`\`\`

MOUSE PARALLAX (always active):  
  Mouse movement creates a gentle parallax —  
  camera drifts ±0.3 units in XY with 0.03 lerp.  
  The nebula appears to have true depth.  
  This is always on, regardless of scroll state.  
  It makes the particles feel they exist in  
  real 3D space — not projected on a flat canvas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
ACT-BY-ACT BREAKDOWN — THE FULL EXPERIENCE  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACT 0 — ENTRY (scroll 0–15%):  
─────────────────────────────  
Camera far back. The full nebula is visible.  
It fills the viewport — a living, breathing  
cloud of 120,000 glowing points of light.

The nebula has visible structure: a bright  
dense core (gold/teal) bleeding into violet  
and blue wisps at the edges. Star-like  
particles at the periphery twinkle independently.

No text. No UI. Just the nebula.

A single prompt materializes from the particles  
themselves — not typed text, but formed by  
\~800 particles collapsing into tiny monospace:

  "scroll to collapse the nebula"

Written in particles at the very bottom of the  
nebula cloud. It looks like it was always there —  
as if the nebula wrote instructions into itself.

After the visitor scrolls and this prompt  
is no longer needed, it dissolves back  
into the nebula. It is never seen again.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACT 1 — MORPH 1: YOUR NAME (scroll 15–30%):  
─────────────────────────────────────────────  
COLLAPSE SEQUENCE (15–22%):  
  The nebula begins to stir. Particles at the  
  edges start drifting toward center — slow at  
  first, then accelerating. It looks like  
  gravitational collapse — a star forming.

  The particles don't fly directly to target.  
  They spiral inward — each particle follows  
  a curved path (add angular momentum):  
\`\`\`javascript  
  // Particle path calculation during collapse  
  const angle \= Math.atan2(  
    target.y \- nebula.y,  
    target.x \- nebula.x  
  )  
  const spiral \= angle \+ progress \* Math.PI \* 0.4  
  // Particle orbits as it approaches target  
\`\`\`

  During collapse: the bloom intensity SPIKES.  
  The gathering particles brighten as they  
  converge — like a protostar igniting.

HOLD (22–27%):  
  YOUR NAME in 120,000 particles.  
  Pure \--ghost (\#F0F0F0) particles —  
  every particle now white/near-white.  
  But with a \--sacred gold glow behind them  
  from the EffectComposer bloom.

  The formed name is not perfectly still.  
  Each particle oscillates ±0.02 units —  
  the letters breathe. They shimmer at  
  different rates (aPhase offset).  
  The name is alive.

  The camera is at (0, 0, 10\) — close.  
  The name fills 70% of the viewport.  
  Typography: "Bebas Neue" sampled at 280px.  
  Letter spacing: 0.15em (built into the canvas  
  rendering before pixel extraction).

DISSOLVE (27–30%):  
  Particles begin drifting apart — not exploding,  
  drifting. Like the name is exhaling.  
  They return toward nebula positions.  
  The name blurs, softens, and is gone.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACT 2 — MORPH 2: YOUR TITLE (scroll 30–45%):  
──────────────────────────────────────────────  
COLLAPSE (30–37%):  
  The nebula reforms — but this time it gathers  
  from a different direction. If Act 1 collapsed  
  inward from all sides (radial), Act 2 collapses  
  from top and bottom simultaneously —  
  two curtains of light closing toward center.  
  Each morph has a DIFFERENT collapse direction.  
  This makes each act feel genuinely new.

  Color during collapse: \--neural teal (\#00F5FF)  
  The title arrives in a cooler palette than the name.

HOLD (37–42%):  
  YOUR TITLE — same particle count, cooler tones.  
  Font: "Bebas Neue" at 200px (slightly smaller).  
  Color mix: 70% \--ghost, 30% \--neural.  
  The result: slightly blue-white text particles.

  A secondary detail: tiny particles (\~2,000)  
  orbit the formed title text at a distance of  
  0.3–0.5 units — they don't form the letters,  
  they orbit them like electrons around a nucleus.  
  This is implemented as:  
\`\`\`javascript  
  // For orbital particles  
  const orbitRadius \= 0.3 \+ Math.random() \* 0.2  
  const orbitSpeed \= 0.3 \+ Math.random() \* 0.5  
  const orbitAngle \= aPhase \* Math.PI \* 2  
  targetX \= letterCentroid.x  
            \+ Math.cos(orbitAngle \+ time \* orbitSpeed)  
            \* orbitRadius  
  targetY \= letterCentroid.y  
            \+ Math.sin(orbitAngle \+ time \* orbitSpeed)  
            \* orbitRadius \* 0.3  
\`\`\`  
  These orbital particles make the title look  
  like a living electrical system — letters  
  crackling with contained energy.

DISSOLVE (42–45%): Particles drift upward and  
outward like smoke — gravity reversed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACT 3 — MORPH 3: YOUR MANIFESTO (scroll 45–58%):  
──────────────────────────────────────────────────  
COLLAPSE (45–51%):  
  This morph is different. The particles don't  
  just converge — they form the text sequentially,  
  WORD BY WORD, left to right.

  Implementation: the manifesto is pre-extracted  
  as 5–6 separate word target arrays.  
  uMorphProgress drives sequential reveal:  
  \- 0.0–0.2: first word forms from particles  
  \- 0.2–0.4: second word forms  
  \- etc.

  Between each word: a brief (200ms) bright flash  
  as the next word's particles ignite —  
  like neon signs clicking on one by one.

  Color: \--sacred gold (\#C9A84C) — the most  
  important palette color. The manifesto is gold.  
  This is the only time in the entire site that  
  a full sentence appears in pure gold particles.

HOLD (51–55%):  
  The full manifesto glows in gold.  
  Font: "Bebas Neue" at 160px — slightly smaller  
  to fit the longer line.  
    
  The camera SLOWLY rises during the hold —  
  from y: \-0.5 to y: \+0.5 over 4 seconds.  
  It looks like the text is descending past a  
  rising camera — cinematic, like a film credit.

  Bloom intensity: maximum for this realm.  
  The gold particles at peak bloom look like  
  they're on fire — genuinely luminous.

DISSOLVE (55–58%):  
  The words dissolve in REVERSE order — right  
  to left. Each word evaporates independently  
  with a 200ms offset. The last word holds  
  longest, then is gone.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACT 4 — MORPH 4: THREE WORDS (scroll 58–72%):  
───────────────────────────────────────────────  
This act breaks the single-line pattern.  
Three words appear in THREE SEPARATE BURSTS —  
each one a supermini-morph of its own.

BURST 1 — FIRST WORD (58–63%):  
  Particles collapse from the LEFT side of screen.  
  The first word forms left-aligned, large (200px).  
  Color: \--plasma purple (\#7B2FBE).  
  It holds for 1 full scroll unit.

BURST 2 — SECOND WORD (63–67%):  
  While the first word dissolves from its right  
  edge, the second word forms from the center.  
  Color: \--neural teal (\#00F5FF).  
  The two words briefly coexist — one fading,  
  one forming. The crossfade creates a purple→teal  
  color shift across the entire particle field.

BURST 3 — THIRD WORD (67–72%):  
  While second dissolves from its left edge,  
  the third forms from the RIGHT side.  
  Color: \--aurora-1 violet (\#B44FE8).

When all three have appeared and dissolved,  
the final frame shows all three words faintly —  
ghost images of where they were, 10% opacity —  
like afterimages on the retina.  
They fade completely over 2 seconds.

The camera pans gently RIGHT during this act —  
following the left→center→right progression.  
Pan total: \-1.5 → 0 → \+1.5 on X axis.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACT 5 — MORPH 5: THE SIGIL (scroll 72–85%):  
─────────────────────────────────────────────  
After four acts of text, the final morph  
is a shape — the REALM sigil from Realm 0\.  
No text. Pure form. Pure symbol.

COLLAPSE (72–77%):  
  The nebula collapses one final time.  
  Slower than all previous morphs — more  
  deliberate, more sacred. 3× slower approach.

  The particles spiral into the sigil shape.  
  Two overlapping circles forming the  
  vesica piscis — the ancient symbol of  
  intersection, duality, creation.

  As they form: EVERY COLOR from the REALM  
  palette is present simultaneously —  
  the sigil is multicolored. The left circle:  
  \--neural teal. The right circle: \--plasma  
  purple. The intersection (vesica): \--sacred gold.

HOLD (77–83%):  
  The sigil rotates slowly — the entire  
  formation spinning 0.2°/frame on Y axis.  
  Because particles have Z depth, the rotation  
  reveals true 3D volume — the sigil is not  
  flat, it has thickness (0.4 units deep).

  The camera orbits 15° around the sigil  
  during the hold — a slow arc that confirms  
  the 3D nature of the formation.

  THIS IS THE MOST BEAUTIFUL FRAME IN THE REALM.  
  The rotating multicolored sigil made of  
  120,000 glowing particles against the void.  
  With bloom: it looks like a nebula that  
  organized itself into a sacred symbol.

DISSOLVE (83–85%):  
  The sigil EXPLODES outward.  
  Not a gentle drift — a true explosion.  
  Every particle launches at high velocity  
  in a radial burst from the sigil center.

  This is the SUPERNOVA trigger.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACT 6 — SUPERNOVA (scroll 85–100%):  
─────────────────────────────────────  
The most visually intense 15 seconds in REALM.

EXPLOSION (85–90%):  
  All 120,000 particles launch outward simultaneously.  
  Each at its own random angle and speed (0.3–2.5  
  units/frame) — but with slight bias toward the  
  viewer (positive Z) so some particles rush  
  TOWARD the camera.

  Particles that rush toward the camera grow in  
  gl\_PointSize as they approach — they become  
  large, blurred points of light screaming past.

  The bloom: at MAXIMUM. The entire screen is  
  briefly overexposed — a fraction of a second  
  of near-white before the particles spread  
  and the bloom settles.

  Camera: rapidly pulling back to z:30.  
  The explosion and the retreat happen together —  
  the visitor is flying backward through the  
  expanding particle cloud. Visceral.

DEBRIS FIELD (90–96%):  
  Particles slow — momentum decays.  
  They drift at low velocity in all directions.  
  The screen has thousands of slow-moving  
  points of light at different depths.

  The particle field now looks exactly like  
  an actual debris field in space — the aftermath  
  of an explosion seen from inside it.

  The colors shift: all particles fade toward  
  \--heaven-deep blue-black (\#0D1B2A) with  
  only occasional flickers of \--sacred gold.  
  The explosion is cooling. The fire is dying.

  The camera settles. Stops retreating.  
  Stillness after violence.

SILENCE (96–100%):  
  Particles reach their final resting positions.  
  They are spread across the entire 3D volume —  
  a sparse star field. No density. No form.  
  Just points of light in the dark.

  This IS a star field. The particles that were  
  your name, your title, your manifesto —  
  they are now stars.

  Complete stillness for 4 scroll-seconds.  
  No animation. The particles do not drift.  
  The camera does not move.  
  The bloom returns to baseline (0.8 intensity).

  Then: the transition to Realm 6 begins.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
ENTRY & EXIT TRANSITIONS  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENTRY (from Realm 4 — The Looking Glass):  
  The Looking Glass's gold pinprick (final frame)  
  persists for 400ms. Then it begins to multiply —  
  from 1 point to 3 to 9 to 27 — a branching  
  of light that fills the screen with points.

  These points ARE the nebula particles initializing.  
  The entry is the nebula assembling from a single  
  seed of light. It takes 1.8 seconds.  
  There is no cut. No flash. Just emergence.

EXIT (to Realm 6 — The Frequency):  
  The star field from the supernova aftermath —  
  those sparse drifting points — they begin to  
  organize. They drift toward horizontal lines.  
  They are becoming the frequency waveform  
  of Realm 6\. The particles from this realm  
  SEED Realm 6's visual system.

  This transition makes the two realms feel  
  like they share matter — the same particles  
  that formed your name are now the waveform  
  you walk through in Realm 6\.  
  This is the most sophisticated transition  
  in the entire REALM site.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
POST-PROCESSING STACK  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use @react-three/postprocessing:

\`\`\`jsx  
  \<EffectComposer\>  
    \<Bloom  
      intensity={bloomIntensity}      // animated 0.8→3.0  
      threshold={0.05}                // very low — glows easily  
      smoothing={0.3}  
      radius={1.2}                    // wide glow radius  
    /\>  
    \<ChromaticAberration  
      offset={\[0.0005, 0.0005\]}      // subtle always-on  
    /\>  
  \</EffectComposer\>  
\`\`\`

Bloom intensity schedule (driven by scroll):  
  Nebula idle:      0.8  (natural glow)  
  Collapse begins:  1.4  (gathering energy)  
  Text formed:      1.8  (peak form)  
  Gold manifesto:   2.4  (maximum — gold burns)  
  Supernova flash:  3.0  (overexposure moment)  
  Debris field:     1.2  (cooling)  
  Star field:       0.8  (back to baseline)

Chromatic aberration spikes to \[0.003, 0.003\]  
during the supernova flash for 300ms —  
the screen briefly splits into RGB channels.  
This is the only glitch effect in the realm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
AUDIO DESIGN  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All Web Audio API. All generated. No files.

NEBULA HUM (always on):  
  Three sine oscillators: 55Hz, 82Hz, 110Hz  
  (perfect fifth \+ octave stack).  
  Vol: 0.015 each. Convolution reverb (8s tail).  
  The nebula has a frequency. It's felt not heard.

COLLAPSE SOUND (per morph, unique):  
  Morph 1 (Name):     Sine sweep 80Hz→400Hz, 1.2s  
  Morph 2 (Title):    Triangle wave chord, 220+330Hz  
  Morph 3 (Manifesto):Sequential note per word,  
                      pentatonic scale ascending  
  Morph 4 (3 words):  Three separate stabs,  
                      one per word formation  
  Morph 5 (Sigil):    Long slow chord swell,  
                      all five palette tones together

TEXT HOLD TONE (per morph):  
  When text is fully formed, a pure resonant  
  tone sustains — the "voice" of that morph.  
  Decays naturally as the morph dissolves.

SUPERNOVA:  
  1\. Sub-bass hit: 40Hz, instant attack, 2s decay,  
     vol 0.4 — felt physically if headphones  
  2\. White noise burst: full spectrum, 0.3s,  
     high-pass 200Hz, vol 0.25  
  3\. Shimmer rise: triangle wave 2000Hz→4000Hz  
     glissando over 1.5s, vol 0.08  
  4\. Then: silence. Complete. 2 full seconds.  
     The silence after the supernova is as  
     important as the supernova itself.

STAR FIELD SILENCE:  
  The ambient hum does not return immediately.  
  It fades in from zero over 4 seconds after  
  the supernova silence ends.  
  The stars are quiet. Space is quiet.  
  We made something, and then it became  
  something else, and that is enough.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
PERSISTENT UI  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REALM LABEL: "V. THE NEBULA"  
  Fixed top-left. 11px DM Mono. \--ghost at 15%.  
  During supernova: fades to 0% completely.  
  Returns after star field settles.

ACT INDICATOR (bottom-right):  
  Five dots. Each fills gold when that act  
  has been witnessed (scroll passed it).  
  12px total. 8px spacing. Very subtle.  
  This is the only piece of UI that tracks  
  the visitor's progress through the acts.

CONSTELLATION NAV:  
  Reduce to 8% opacity in this realm.  
  The particles around it may visually conflict  
  with the nav dots. Minimum visible, still usable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
PERFORMANCE  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

120,000 particles × 3 position arrays (current,  
target, nebula) \+ color \+ metadata:  
  Total Float32Array memory: \~30MB  
  This is acceptable. Pre-allocate on mount.

The vertex shader lerp means ZERO JavaScript  
math per frame for position updates — it all  
runs on GPU. requestAnimationFrame only needs  
to update the uMorphProgress uniform (1 float).

Nebula drift (curl noise per particle):  
  Run in a Web Worker off the main thread.  
  Post updated positions to main thread every  
  4 frames (15fps for nebula drift — invisible  
  at this amplitude). No jank.

Mobile (devicePixelRatio × viewport \< threshold):  
  Reduce to 40,000 particles.  
  The nebula is less dense but still beautiful.  
  All morphs still work — text readability  
  actually IMPROVES at lower particle count  
  because less noise around letterforms.  
  Disable chromatic aberration.  
  Bloom: intensity cap at 2.0.

Target frame rate: 60fps desktop, 30fps mobile.  
Profile specifically on the supernova explosion —  
this is the frame budget danger zone.  
If needed: reduce supernova velocity spread  
and add a 2-frame interpolation buffer.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
VIBE CHECK — THE NEBULA IS READY WHEN:  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ The nebula idle state — before any scrolling —  
  could be screenshotted and sold as digital art  
□ The first collapse (name forming) makes the  
  visitor inhale sharply without warning  
□ Each morph's collapse comes from a different  
  direction — no two feel the same  
□ The gold manifesto at peak bloom looks  
  genuinely like fire made of text  
□ The three-word act (Act 4\) feels like  
  three separate punches — not one long beat  
□ The sigil rotation reveals true 3D depth —  
  it is unmistakably not a flat image  
□ The supernova bloom overexposure lasts  
  exactly long enough to be uncomfortable  
□ The 2-second silence after the supernova  
  is the most powerful moment in the realm  
□ The star field aftermath looks like  
  you just watched a star die and become  
  a constellation  
□ The entry transition (points multiplying from  
  the Looking Glass pinprick) feels inevitable  
□ The exit transition (particles becoming  
  Realm 6's waveform) makes someone say  
  "wait — are those the same particles?"  
□ At 60fps desktop. The particle field  
  is smooth, not stuttering, not flickering  
□ The text is readable in the formed state —  
  this is non-negotiable. If letterforms are  
  not clear, increase particle count density  
  in the text regions specifically  
□ Zero clutter. Zero confusion. The realm  
  does one thing: it shows you a universe  
  that briefly spoke your name.