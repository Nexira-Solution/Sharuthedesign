'use client';
import { useId } from 'react';
import { Ruler, Lightbulb } from 'lucide-react';
import './MeasurementGuideVisual.css';

export default function MeasurementGuideVisual({ diagramKey, label, tip, typicalRange, unit = 'inches', stepImage }) {
  const key = (diagramKey || '').toLowerCase();
  const hasImage = Boolean(stepImage && String(stepImage).trim());

  return (
    <div className="mgv-wrap">
      <div className="mgv-stage">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="mgv-photo" src={stepImage} alt={`Measurement guide for ${label}`} loading="lazy" />
        ) : (
          <Diagram diagramKey={key} label={label} unit={unit} />
        )}
      </div>

      {(typicalRange || tip) && (
        <div className="mgv-meta">
          {typicalRange && (
            <p className="mgv-range">
              <Ruler size={15} aria-hidden="true" />
              <span>Typical range</span>
              <b>{typicalRange}</b>
            </p>
          )}
          {tip && (
            <p className="mgv-tip">
              <Lightbulb size={15} aria-hidden="true" />
              <span>{tip}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ---- zone detection: first match wins, so a key never draws two tapes ---- */
const ZONES = [
  ['neckDepth', (k) => k.includes('neck_depth') || k.includes('neck depth')],
  ['neck', (k) => k.includes('neck') || k.includes('collar')],
  ['underbust', (k) => k.includes('underbust') || k.includes('under bust')],
  ['chest', (k) => k.includes('chest') || k.includes('bust')],
  ['shoulder', (k) => k.includes('shoulder')],
  ['wrist', (k) => k.includes('wrist') || k.includes('cuff')],
  ['halfSleeve', (k) => k.includes('half') || k.includes('bicep') || k.includes('arm')],
  ['fullSleeve', (k) => k.includes('sleeve')],
  ['shirtLength', (k) => k.includes('shirt') || k.includes('blazer')],
  ['kurtaLength', (k) => k.includes('kurta') || k.includes('frock') || k.includes('dress') || k.includes('gown')],
  ['waist', (k) => k.includes('waist') || k.includes('stomach')],
  ['hip', (k) => k.includes('hip') || k.includes('seat')],
  ['inseam', (k) => k.includes('inseam')],
  ['thigh', (k) => k.includes('thigh')],
  ['ankle', (k) => k.includes('ankle')],
  ['outseam', (k) => k.includes('length') || k.includes('outseam') || k.includes('floor')],
];

const AMBER = '#b45309';
const NAVY = '#10213f';

function Tag({ x, y, w, text }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="28" rx="6" fill={NAVY} />
      <text x={x + w / 2} y={y + 18} fill="#fff" fontSize="12" fontWeight="700" textAnchor="middle">{text}</text>
    </g>
  );
}

// Horizontal band (chest, waist, hip...) with arrows pointing in from each side
function Band({ id, x, y, w, h = 18, tag, tagY, tagW = 120 }) {
  const mid = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={`url(#${id}tape)`} stroke={AMBER} strokeWidth="2.5" />
      <line x1={x} y1={mid} x2={x + w} y2={mid} stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
      <line x1={x - 60} y1={mid} x2={x - 4} y2={mid} stroke={AMBER} strokeWidth="2" markerEnd={`url(#${id}arrow)`} />
      <line x1={x + w + 60} y1={mid} x2={x + w + 4} y2={mid} stroke={AMBER} strokeWidth="2" markerEnd={`url(#${id}arrow)`} />
      <Tag x={180 - tagW / 2} y={tagY} w={tagW} text={tag} />
    </g>
  );
}

function Ring({ id, cx, cy, rx, ry }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}tape)`} stroke={AMBER} strokeWidth="2.5" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 3" />
    </g>
  );
}

// Straight run from a start dot to an end point
function Run({ id, x1, y1, x2, y2, cap }) {
  return (
    <g>
      <circle cx={x1} cy={y1} r="5.5" fill={AMBER} stroke="#fff" strokeWidth="2" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth="5" strokeDasharray="6 3" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={AMBER} strokeWidth="2.5" markerEnd={`url(#${id}arrow)`} />
      {cap && <line x1={x2 - 22} y1={y2} x2={x2 + 22} y2={y2} stroke={AMBER} strokeWidth="3" />}
    </g>
  );
}

