'use client';
import { useState } from 'react';
import { Ruler, Camera } from 'lucide-react';

// Generates an interactive, beautiful SVG measurement diagram for each measurement point
export default function MeasurementGuideVisual({ diagramKey, label, instruction, tip, typicalRange, unit = 'inches', studioImage }) {
  const [viewMode, setViewMode] = useState(studioImage ? 'photo' : 'diagram');

  const key = (diagramKey || '').toLowerCase();

  return (
    <div className="guide-visual-container">
      {studioImage && (
        <div className="view-mode-toggle" role="tablist" aria-label="Visual Guide Type">
          <button
            type="button"
            className={viewMode === 'diagram' ? 'on' : ''}
            onClick={() => setViewMode('diagram')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <Ruler size={13} /> Tailor Diagram
          </button>
          <button
            type="button"
            className={viewMode === 'photo' ? 'on' : ''}
            onClick={() => setViewMode('photo')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <Camera size={13} /> Studio Reference
          </button>
        </div>
      )}

      <div className="visual-stage">
        {viewMode === 'photo' && studioImage ? (
          <div className="studio-photo-view">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={studioImage} alt={`Reference for ${label}`} />
            <div className="photo-caption">Reference styling: {label}</div>
          </div>
        ) : (
          <div className="svg-diagram-wrapper">
            <SvgMannequinDiagram diagramKey={key} label={label} unit={unit} typicalRange={typicalRange} />
          </div>
        )}
      </div>

      <div className="visual-notes">
        {typicalRange && (
          <div className="benchmark-pill">
            <span className="dot" />
            <strong>Typical Tailor Range:</strong> {typicalRange}
          </div>
        )}
        {tip && (
          <div className="tailor-tip">
            <span className="tip-badge">MASTER TAILOR TIP</span>
            <p>{tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SvgMannequinDiagram({ diagramKey, label, unit, typicalRange }) {
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
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0ed" strokeWidth="1" />
        </pattern>
        {/* Measuring Tape Pattern */}
        <pattern id="tapePattern" width="12" height="18" patternUnits="userSpaceOnUse">
          <rect width="12" height="18" fill="#ffe066" />
          <line x1="0" y1="0" x2="0" y2="18" stroke="#cca000" strokeWidth="1" />
          <line x1="4" y1="0" x2="4" y2="7" stroke="#333" strokeWidth="1" />
          <line x1="8" y1="0" x2="8" y2="5" stroke="#666" strokeWidth="0.8" />
          <line x1="12" y1="0" x2="12" y2="11" stroke="#222" strokeWidth="1.2" />
        </pattern>
        {/* Glow filter */}
        <filter id="tapeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.45" />
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

      {/* Mannequin Body Silhouette */}
      <g className="body-silhouette" fill="#f7f7f5" stroke="#d5d5d0" strokeWidth="1.5">
        {/* Head & Neck */}
        <ellipse cx="180" cy="52" rx="26" ry="32" fill="#efeee9" />
        <path d="M 168 80 L 168 108 L 192 108 L 192 80 Z" fill="#efeee9" />

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
          fill="#fbfbf9"
        />

        {/* Chest/Bust Curves */}
        <path d="M 150 152 C 160 166, 172 168, 180 168 C 188 168, 200 166, 210 152" fill="none" stroke="#e0e0dc" strokeWidth="1.2" strokeDasharray="3 3" />

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
          fill="#fafaf7"
        />

        {/* Legs / Trouser */}
        <path
          d="M 134 326
             C 132 350, 134 390, 136 425
             L 164 425
             L 170 338
             L 172 326
             Z"
          fill="#f7f7f4"
        />
        <path
          d="M 226 326
             C 228 350, 226 390, 224 425
             L 196 425
             L 190 338
             L 188 326
             Z"
          fill="#f7f7f4"
        />

        {/* Feet / Ground Line */}
        <line x1="80" y1="428" x2="280" y2="428" stroke="#d5d5d0" strokeWidth="1" strokeDasharray="4 4" />
      </g>

      {/* HIGHLIGHTED MEASUREMENT TAPES BY ZONE */}

      {/* 1. NECK / COLLAR */}
      {isNeck && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <ellipse cx="180" cy="104" rx="22" ry="9" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2" />
          <ellipse cx="180" cy="104" rx="22" ry="9" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx="180" cy="104" r="4" fill="#d97706" />
          {/* Label callout */}
          <line x1="202" y1="104" x2="270" y2="85" stroke="#b45309" strokeWidth="1.5" markerStart="url(#arrowStart)" />
          <rect x="250" y="70" width="100" height="30" rx="4" fill="#000" />
          <text x="300" y="89" fill="#fff" fontSize="11" fontWeight="600" textAnchor="middle">1. Neck Collar</text>
        </g>
      )}

      {/* 2. CHEST / BUST */}
      {isChest && !isUnderbust && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <rect x="120" y="152" width="120" height="16" rx="4" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2" />
          <line x1="120" y1="160" x2="240" y2="160" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
          {/* Arrow guides */}
          <line x1="60" y1="160" x2="116" y2="160" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="300" y1="160" x2="244" y2="160" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="130" y="125" width="100" height="24" rx="4" fill="#000" />
          <text x="180" y="141" fill="#fff" fontSize="11" fontWeight="600" textAnchor="middle">Chest / Bust Level</text>
        </g>
      )}

      {/* 3. UNDERBUST */}
      {isUnderbust && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <rect x="128" y="178" width="104" height="14" rx="3" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2" />
          <line x1="128" y1="185" x2="232" y2="185" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="130" y="196" width="100" height="22" rx="4" fill="#000" />
          <text x="180" y="211" fill="#fff" fontSize="10.5" fontWeight="600" textAnchor="middle">Under Bust Line</text>
        </g>
      )}

      {/* 4. SHOULDER WIDTH */}
      {isShoulder && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <line x1="92" y1="134" x2="268" y2="134" stroke="#d97706" strokeWidth="4" strokeDasharray="6 3" />
          <circle cx="92" cy="134" r="6" fill="#b45309" stroke="#fff" strokeWidth="2" />
          <circle cx="268" cy="134" r="6" fill="#b45309" stroke="#fff" strokeWidth="2" />
          <line x1="92" y1="134" x2="268" y2="134" stroke="#b45309" strokeWidth="2" markerStart="url(#arrowStart)" markerEnd="url(#arrow)" />
          <rect x="130" y="108" width="100" height="22" rx="4" fill="#000" />
          <text x="180" y="123" fill="#fff" fontSize="10.5" fontWeight="600" textAnchor="middle">Shoulder to Shoulder</text>
        </g>
      )}

      {/* 5. SLEEVE (HALF OR FULL) */}
      {(isHalfSleeve || isFullSleeve) && !isWrist && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          {/* Shoulder anchor */}
          <circle cx="92" cy="134" r="5" fill="#b45309" />
          {/* Outer arm line */}
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
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          {isHalfSleeve ? (
            <>
              <ellipse cx="84" cy="175" rx="14" ry="6" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="1.5" />
              <rect x="12" y="160" width="85" height="24" rx="4" fill="#000" />
              <text x="54" y="176" fill="#fff" fontSize="10" fontWeight="600" textAnchor="middle">Half Sleeve End</text>
            </>
          ) : (
            <>
              <ellipse cx="94" cy="246" rx="12" ry="5" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="1.5" />
              <rect x="12" y="235" width="85" height="24" rx="4" fill="#000" />
              <text x="54" y="251" fill="#fff" fontSize="10" fontWeight="600" textAnchor="middle">Wrist Cuff Line</text>
            </>
          )}
        </g>
      )}

      {/* 6. WRIST / CUFF */}
      {isWrist && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <ellipse cx="94" cy="246" rx="15" ry="7" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2" />
          <line x1="94" y1="246" x2="35" y2="280" stroke="#b45309" strokeWidth="1.5" markerStart="url(#arrowStart)" />
          <rect x="10" y="270" width="85" height="24" rx="4" fill="#000" />
          <text x="52" y="286" fill="#fff" fontSize="10.5" fontWeight="600" textAnchor="middle">Wrist Circumference</text>
        </g>
      )}

      {/* 7. SHIRT / BLAZER LENGTH */}
      {isShirtLength && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <circle cx="168" cy="108" r="4" fill="#b45309" />
          <line x1="168" y1="108" x2="168" y2="255" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 3" />
          <line x1="168" y1="108" x2="168" y2="255" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="145" y1="255" x2="195" y2="255" stroke="#b45309" strokeWidth="2.5" />
          <rect x="75" y="240" width="85" height="24" rx="4" fill="#000" />
          <text x="117" y="256" fill="#fff" fontSize="10" fontWeight="600" textAnchor="middle">Shirt Hem Length</text>
        </g>
      )}

      {/* 8. KURTA / DRESS / LEHENGA LENGTH */}
      {isKurtaLength && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <circle cx="168" cy="108" r="4" fill="#b45309" />
          <line x1="168" y1="108" x2="168" y2="360" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 3" />
          <line x1="168" y1="108" x2="168" y2="360" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="130" y1="360" x2="206" y2="360" stroke="#b45309" strokeWidth="2.5" />
          <rect x="75" y="345" width="85" height="24" rx="4" fill="#000" />
          <text x="117" y="361" fill="#fff" fontSize="10" fontWeight="600" textAnchor="middle">Knee / Hem Length</text>
        </g>
      )}

      {/* 9. WAIST / STOMACH */}
      {isWaist && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <rect x="134" y="218" width="92" height="15" rx="3" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2" />
          <line x1="134" y1="225" x2="226" y2="225" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="75" y1="225" x2="130" y2="225" stroke="#b45309" strokeWidth="1.8" markerEnd="url(#arrow)" />
          <line x1="285" y1="225" x2="230" y2="225" stroke="#b45309" strokeWidth="1.8" markerEnd="url(#arrow)" />
          <rect x="130" y="194" width="100" height="22" rx="4" fill="#000" />
          <text x="180" y="209" fill="#fff" fontSize="10.5" fontWeight="600" textAnchor="middle">Natural Waist / Navel</text>
        </g>
      )}

      {/* 10. HIP / SEAT */}
      {isHip && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <rect x="124" y="260" width="112" height="16" rx="4" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2" />
          <line x1="124" y1="268" x2="236" y2="268" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="268" x2="120" y2="268" stroke="#b45309" strokeWidth="1.8" markerEnd="url(#arrow)" />
          <line x1="300" y1="268" x2="240" y2="268" stroke="#b45309" strokeWidth="1.8" markerEnd="url(#arrow)" />
          <rect x="130" y="238" width="100" height="20" rx="4" fill="#000" />
          <text x="180" y="252" fill="#fff" fontSize="10" fontWeight="600" textAnchor="middle">Fullest Hip Circumference</text>
        </g>
      )}

      {/* 11. INSEAM */}
      {isInseam && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <circle cx="180" cy="270" r="4" fill="#b45309" />
          <line x1="180" y1="270" x2="164" y2="425" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 3" />
          <line x1="180" y1="270" x2="164" y2="425" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="70" y="375" width="85" height="22" rx="4" fill="#000" />
          <text x="112" y="390" fill="#fff" fontSize="10" fontWeight="600" textAnchor="middle">Inseam Crotch to Ankle</text>
        </g>
      )}

      {/* 12. OUTSEAM / TROUSER LENGTH */}
      {isOutseam && !isKurtaLength && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <circle cx="232" cy="225" r="4" fill="#b45309" />
          <line x1="232" y1="225" x2="226" y2="425" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 3" />
          <line x1="232" y1="225" x2="226" y2="425" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="205" y1="425" x2="245" y2="425" stroke="#b45309" strokeWidth="2.5" />
          <rect x="238" y="340" width="105" height="24" rx="4" fill="#000" />
          <text x="290" y="356" fill="#fff" fontSize="10" fontWeight="600" textAnchor="middle">Outseam Waist to Shoe</text>
        </g>
      )}

      {/* 13. THIGH */}
      {isThigh && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <ellipse cx="152" cy="310" rx="20" ry="8" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2" />
          <rect x="50" y="300" width="85" height="22" rx="4" fill="#000" />
          <text x="92" y="315" fill="#fff" fontSize="10" fontWeight="600" textAnchor="middle">Upper Thigh Round</text>
        </g>
      )}

      {/* 14. ANKLE */}
      {isAnkle && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <ellipse cx="150" cy="420" rx="16" ry="6" fill="url(#tapePattern)" stroke="#b45309" strokeWidth="2" />
          <rect x="45" y="405" width="85" height="22" rx="4" fill="#000" />
          <text x="87" y="420" fill="#fff" fontSize="10" fontWeight="600" textAnchor="middle">Ankle Hem Opening</text>
        </g>
      )}

      {/* 15. NECK DEPTH (FRONT/BACK) */}
      {isNeckDepth && (
        <g className="tape-indicator" filter="url(#tapeGlow)">
          <circle cx="168" cy="108" r="4" fill="#b45309" />
          <line x1="168" y1="108" x2="180" y2="165" stroke="#f59e0b" strokeWidth="4" strokeDasharray="5 3" />
          <line x1="168" y1="108" x2="180" y2="165" stroke="#b45309" strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="190" y="145" width="95" height="22" rx="4" fill="#000" />
          <text x="237" y="160" fill="#fff" fontSize="10" fontWeight="600" textAnchor="middle">Neckline Slant Depth</text>
        </g>
      )}

      {/* Bottom measurement point badge */}
      <g transform="translate(180, 415)">
        <rect x="-85" y="-12" width="170" height="24" rx="12" fill="#fff" stroke="#111" strokeWidth="1.2" />
        <text x="0" y="4" fill="#000" fontSize="11" fontWeight="600" textAnchor="middle">
          📏 {label} ({unit})
        </text>
      </g>
    </svg>
  );
}
