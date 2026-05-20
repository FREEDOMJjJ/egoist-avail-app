// bc-mascot.jsx — animated chibi mascot
// Original character: chibi guy with spiky white hair + round black shades + dark high-collar uniform.
// Activities: laptop, gaming, beer, wait. Cycles automatically or pinned via tweaks.

// ── Reusable head + body groups ─────────────────────────────────────
function ChibiHead({ blink = true }) {
  return (
    <g>
      {/* Hair big back fluff (spikes, white) — animated group sways */}
      <g style={{ transformOrigin: '100px 90px', animation: 'bcHairSway 3.4s ease-in-out infinite' }}>
        <path d="
          M 56 96
          L 46 78  L 32 60
          L 50 50  L 36 30
          L 60 34  L 50 6
          L 78 30  L 76 2
          L 96 26  L 110 0
          L 118 28 L 134 6
          L 134 32 L 156 14
          L 150 34 L 174 30
          L 162 52 L 180 58
          L 164 72 L 180 82
          L 158 92 L 172 108
          Q 134 104 100 102
          Q 68 104 56 96 Z
        " fill="#ffffff" stroke="#0a0a0a" strokeWidth="2.6" strokeLinejoin="miter" />
        {/* subtle hair shadow streak */}
        <path d="M 78 48 L 96 28 L 108 50 L 100 70 L 86 65 Z" fill="#e8e8e8" opacity="0.7" />
      </g>

      {/* Ears */}
      <ellipse cx="65" cy="89" rx="4" ry="6.5" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8" />
      <ellipse cx="135" cy="89" rx="4" ry="6.5" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8" />

      {/* Face skin */}
      <ellipse cx="100" cy="84" rx="36" ry="33" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2.6" />

      {/* Bangs (front hair over forehead) */}
      <path d="M 68 70 L 60 106 L 78 92 L 84 100 L 90 80 Z"
        fill="#fff" stroke="#0a0a0a" strokeWidth="2.2" strokeLinejoin="miter" />
      <path d="M 95 78 L 100 110 L 108 95 L 114 106 L 122 84 Z"
        fill="#fff" stroke="#0a0a0a" strokeWidth="2.2" strokeLinejoin="miter" />
      <path d="M 128 78 L 138 100 L 134 78 Z"
        fill="#fff" stroke="#0a0a0a" strokeWidth="2.2" strokeLinejoin="miter" />

      {/* Sunglasses */}
      <circle cx="82" cy="88" r="13" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="2.6" />
      <circle cx="118" cy="88" r="13" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="2.6" />
      <line x1="94.5" y1="88" x2="105.5" y2="88" stroke="#0a0a0a" strokeWidth="2.4" />
      {/* Lens highlights */}
      <ellipse cx="77" cy="84" rx="2.6" ry="3" fill="#fff" opacity="0.92" />
      <ellipse cx="113" cy="84" rx="2.6" ry="3" fill="#fff" opacity="0.92" />
      {blink && (
        <>
          <line x1="74" y1="88" x2="90" y2="88" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round"
            style={{ animation: 'bcBlink 4.2s ease-in-out infinite', transformOrigin: '82px 88px' }} />
          <line x1="110" y1="88" x2="126" y2="88" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round"
            style={{ animation: 'bcBlink 4.2s ease-in-out infinite', transformOrigin: '118px 88px' }} />
        </>
      )}

      {/* Mouth — small open smile */}
      <path d="M 93 104 Q 100 113 107 104 Z" fill="#ff8aa6" stroke="#0a0a0a" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M 95 105 Q 100 108 105 105" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.7" />

      {/* Tiny cheek blush (pink dot) */}
      <ellipse cx="75" cy="100" rx="3" ry="2" fill="#ff99cc" opacity="0.55" />
      <ellipse cx="125" cy="100" rx="3" ry="2" fill="#ff99cc" opacity="0.55" />
    </g>
  );
}

function ChibiTorso() {
  return (
    <g>
      {/* Neck shadow */}
      <rect x="92" y="113" width="16" height="6" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.5" />
      {/* Body */}
      <path d="
        M 76 118
        Q 70 132 66 152
        L 60 198
        Q 100 206 140 198
        L 134 152
        Q 130 132 124 118
        Z
      " fill="#202024" stroke="#0a0a0a" strokeWidth="2.6" />
      {/* High collar */}
      <path d="M 82 116 L 100 124 L 118 116 L 118 128 L 100 132 L 82 128 Z"
        fill="#101012" stroke="#0a0a0a" strokeWidth="2" />
      {/* Gold button */}
      <circle cx="120" cy="142" r="3" fill="#e3b948" stroke="#0a0a0a" strokeWidth="0.9" />
      <circle cx="120" cy="142" r="1" fill="#fff" opacity="0.7" />
      {/* Seam */}
      <line x1="100" y1="132" x2="100" y2="198" stroke="#fff" strokeWidth="0.7" opacity="0.18" />
    </g>
  );
}