function Tape({ id, zone }) {
  switch (zone) {
    case 'neck':
      return <><Ring id={id} cx={180} cy={104} rx={22} ry={9} /><Tag x={238} y={70} w={112} text="Neck collar" /></>;
    case 'neckDepth':
      return <><Run id={id} x1={168} y1={108} x2={180} y2={165} /><Tag x={188} y={142} w={112} text="Neck depth" /></>;
    case 'chest':
      return <Band id={id} x={120} y={152} w={120} tag="Chest / bust" tagY={118} />;
    case 'underbust':
      return <Band id={id} x={128} y={180} w={104} h={16} tag="Under bust" tagY={146} />;
    case 'shoulder':
      return (
        <>
          <line x1="92" y1="134" x2="268" y2="134" stroke="#f59e0b" strokeWidth="5" strokeDasharray="6 3" />
          <line x1="92" y1="134" x2="268" y2="134" stroke={AMBER} strokeWidth="2.5" markerStart={`url(#${id}arrowS)`} markerEnd={`url(#${id}arrow)`} />
          <circle cx="92" cy="134" r="6" fill={AMBER} stroke="#fff" strokeWidth="2" />
          <circle cx="268" cy="134" r="6" fill={AMBER} stroke="#fff" strokeWidth="2" />
          <Tag x={105} y={98} w={150} text="Shoulder to shoulder" />
        </>
      );
    case 'halfSleeve':
      return (
        <>
          <Run id={id} x1={92} y1={134} x2={84} y2={175} />
          <Ring id={id} cx={84} cy={175} rx={14} ry={6} />
          <Tag x={8} y={196} w={110} text="Half sleeve end" />
        </>
      );
    case 'fullSleeve':
      return (
        <>
          <circle cx="92" cy="134" r="6" fill={AMBER} stroke="#fff" strokeWidth="2" />
          <path d="M 92 134 L 84 185 L 94 246" fill="none" stroke="#f59e0b" strokeWidth="5" strokeDasharray="6 2" />
          <path d="M 92 134 L 84 185 L 94 246" fill="none" stroke={AMBER} strokeWidth="2.5" markerEnd={`url(#${id}arrow)`} />
          <Ring id={id} cx={94} cy={246} rx={13} ry={5} />
          <Tag x={8} y={266} w={110} text="Wrist cuff line" />
        </>
      );
    case 'wrist':
      return <><Ring id={id} cx={94} cy={246} rx={16} ry={8} /><Tag x={8} y={270} w={100} text="Wrist round" /></>;
    case 'shirtLength':
      return <><Run id={id} x1={168} y1={108} x2={168} y2={255} cap /><Tag x={50} y={242} w={96} text="Shirt length" /></>;
    case 'kurtaLength':
      return <><Run id={id} x1={168} y1={108} x2={168} y2={360} cap /><Tag x={50} y={346} w={96} text="Knee / hem" /></>;
    case 'waist':
      return <Band id={id} x={134} y={218} w={92} h={16} tag="Natural waist" tagY={184} />;
    case 'hip':
      return <Band id={id} x={124} y={260} w={112} tag="Fullest hip" tagY={226} />;
    case 'inseam':
      return <><Run id={id} x1={180} y1={270} x2={164} y2={415} /><Tag x={50} y={365} w={104} text="Inseam to ankle" /></>;
    case 'thigh':
      return <><Ring id={id} cx={152} cy={310} rx={20} ry={8} /><Tag x={30} y={298} w={96} text="Upper thigh" /></>;
    case 'ankle':
      return <><Ring id={id} cx={150} cy={410} rx={16} ry={6} /><Tag x={26} y={396} w={96} text="Ankle opening" /></>;
    default:
      return <><Run id={id} x1={232} y1={225} x2={226} y2={395} cap /><Tag x={236} y={295} w={114} text="Waist to floor" /></>;
  }
}

function Diagram({ diagramKey, label, unit }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const zone = (ZONES.find(([, test]) => test(diagramKey)) || [])[0] || 'outseam';

  return (
    <svg viewBox="0 0 360 440" className="mgv-svg" role="img" aria-label={`Diagram for ${label}`}>
      <defs>
        <pattern id={`${id}grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e3e7ee" strokeWidth="1" />
        </pattern>
        <pattern id={`${id}tape`} width="12" height="18" patternUnits="userSpaceOnUse">
          <rect width="12" height="18" fill="#fef08a" />
          <line x1="0" y1="0" x2="0" y2="18" stroke="#ca8a04" strokeWidth="1.2" />
          <line x1="4" y1="0" x2="4" y2="7" stroke="#333" strokeWidth="1" />
          <line x1="8" y1="0" x2="8" y2="5" stroke="#666" strokeWidth="0.8" />
          <line x1="12" y1="0" x2="12" y2="11" stroke="#111" strokeWidth="1.4" />
        </pattern>
        <marker id={`${id}arrow`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={AMBER} />
        </marker>
        <marker id={`${id}arrowS`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 8 1.5 L 0 5 L 8 8.5 z" fill={AMBER} />
        </marker>
      </defs>

      <rect width="360" height="440" fill={`url(#${id}grid)`} rx="10" />

      <g fill="#f8f8f5" stroke="#8a8a83" strokeWidth="1.8">
        <ellipse cx="180" cy="52" rx="26" ry="32" fill="#ece9e2" />
        <path d="M 168 80 L 168 108 L 192 108 L 192 80 Z" fill="#ece9e2" />
        <path d="M 168 108 C 145 110, 115 120, 92 136 C 86 140, 80 152, 82 170 L 94 240 C 96 250, 106 256, 118 256 L 124 235 C 126 215, 134 185, 142 165 C 152 160, 166 158, 180 158 C 194 158, 208 160, 218 165 C 226 185, 234 215, 236 235 L 242 256 C 254 256, 264 250, 266 240 L 278 170 C 280 152, 274 140, 268 136 C 245 120, 215 110, 192 108 Z" />
        <path d="M 150 152 C 160 166, 172 168, 180 168 C 188 168, 200 166, 210 152" fill="none" stroke="#b0b0a8" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M 138 215 C 134 235, 130 258, 126 280 C 122 302, 124 318, 134 326 L 172 326 L 180 270 L 188 326 L 226 326 C 236 318, 238 302, 234 280 C 230 258, 226 235, 222 215 Z" fill="#f6f6f2" />
        <path d="M 134 326 C 132 350, 134 390, 136 415 L 164 415 L 170 338 L 172 326 Z" fill="#f2f2ee" />
        <path d="M 226 326 C 228 350, 226 390, 224 415 L 196 415 L 190 338 L 188 326 Z" fill="#f2f2ee" />
        <line x1="80" y1="418" x2="280" y2="418" stroke="#b0b0a8" strokeWidth="1.2" strokeDasharray="4 4" />
      </g>

      <Tape id={id} zone={zone} />

      <g transform="translate(180, 424)">
        <rect x="-100" y="-13" width="200" height="26" rx="8" fill={NAVY} />
        <text y="5" fill="#fff" fontSize="12" fontWeight="700" textAnchor="middle">{label} ({unit})</text>
      </g>
    </svg>
  );
}