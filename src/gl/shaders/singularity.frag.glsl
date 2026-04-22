// singularity.frag.glsl  v4 — KERR warm palette
//
// Implements BRIEF 10 visual requirements:
//   • Warm thermal palette: dark red → orange → gold → white-hot
//   • Power-4 Doppler: left side blazes, right side near-black
//   • 5-octave FBM plasma filaments for disk texture
//   • Warm void background (#1C0A00 tinted, not pure black)
//   • Photon ring in warm cream (#FFE8B0)
//   • uSuckIn: UV warp + vignette collapse for the finale
//   • uOrbitAngle: rotates FBM texture, creating orbit parallax
//   • Camera distance/height → zoom + inclination

precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;
uniform float uOrbitAngle;      // camera orbit angle (slowly drifts, controls FBM parallax)
uniform float uCameraDistance;  // physical distance units (30 → 0.5)
uniform float uCameraHeight;    // elevation above disk plane (6 → 0.3)
uniform float uSuckIn;          // 0→1 finale pull
uniform float uDiskFade;        // 1→0 at very end

varying vec2 vUv;

#define PI  3.14159265359
#define EPS 0.0001

// ─── Noise / FBM ─────────────────────────────────────────────────────────────

float h(vec2 p) {
    p  = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h(i), h(i + vec2(1,0)), f.x),
               mix(h(i + vec2(0,1)), h(i + vec2(1,1)), f.x), f.y);
}

// 5-octave FBM — matches brief spec for plasma filaments
float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p  = p * 2.1 + vec2(1.7, 9.2);
        a *= 0.5;
    }
    return v;
}

// ─── Warm thermal color (KERR palette from BRIEF 10) ─────────────────────────

vec3 thermalColor(float temp) {
    // dark red → orange → hot gold → white-hot
    vec3 darkRed  = vec3(0.40, 0.04, 0.00);   // outer disk, receding side
    vec3 orange   = vec3(0.80, 0.35, 0.00);   // mid disk
    vec3 hotGold  = vec3(1.00, 0.71, 0.20);   // inner disk (#FFD580)
    vec3 whiteHot = vec3(1.00, 0.95, 0.85);   // core plasma (>10^10 K)

    if (temp < 0.30) return mix(darkRed, orange,  temp / 0.30);
    if (temp < 0.65) return mix(orange,  hotGold,  (temp - 0.30) / 0.35);
    return             mix(hotGold, whiteHot, (temp - 0.65) / 0.35);
}

// ─── Warm star field ─────────────────────────────────────────────────────────