// ── Activity scenes ─────────────────────────────────────────────────

function LaptopScene() {
  return (
    <>
      <ChibiTorso />
      {/* Laptop screen back */}
      <g>
        <path d="M 50 168 L 150 168 L 156 142 L 44 142 Z"
          fill="#1a1a1f" stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round" />
        {/* Screen glow */}
        <path d="M 54 165 L 146 165 L 152 145 L 48 145 Z"
          fill="#0a0a0a" stroke="none" />
        {/* EG logo on screen */}
        <text x="100" y="160" textAnchor="middle"
          fontFamily="Permanent Marker, system-ui" fontSize="14"
          fill="#ff99cc">EG</text>
      </g>
      {/* Laptop base */}
      <path d="M 40 178 L 160 178 L 168 200 L 32 200 Z"
        fill="#2a2a2f" stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="46" y="180" width="108" height="14" rx="2" fill="#0a0a0a" />
      {/* keyboard dots */}
      {Array.from({ length: 24 }).map((_, i) => (
        <rect key={i}
          x={50 + (i % 12) * 8.7}
          y={182 + Math.floor(i / 12) * 5.5}
          width="6.5" height="3.5" rx="0.8"
          fill={i === 9 || i === 17 ? '#ff99cc' : '#3a3a3a'} />
      ))}
      {/* Hands on keys — alternating tap */}
      <g style={{ transformOrigin: '70px 185px', animation: 'bcTapL 0.7s ease-in-out infinite' }}>
        <path d="M 66 168 Q 60 178 64 188 L 76 188 L 78 174 Z"
          fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <g style={{ transformOrigin: '130px 185px', animation: 'bcTapR 0.7s ease-in-out infinite' }}>
        <path d="M 134 168 Q 140 178 136 188 L 124 188 L 122 174 Z"
          fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2" strokeLinejoin="round" />
      </g>
      {/* Click/key sparkles */}
      <g style={{ animation: 'bcSparkle 0.9s linear infinite' }}>
        <text x="56" y="172" fontSize="8" fill="#ff99cc" fontFamily="Nunito">✦</text>
        <text x="145" y="170" fontSize="6" fill="#fff" fontFamily="Nunito" opacity="0.8">·</text>
      </g>
      <ChibiHead />
    </>
  );
}

function BeerScene() {
  return (
    <>
      <ChibiTorso />
      {/* left arm down at side */}
      <path d="M 70 130 Q 56 160 60 188 L 70 192 Q 74 168 82 138 Z"
        fill="#202024" stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round" />
      <ellipse cx="64" cy="190" rx="6" ry="5" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2" />
      {/* right arm up holding mug — tilts via animation */}
      <g style={{ transformOrigin: '124px 124px', animation: 'bcSip 3.4s ease-in-out infinite' }}>
        <path d="M 122 124 L 138 116 L 156 130 L 148 142 L 130 134 Z"
          fill="#202024" stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round" />
        {/* mug */}
        <g transform="translate(140 102)">
          <rect x="-14" y="-18" width="28" height="34" rx="3" fill="#fafaf7" stroke="#0a0a0a" strokeWidth="2.4" />
          {/* foam */}
          <path d="M -14 -16 Q -10 -24 -4 -18 Q 0 -26 6 -18 Q 12 -24 14 -16 L 14 -10 L -14 -10 Z"
            fill="#fff" stroke="#0a0a0a" strokeWidth="2.2" />
          {/* beer line */}
          <line x1="-14" y1="-2" x2="14" y2="-2" stroke="#0a0a0a" strokeWidth="1.2" opacity="0.3" />
          {/* handle */}
          <path d="M 14 -8 Q 24 -4 24 4 Q 24 12 14 12" fill="none" stroke="#0a0a0a" strokeWidth="2.4" />
          {/* hand grabbing mug */}
          <ellipse cx="-14" cy="6" rx="6" ry="5" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2" />
        </g>
        {/* bubbles */}
        <circle cx="138" cy="86" r="1.8" fill="#fff" opacity="0.7">
          <animate attributeName="cy" values="92;78" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="146" cy="86" r="1.4" fill="#fff" opacity="0.7">
          <animate attributeName="cy" values="92;76" dur="1.4s" begin="0.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="1.4s" begin="0.4s" repeatCount="indefinite" />
        </circle>
      </g>
      <ChibiHead />
    </>
  );
}

