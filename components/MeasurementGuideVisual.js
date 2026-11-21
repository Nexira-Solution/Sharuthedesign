'use client';
import { Ruler } from 'lucide-react';

// Generates an interactive, beautiful SVG measurement diagram or displays admin instruction photo for each measurement point
export default function MeasurementGuideVisual({
  diagramKey,
  label,
  typicalRange,
  unit = 'inches',
  stepImage,
}) {
  const key = (diagramKey || '').toLowerCase();
  const hasImage = Boolean(stepImage && String(stepImage).trim());

  return (
    <div className="guide-visual-container">
      <div className="visual-stage">
        {hasImage ? (
          <div className="step-photo-view">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={stepImage} alt={`Measurement guide for ${label}`} />
          </div>
        ) : (
          <div className="svg-diagram-wrapper">
            <SvgMannequinDiagram diagramKey={key} label={label} unit={unit} typicalRange={typicalRange} />
          </div>
        )}
      </div>

      {typicalRange && (
        <div className="range-chip-bar">
          <span className="range-chip-lbl">
            <Ruler size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: -1 }} />
            Typical Fit Range
          </span>
          <span className="range-chip-val">{typicalRange}</span>
        </div>
      )}
    </div>
  );
}

function SvgMannequinDiagram({ diagramKey, label, unit }) {
  // Normalize key to body zone
  const isNeck = diagramKey.includes('neck') || diagramKey.includes('collar');
  const isChest = diagramKey.includes('chest') || diagramKey.includes('bust');
  const isUnderbust = diagramKey.includes('underbust');
  const isShoulder = diagramKey.includes('shoulder');
  const isHalfSleeve = diagramKey.includes('half_sleeve') || diagramKey.includes('bicep') || diagramKey.includes('arm');
  const isFullSleeve = diagramKey.includes('full_sleeve') || diagramKey.includes('sleeve');
  const isWrist = diagramKey.includes('wrist') || diagramKey.includes('cuff');
  const isShirtLength = diagramKey.includes('shirt_length') || diagramKey.includes('blazer_length');
  const isKurtaLength = diagramKey.includes('kurta_length') || diagramKey.includes('frock');
  const isWaist = diagramKey.includes('waist') || diagramKey.includes('stomach');
  const isHip = diagramKey.includes('hip') || diagramKey.includes('seat');
  const isInseam = diagramKey.includes('inseam');
  const isOutseam = diagramKey.includes('outseam') || diagramKey.includes('length') || diagramKey.includes('floor');
  const isThigh = diagramKey.includes('thigh');
  const isAnkle = diagramKey.includes('ankle');
  const isNeckDepth = diagramKey.includes('neck_depth');

  return (
    <svg viewBox="0 0 360 440" className="mannequin-svg" xmlns="http://www.w3.org/2000/svg" aria-label={`Diagram for ${label}`}>
      <defs>
        {/* Subtle grid background */}
        <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e8e8e3" strokeWidth="1" />
        </pattern>
        {/* Measuring Tape Pattern */}
        <pattern id="tapePattern" width="12" height="18" patternUnits="userSpaceOnUse">
          <rect width="12" height="18" fill="#fef08a" />
          <line x1="0" y1="0" x2="0" y2="18" stroke="#ca8a04" strokeWidth="1.2" />
          <line x1="4" y1="0" x2="4" y2="7" stroke="#333" strokeWidth="1" />
          <line x1="8" y1="0" x2="8" y2="5" stroke="#666" strokeWidth="0.8" />
          <line x1="12" y1="0" x2="12" y2="11" stroke="#111" strokeWidth="1.4" />
        </pattern>
        {/* Glow filter */}
        <filter id="tapeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#d97706" floodOpacity="0.35" />
        </filter>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#b45309" />
        </marker>
        <marker id="arrowStart" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 8 1.5 L 0 5 L 8 8.5 z" fill="#b45309" />
        </marker>
      </defs>

      {/* Grid Canvas */}
      <rect width="360" height="440" fill="url(#gridPattern)" rx="8" />

      {/* Mannequin Body Silhouette with crisp definition */}
      <g className="body-silhouette" fill="#f4f4f0" stroke="#8a8a83" strokeWidth="1.8">
        {/* Head & Neck */}
        <ellipse cx="180" cy="52" rx="26" ry="32" fill="#ece9e2" stroke="#8a8a83" strokeWidth="1.8" />
        <path d="M 168 80 L 168 108 L 192 108 L 192 80 Z" fill="#ece9e2" />

        {/* Torso & Shoulders */}
        <path
          d="M 168 108
             C 145 110, 115 120, 92 136
             C 86 140, 80 152, 82 170
             L 94 240
             C 96 250, 106 256, 118 256
             L 124 235
             C 126 215, 134 185, 142 165
             C 152 160, 166 158, 180 158
             C 194 158, 208 160, 218 165
             C 226 185, 234 215, 236 235
             L 242 256
             C 254 256, 264 250, 266 240
             L 278 170
             C 280 152, 274 140, 268 136
             C 245 120, 215 110, 192 108
             Z"
          fill="#f8f8f5"
        />

        {/* Chest/Bust Curves */}
        <path d="M 150 152 C 160 166, 172 168, 180 168 C 188 168, 200 166, 210 152" fill="none" stroke="#b0b0a8" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Waist & Hips */}
        <path
          d="M 138 215
             C 134 235, 130 258, 126 280
             C 122 302, 124 318, 134 326
             L 172 326
             L 180 270
             L 188 326
             L 226 326
             C 236 318, 238 302, 234 280
             C 230 258, 226 235, 222 215
             Z"
          fill="#f6f6f2"
        />

        {/* Legs / Trouser */}
        <path
          d="M 134 326
             C 132 350, 134 390, 136 415
             L 164 415
             L 170 338
             L 172 326
             Z"
          fill="#f2f2ee"
        />
        <path
          d="M 226 326
             C 228 350, 226 390, 224 415
             L 196 415
             L 190 338
             L 188 326
             Z"
          fill="#f2f2ee"
        />

        {/* Feet / Ground Line */}
        <line x1="80" y1="418" x2="280" y2="418" stroke="#b0b0a8" strokeWidth="1.2" strokeDasharray="4 4" />
      </g>

      {/* HIGHLIGHTED MEASUREMENT TAPES BY ZONE */}

      {/* 1. NECK / COLLAR */}
      {isNeck && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <ellipse cx="180" cy="104" rx="22" ry="9" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2.5" />
          <ellipse cx="180" cy="104" rx="22" ry="9" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx="180" cy="104" r="4" fill="#d97706" />
          {/* Label callout */}
          <line x1="202" y1="104" x2="265" y2="85" stroke="#b45309" strokeWidth="2" markerStart="url(#arrowStart)" />
          <rect x="238" y="70" width="112" height="28" rx="4" fill="#111" />
          <text x="294" y="88" fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">1. Neck Collar</text>
        </g>
      )}

      {/* 2. CHEST / BUST */}
      {isChest && !isUnderbust && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <rect x="120" y="152" width="120" height="18" rx="4" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2.5" />
          <line x1="120" y1="161" x2="240" y2="161" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="161" x2="116" y2="161" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="300" y1="161" x2="244" y2="161" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="124" y="122" width="112" height="26" rx="4" fill="#111" />
          <text x="180" y="139" fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">Chest / Bust Level</text>
        </g>
      )}

      {/* 3. UNDERBUST */}
      {isUnderbust && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <rect x="128" y="178" width="104" height="16" rx="3" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2.5" />
          <line x1="128" y1="186" x2="232" y2="186" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="124" y="198" width="112" height="26" rx="4" fill="#111" />
          <text x="180" y="215" fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">Under Bust Line</text>
        </g>
      )}

      {/* 4. SHOULDER WIDTH */}
      {isShoulder && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <line x1="92" y1="134" x2="268" y2="134" stroke="#d97706" strokeWidth="5" strokeDasharray="6 3" />
          <circle cx="92" cy="134" r="6" fill="#b45309" stroke="#fff" strokeWidth="2" />
          <circle cx="268" cy="134" r="6" fill="#b45309" stroke="#fff" strokeWidth="2" />
          <line x1="92" y1="134" x2="268" y2="134" stroke="#b45309" strokeWidth="2.5" markerStart="url(#arrowStart)" markerEnd="url(#arrow)" />
          <rect x="115" y="104" width="130" height="26" rx="4" fill="#111" />
          <text x="180" y="121" fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">Shoulder to Shoulder</text>
        </g>
      )}

      {/* 5. SLEEVE (HALF OR FULL) */}
      {(isHalfSleeve || isFullSleeve) && !isWrist && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <circle cx="92" cy="134" r="6" fill="#b45309" stroke="#fff" strokeWidth="2" />
          <path
            d={isHalfSleeve ? 'M 92 134 L 84 175' : 'M 92 134 L 84 185 L 94 246'}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="5"
            strokeDasharray="6 2"
          />
          <path
            d={isHalfSleeve ? 'M 92 134 L 84 175' : 'M 92 134 L 84 185 L 94 246'}
            fill="none"
            stroke="#b45309"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          {isHalfSleeve ? (
            <>
              <ellipse cx="84" cy="175" rx="14" ry="6" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2" />
              <rect x="8" y="160" width="94" height="26" rx="4" fill="#111" />
              <text x="55" y="177" fill="#fff" fontSize="10.5" fontWeight="700" textAnchor="middle">Half Sleeve End</text>
            </>
          ) : (
            <>
              <ellipse cx="94" cy="246" rx="13" ry="5" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2" />
              <rect x="8" y="235" width="94" height="26" rx="4" fill="#111" />
              <text x="55" y="252" fill="#fff" fontSize="10.5" fontWeight="700" textAnchor="middle">Wrist Cuff Line</text>
            </>
          )}
        </g>
      )}

      {/* 6. WRIST / CUFF */}
      {isWrist && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <ellipse cx="94" cy="246" rx="16" ry="8" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2.5" />
          <line x1="94" y1="246" x2="35" y2="280" stroke="#b45309" strokeWidth="2" markerStart="url(#arrowStart)" />
          <rect x="6" y="270" width="100" height="26" rx="4" fill="#111" />
          <text x="56" y="287" fill="#fff" fontSize="10.5" fontWeight="700" textAnchor="middle">Wrist Round</text>
        </g>
      )}

      {/* 7. SHIRT / BLAZER LENGTH */}
      {isShirtLength && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <circle cx="168" cy="108" r="5" fill="#b45309" stroke="#fff" strokeWidth="1.5" />
          <line x1="168" y1="108" x2="168" y2="255" stroke="#f59e0b" strokeWidth="5" strokeDasharray="6 3" />
          <line x1="168" y1="108" x2="168" y2="255" stroke="#b45309" strokeWidth="2.5" markerEnd="url(#arrow)" />
          <line x1="145" y1="255" x2="195" y2="255" stroke="#b45309" strokeWidth="3" />
          <rect x="65" y="240" width="96" height="26" rx="4" fill="#111" />
          <text x="113" y="257" fill="#fff" fontSize="10.5" fontWeight="700" textAnchor="middle">Shirt Length</text>
        </g>
      )}

      {/* 8. KURTA / DRESS / LEHENGA LENGTH */}
      {isKurtaLength && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <circle cx="168" cy="108" r="5" fill="#b45309" stroke="#fff" strokeWidth="1.5" />
          <line x1="168" y1="108" x2="168" y2="360" stroke="#f59e0b" strokeWidth="5" strokeDasharray="6 3" />
          <line x1="168" y1="108" x2="168" y2="360" stroke="#b45309" strokeWidth="2.5" markerEnd="url(#arrow)" />
          <line x1="130" y1="360" x2="206" y2="360" stroke="#b45309" strokeWidth="3" />
          <rect x="65" y="345" width="96" height="26" rx="4" fill="#111" />
          <text x="113" y="362" fill="#fff" fontSize="10.5" fontWeight="700" textAnchor="middle">Knee / Hem</text>
        </g>
      )}

      {/* 9. WAIST / STOMACH */}
      {isWaist && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <rect x="134" y="218" width="92" height="16" rx="3" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2.5" />
          <line x1="134" y1="226" x2="226" y2="226" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="75" y1="226" x2="130" y2="226" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="285" y1="226" x2="230" y2="226" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="120" y="192" width="120" height="26" rx="4" fill="#111" />
          <text x="180" y="209" fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">Natural Waist / Navel</text>
        </g>
      )}

      {/* 10. HIP / SEAT */}
      {isHip && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <rect x="124" y="260" width="112" height="18" rx="4" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2.5" />
          <line x1="124" y1="269" x2="236" y2="269" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="269" x2="120" y2="269" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="300" y1="269" x2="240" y2="269" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="120" y="234" width="120" height="26" rx="4" fill="#111" />
          <text x="180" y="251" fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">Fullest Hip Round</text>
        </g>
      )}

      {/* 11. INSEAM */}
      {isInseam && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <circle cx="180" cy="270" r="5" fill="#b45309" stroke="#fff" strokeWidth="1.5" />
          <line x1="180" y1="270" x2="164" y2="415" stroke="#f59e0b" strokeWidth="5" strokeDasharray="6 3" />
          <line x1="180" y1="270" x2="164" y2="415" stroke="#b45309" strokeWidth="2.5" markerEnd="url(#arrow)" />
          <rect x="65" y="365" width="96" height="26" rx="4" fill="#111" />
          <text x="113" y="382" fill="#fff" fontSize="10.5" fontWeight="700" textAnchor="middle">Inseam to Ankle</text>
        </g>
      )}

      {/* 12. OUTSEAM / TROUSER LENGTH / LEHENGA FLOOR LENGTH */}
      {isOutseam && !isKurtaLength && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <circle cx="232" cy="225" r="6" fill="#b45309" stroke="#fff" strokeWidth="2" />
          <line x1="232" y1="225" x2="226" y2="395" stroke="#f59e0b" strokeWidth="5" strokeDasharray="6 3" />
          <line x1="232" y1="225" x2="226" y2="395" stroke="#b45309" strokeWidth="2.5" markerEnd="url(#arrow)" />
          <line x1="205" y1="395" x2="245" y2="395" stroke="#b45309" strokeWidth="3" />
          <rect x="236" y="295" width="114" height="26" rx="4" fill="#111" />
          <text x="293" y="312" fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">Waist to Floor</text>
        </g>
      )}

      {/* 13. THIGH */}
      {isThigh && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <ellipse cx="152" cy="310" rx="20" ry="8" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2.5" />
          <rect x="45" y="298" width="94" height="26" rx="4" fill="#111" />
          <text x="92" y="315" fill="#fff" fontSize="10.5" fontWeight="700" textAnchor="middle">Upper Thigh</text>
        </g>
      )}

      {/* 14. ANKLE */}
      {isAnkle && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <ellipse cx="150" cy="410" rx="16" ry="6" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2.5" />
          <rect x="42" y="398" width="96" height="26" rx="4" fill="#111" />
          <text x="90" y="415" fill="#fff" fontSize="10.5" fontWeight="700" textAnchor="middle">Ankle Opening</text>
        </g>
      )}

      {/* 15. NECK DEPTH (FRONT/BACK) */}
      {isNeckDepth && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <circle cx="168" cy="108" r="5" fill="#b45309" stroke="#fff" strokeWidth="1.5" />
          <line x1="168" y1="108" x2="180" y2="165" stroke="#f59e0b" strokeWidth="5" strokeDasharray="5 3" />
          <line x1="168" y1="108" x2="180" y2="165" stroke="#b45309" strokeWidth="2.5" markerEnd="url(#arrow)" />
          <rect x="188" y="142" width="102" height="26" rx="4" fill="#111" />
          <text x="239" y="159" fill="#fff" fontSize="10.5" fontWeight="700" textAnchor="middle">Neck Slant Depth</text>
        </g>
      )}

      {/* Bottom measurement point badge */}
      <g transform="translate(180, 420)">
        <rect x="-95" y="-13" width="190" height="26" rx="13" fill="#111" />
        <text x="0" y="4" fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">
          📏 {label} ({unit})
        </text>
      </g>
    </svg>
  );
}