vec3 stars(vec2 uv) {
    vec3 c = vec3(0.0);
    for (float s = 0.0; s < 3.0; s++) {
        float sc  = 55.0 + s * 88.0;
        vec2  g   = floor(uv * sc);
        vec2  f   = fract(uv * sc);
        float bv  = h(g + s * 17.3 + 0.5);
        if (bv > 0.55) {
            float br  = pow((bv - 0.55) / 0.45, 1.8);
            vec2  sp  = vec2(h(g + s * 3.1), h(g + s * 4.7 + 1.3));
            float d   = length(f - sp);
            float st  = br * smoothstep(0.12, 0.0, d);
            // Warm tint — stars near disk glow slightly orange
            float ti = h(g + s * 6.1 + 8.7);
            vec3 sc2 = ti > 0.75 ? vec3(1.0, 0.92, 0.75)   // warm white
                     : ti > 0.40 ? vec3(0.95, 0.95, 0.90)  // near-white
                                 : vec3(0.90, 0.88, 0.82);  // faint warm
            c += sc2 * st;
        }
    }
    return c;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

void main() {
    float asp   = uResolution.x / uResolution.y;
    vec2  uv    = vUv - 0.5;
    uv.x *= asp;

    // Mouse parallax (subtle)
    uv -= (uMouse - 0.5) * vec2(asp, 1.0) * 0.025;

    // ── Suck-in UV warp ──────────────────────────────────────────────────────
    // As uSuckIn → 1, all pixels collapse toward center
    if (uSuckIn > 0.0) {
        float pull    = uSuckIn * uSuckIn;       // ease-in curve
        float warpStr = 1.0 - pull * 0.85;
        uv *= warpStr;
    }

    // ── Derive zoom and inclination from camera params ────────────────────────
    // At dist=30, scale=1.0. Gets larger as camera approaches.
    float scale = clamp(30.0 / uCameraDistance, 0.2, 20.0);
    // During suck-in: extra zoom as camera rushes in
    if (uSuckIn > 0.0) {
        scale *= 1.0 + uSuckIn * uSuckIn * 1.5;
    }
    uv /= scale;

    float r   = length(uv);
    float phi = atan(uv.y, uv.x);

    // Inclination: elevation angle above disk plane
    float elev = atan(uCameraHeight, max(uCameraDistance, 0.1));
    float sinE = max(sin(elev), 0.025);     // 0 = edge-on, 1 = face-on

    // ── BH visual parameters (fixed in normalised screen units) ──────────────
    float BHR  = 0.13;    // event horizon shadow radius
    float PHR  = 0.154;   // photon sphere (warm cream ring)
    float DIN  = 0.28;    // disk inner edge (ISCO-like)
    float DOUT = 0.72;    // disk outer edge

    // ── Warm void background + lensed stars ──────────────────────────────────
    // Background is dark burgundy-black, not pure #000 — disk warmth fills space
    vec3 col = vec3(0.020, 0.004, 0.000);   // #1C0A00 base

    // Gravitational-lensed star UV
    vec2 bgUV;
    if (r < BHR * 0.5) {
        bgUV = -normalize(uv + EPS) * BHR * 2.5;
    } else {
        float lens = BHR * BHR * 1.5 / max(r * r, BHR * BHR * 0.2);
        bgUV = uv * scale + normalize(uv) * lens;
    }
    // Rotate star field with orbit (parallax)
    float sinO = sin(uOrbitAngle), cosO = cos(uOrbitAngle);
    vec2 bgUVrot = vec2(bgUV.x * cosO - bgUV.y * sinO,
                        bgUV.x * sinO + bgUV.y * cosO);

    col += stars(bgUVrot * 0.3 + vec2(uTime * 0.05, 0.0005));

    // ── Disk: inclined projection ─────────────────────────────────────────────
    // Camera at elevation `elev` above disk plane:
    //   disk_z = screen_y / sin(elev)
    float dX  = uv.x;
    float dZ  = uv.y / sinE;
    float dR  = sqrt(dX * dX + dZ * dZ);
    float dPhi = atan(dZ, dX);

    bool nearSide = (dZ < 0.0);   // near side: between camera and BH

    if (dR > DIN && dR < DOUT && uDiskFade > 0.01) {
        float nR   = (dR - DIN) / (DOUT - DIN);
        float temp = pow(1.0 - nR, 0.75);   // T ∝ r^(-3/4)

        // Keplerian rotation (CCW, orbital speed falls with radius)
        float kV     = 0.38 / pow(max(dR / DIN, 1.0), 0.75);
        // World-angle texture: shifts with orbit angle so FBM rotates as camera orbits
        float orbPhi = dPhi + uOrbitAngle - uTime * kV;

        // ── 5-octave FBM turbulence (BRIEF 10 'plasma filaments') ──────────
        vec2 diskUV  = vec2(orbPhi / (2.0 * PI) + 0.5, nR);
        float turb   = fbm(diskUV * vec2(8.0, 4.0) + uTime * 0.45); // 10x faster
        float bright = fbm(diskUV * vec2(16.0, 6.0) + uTime * 0.85); // 12x faster
        float filam  = pow(bright, 2.5) * 2.0;    // bright streaked filaments

        temp = clamp(temp * (0.5 + turb * 0.5) + filam * 0.3, 0.0, 1.0);

        // Density envelope
        float dens = smoothstep(0.0, 0.25, 1.0 - nR)
                   * smoothstep(DIN, DIN * 1.4, dR)
                   * (0.4 + turb * 0.85);

        // ── DOPPLER BEAMING (power-4, KERR enhanced) ────────────────────────
        // Orbital velocity Keplerian + frame-dragging correction
        float vOrb = sqrt(1.0 / max(dR, DIN)) * (1.0 + 0.9 / pow(max(dR, DIN), 1.5));
        vOrb = min(vOrb, 0.95);
        float beta = vOrb * 0.6;   // visual scale factor

        // Approaching gas always on LEFT of screen (cos(phi) = -1 at phi=PI = left)
        // cosTheta formula validated from Kerr geodesic projection
        float cosTheta = -cos(dPhi);
        float doppler  = pow(max(1.0 - beta * cosTheta, 0.04), -4.0);
        doppler = clamp(doppler, 0.1, 8.0);

        // ── Gravitational redshift ───────────────────────────────────────────
        // Light loses energy climbing out (RS=2*BHR in visual units)
        float redshift = sqrt(1.0 - 2.0 * BHR / max(dR, BHR * 2.1));
        redshift = max(0.1, redshift);

        // ── Thickness in screen y ────────────────────────────────────────────
        float scH   = dR * 0.05 * sinE;
        float thick = exp(-uv.y * uv.y / max(scH * scH * 4.0, EPS));
        float vis   = nearSide ? 1.0 : 0.40;   // far side partially blocked

        vec3 dc = thermalColor(temp) * dens * doppler * redshift * thick * vis * 3.5;
        col += dc * uDiskFade;


    }

    // ── Lensed ghost image (disk visible above/below event horizon) ───────────
    if (uDiskFade > 0.01) {
        float gR     = PHR * 1.10;
        float gW     = 0.016;
        float gMask  = exp(-(r - gR) * (r - gR) / (gW * gW));

        float gPhi   = phi + PI;
        float gKV    = 0.38 / pow(max(gR / DIN, 1.0), 0.75);
        float gOrb   = gPhi + uOrbitAngle - uTime * gKV;
        vec2  gUV    = vec2(gOrb / (2.0 * PI) + 0.5, 0.5);
        float turbG  = fbm(gUV * vec2(8.0, 4.0) + uTime * 0.45) * 0.5 + 0.5;

        float cosG   = -cos(phi + PI);
        float vRelG  = 0.62;
        float doppG  = pow(max(1.0 - vRelG * cosG, 0.04), -4.0);
        doppG = clamp(doppG, 0.1, 8.0);

        col += thermalColor(0.88) * gMask * turbG * doppG * 1.5 * uDiskFade;
    }

    // ── Photon ring (warm cream #FFE8B0 per BRIEF 10) ────────────────────────
    {
        float pDist = abs(r - PHR);
        float pRing = exp(-pDist * pDist / (0.0018 * 0.0018)) * 16.0;
        col += vec3(1.0, 0.91, 0.69) * pRing;   // warm cream
    }

    // ── Event horizon — hard-edge pure black (no soft fade) ──────────────────
    // BRIEF 10: "a clean hard BLACK oval — not fuzzy, not gradient"
    float hMask = step(BHR, r);        // hard step, not smoothstep
    col = mix(vec3(0.0), col, hMask);

    // Very thin soft ramp just at the edge to avoid aliasing (1px)
    float edgeAA = smoothstep(BHR * 0.97, BHR * 1.03, r);
    col = mix(vec3(0.0), col, edgeAA);

    // ── Warm disk ambient glow in surrounding space ───────────────────────────
    // This makes background look dark burgundy rather than pure black
    float diskGlow = exp(-length(uv) * 1.8) * 0.07 * uDiskFade;
    col += vec3(diskGlow * 0.55, diskGlow * 0.09, 0.0);

    // ── Suck-in vignette (Phase B–D in brief) ────────────────────────────────
    {
        float edgeDark  = uSuckIn * 0.95;
        float vigLen    = length(vUv - 0.5);
        float vignette  = 1.0 - vigLen * (1.2 + edgeDark * 3.0);
        vignette = pow(clamp(vignette, 0.0, 1.0), 1.0 + edgeDark * 4.0);
        col *= vignette;
    }

    // ── Tone mapping + gamma ──────────────────────────────────────────────────
    col  = col / (col + 0.70);             // Reinhard
    col  = pow(max(col, 0.0), vec3(0.88)); // gamma ~1/0.88

    gl_FragColor = vec4(col, 1.0);
}