function GamingScene() {
  return (
    <>
      <ChibiTorso />
      {/* Both arms forward */}
      <path d="M 76 124 Q 64 150 76 168 L 92 162 L 88 132 Z"
        fill="#202024" stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M 124 124 Q 136 150 124 168 L 108 162 L 112 132 Z"
        fill="#202024" stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round" />
      {/* Controller — held in both hands forward, slightly wiggles */}
      <g style={{ transformOrigin: '100px 165px', animation: 'bcWiggle 1.3s ease-in-out infinite' }}>
        {/* base */}
        <path d="
          M 60 162
          Q 50 168 56 184
          Q 70 192 84 184
          L 116 184
          Q 130 192 144 184
          Q 150 168 140 162
          Z
        " fill="#1a1a1f" stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round" />
        {/* D-pad */}
        <rect x="66" y="170" width="10" height="3" fill="#fafaf7" />
        <rect x="69" y="167" width="4" height="9" fill="#fafaf7" />
        {/* Buttons */}
        <circle cx="128" cy="171" r="2.2" fill="#ff99cc" />
        <circle cx="134" cy="175" r="2.2" fill="#fafaf7" />
        <circle cx="122" cy="175" r="2.2" fill="#fafaf7" />
        <circle cx="128" cy="179" r="2.2" fill="#fafaf7" />
        {/* Sticks */}
        <circle cx="88" cy="178" r="3.5" fill="#0a0a0a" stroke="#fafaf7" strokeWidth="1" />
        <circle cx="112" cy="178" r="3.5" fill="#0a0a0a" stroke="#fafaf7" strokeWidth="1" />
        {/* Hands on controller */}
        <ellipse cx="60" cy="172" rx="7" ry="6" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2" />
        <ellipse cx="140" cy="172" rx="7" ry="6" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2" />
      </g>
      {/* Screen glow particles from below */}
      <g opacity="0.7">
        <text x="48" y="208" fontSize="10" fill="#ff99cc" fontFamily="Nunito">
          ✦
          <animate attributeName="opacity" values="0;1;0" dur="1.6s" repeatCount="indefinite" />
        </text>
        <text x="148" y="212" fontSize="8" fill="#ff99cc" fontFamily="Nunito">
          ·
          <animate attributeName="opacity" values="0;1;0" dur="1.4s" begin="0.5s" repeatCount="indefinite" />
        </text>
      </g>
      <ChibiHead />
    </>
  );
}

function WaitScene() {
  return (
    <>
      <ChibiTorso />
      {/* Arms crossed */}
      <path d="M 76 132 Q 68 148 100 158 L 124 152 L 130 142 Q 110 138 100 142 L 88 135 Z"
        fill="#202024" stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M 124 138 Q 130 156 100 162 L 80 154 L 74 144 Q 96 144 100 148 L 116 136 Z"
        fill="#181819" stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round" />
      {/* Hand tucked at side */}
      <ellipse cx="76" cy="148" rx="5" ry="4" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2" />
      <ellipse cx="124" cy="148" rx="5" ry="4" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2" />
      {/* floating "..." */}
      <g style={{ animation: 'bcDots 1.4s ease-in-out infinite' }}>
        <circle cx="156" cy="60" r="2.4" fill="#ff99cc" stroke="#0a0a0a" strokeWidth="1" />
        <circle cx="166" cy="55" r="2.0" fill="#ff99cc" stroke="#0a0a0a" strokeWidth="1" opacity="0.7" />
        <circle cx="174" cy="49" r="1.6" fill="#ff99cc" stroke="#0a0a0a" strokeWidth="1" opacity="0.45" />
      </g>
      <ChibiHead />
    </>
  );
}

// ── Speech bubble ───────────────────────────────────────────────────
function SpeechBubble({ text }) {
  return (
    <div style={{
      position: 'relative',
      background: EG.paper,
      border: `2px solid ${EG.ink}`,
      borderRadius: 18,
      padding: '12px 16px',
      maxWidth: 170,
      boxShadow: `3px 3px 0 ${EG.ink}`,
      fontFamily: '"Nunito", system-ui',
      fontWeight: 800, fontSize: 14, lineHeight: 1.25,
      color: EG.ink,
      animation: 'bcBubble 3s ease-in-out infinite',
    }}>
      {text}
      {/* Pointer */}
      <div style={{
        position: 'absolute', right: -14, top: 24,
        width: 0, height: 0,
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        borderLeft: `14px solid ${EG.ink}`,
      }} />
      <div style={{
        position: 'absolute', right: -10, top: 26,
        width: 0, height: 0,
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderLeft: `11px solid ${EG.paper}`,
      }} />
      {/* tiny sparkle */}
      <div style={{
        position: 'absolute', left: -6, top: -8,
        fontSize: 14, color: EG.pinkDeep, fontFamily: 'serif',
      }}>✦</div>
    </div>
  );
}

const ACTIVITY_TEXTS = {
  laptop: ['Когда матч?', 'Расписание уже...?', 'Опять никого...'],
  gaming: ['Го катку?', 'Кто в дотку?', 'Я в ранкеде, пиш'],
  beer:   ['Жду пацанов', 'Холодненькое 🍺', 'Где состав??'],
  wait:   ['Скучаю...', 'Когда уже', 'Эй, отметьтесь'],
};
const ACTIVITY_LABELS = {
  laptop: 'ПИШЕТ В ЧАТ',
  gaming: 'РУБИТСЯ',
  beer:   'ОЖИДАЕТ',
  wait:   'ЗАЛИП',
};

// Main mascot widget — paper card containing chibi + bubble
function MascotCard({ mode = 'auto', avail }) {
  const MODES = ['laptop', 'gaming', 'beer', 'wait'];
  const [autoIdx, setAutoIdx] = useState(0);
  const [textIdx, setTextIdx] = useState(0);

  useEffect(() => {
    if (mode !== 'auto') return;
    const t = setInterval(() => setAutoIdx(i => (i + 1) % MODES.length), 6000);
    return () => clearInterval(t);
  }, [mode]);

  useEffect(() => {
    const t = setInterval(() => setTextIdx(i => i + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const activeMode = mode === 'auto' ? MODES[autoIdx] : mode;
  const texts = ACTIVITY_TEXTS[activeMode];
  const text = texts[textIdx % texts.length];

  const counts = countAvail(avail || {});
  const ready = counts.yes >= 5;

  return (
    <PaperCard accent style={{
      padding: '14px 14px 14px 16px',
      display: 'flex', alignItems: 'stretch', gap: 8,
      minHeight: 168,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Halftone opacity={0.06} size={5} />

      {/* Left column — speech + status */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontFamily: '"Nunito", system-ui', fontWeight: 800,
            fontSize: 9.5, letterSpacing: 2.5,
            color: EG.inkDim, marginBottom: 6,
          }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: EG.pink, border: `1px solid ${EG.ink}`,
              verticalAlign: 'middle', marginRight: 6, marginTop: -2,
            }} />
            КИРИЛЛ · {ACTIVITY_LABELS[activeMode]}
          </div>
          <SpeechBubble text={text} />
        </div>
        <div style={{
          marginTop: 10, fontFamily: '"Nunito", system-ui',
          fontWeight: 700, fontSize: 11, color: EG.ink,
        }}>
          {ready ? 'Состав 5/5 — го!' : `На сегодня: ${counts.yes}/5`}
        </div>
      </div>

      {/* Right column — chibi SVG */}
      <div style={{ width: 130, flexShrink: 0, display: 'flex', alignItems: 'flex-end' }}>
        <svg viewBox="0 0 200 220" width="100%" style={{ display: 'block', overflow: 'visible' }}>
          {activeMode === 'laptop' && <LaptopScene />}
          {activeMode === 'beer'   && <BeerScene />}
          {activeMode === 'gaming' && <GamingScene />}
          {activeMode === 'wait'   && <WaitScene />}
        </svg>
      </div>

      <style>{`
        @keyframes bcHairSway {
          0%,100% { transform: rotate(-1.5deg); }
          50%     { transform: rotate(1.5deg); }
        }
        @keyframes bcBlink {
          0%, 92%, 100% { transform: scaleY(0); }
          94%, 98%      { transform: scaleY(1); }
        }
        @keyframes bcTapL {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-3px); }
        }
        @keyframes bcTapR {
          0%,100% { transform: translateY(-3px); }
          50%     { transform: translateY(0); }
        }
        @keyframes bcSparkle {
          0%,100% { opacity: 0.2; }
          50%     { opacity: 1; }
        }
        @keyframes bcSip {
          0%,40%,100% { transform: rotate(0deg); }
          60%,80%     { transform: rotate(-22deg); }
        }
        @keyframes bcWiggle {
          0%,100% { transform: rotate(-2deg); }
          50%     { transform: rotate(2deg); }
        }
        @keyframes bcDots {
          0%,100% { opacity: 0.4; transform: translateY(0); }
          50%     { opacity: 1;   transform: translateY(-3px); }
        }
        @keyframes bcBubble {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-2px); }
        }
      `}</style>
    </PaperCard>
  );
}

Object.assign(window, { MascotCard, SpeechBubble, ChibiHead, ChibiTorso, ACTIVITY_LABELS });
