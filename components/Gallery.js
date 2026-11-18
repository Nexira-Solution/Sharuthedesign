'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  MapPin,
  Maximize2,
  RotateCw,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Img from './Img';

export default function Gallery({
  images = [],
  alt = 'Garment',
  hotspots = [],
  colors = [],
  fabric = '',
  productName = '',
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [loupeActive, setLoupeActive] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50, clientX: 0, clientY: 0 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors?.[0] || '');

  const mainPicRef = useRef(null);

  // If no images provided, use a high quality fallback
  const picList = images.length
    ? images
    : ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85'];

  const curImg = picList[activeIdx] || picList[0];

  // Mouse move handler for loupe magnifier
  const handleMouseMove = (e) => {
    if (!mainPicRef.current) return;
    const rect = mainPicRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
      clientX: e.clientX - rect.left,
      clientY: e.clientY - rect.top,
    });
  };

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveIdx((prev) => (prev + 1) % picList.length);
      if (e.key === 'ArrowLeft') setActiveIdx((prev) => (prev - 1 + picList.length) % picList.length);
    },
    [lightboxOpen, picList.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="luxury-gallery-container">
      {/* Top Gallery Toolbar */}
      <div className="gallery-toolbar">
        <div className="toolbar-left">
          <button
            type="button"
            className={`gallery-tool-btn ${loupeActive ? 'on' : ''}`}
            onClick={() => setLoupeActive(!loupeActive)}
            title="Toggle Fabric Texture Magnifier"
          >
            <ZoomIn size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
            {loupeActive ? 'Magnifier Active' : 'Fabric Magnifier'}
          </button>
          {hotspots?.length > 0 && (
            <button
              type="button"
              className={`gallery-tool-btn ${showHotspots ? 'on' : ''}`}
              onClick={() => {
                setShowHotspots(!showHotspots);
                setActiveHotspot(null);
              }}
              title="Toggle Bespoke Tailoring Pins"
            >
              <MapPin size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
              {showHotspots ? 'Pins Visible' : 'Show Tailor Pins'}
            </button>
          )}
        </div>

        <button
          type="button"
          className="gallery-tool-btn"
          onClick={() => setLightboxOpen(true)}
          title="Open Fullscreen Studio Lightbox"
        >
          <Maximize2 size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
          Fullscreen
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div
        className={`gallery-main-stage ${loupeActive ? 'loupe-mode' : ''}`}
        ref={mainPicRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setLoupeActive(true)}
        onMouseLeave={() => {
          setLoupeActive(false);
          setActiveHotspot(null);
        }}
        onClick={() => {
          if (!activeHotspot) setLightboxOpen(true);
        }}
      >
        <Img src={curImg} alt={alt} w={1400} loading="eager" className="main-display-img" />

        {/* Circular Magnifying Loupe Overlay */}
        {loupeActive && (
          <div
            className="magnifier-lens"
            style={{
              left: `${lensPos.clientX}px`,
              top: `${lensPos.clientY}px`,
              backgroundImage: `url(${curImg})`,
              backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
            }}
          >
            <span className="magnifier-tag">2.5x Weave Zoom</span>
          </div>
        )}

        {/* Interactive Bespoke Tailoring Hotspots */}
        {showHotspots &&
          hotspots.map((h, i) => (
            <div
              key={i}
              className={`tailor-hotspot ${activeHotspot === i ? 'open' : ''}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(activeHotspot === i ? null : i);
              }}
            >
              <div className="hotspot-pin">
                <span className="pin-pulse" />
                <span className="pin-dot" />
              </div>

              {activeHotspot === i && (
                <div className="hotspot-card" onClick={(e) => e.stopPropagation()}>
                  <div className="hotspot-header">
                    <span className="hotspot-badge">BESPOKE DETAIL</span>
                    <button
                      type="button"
                      className="close-pin-btn"
                      onClick={() => setActiveHotspot(null)}
                      aria-label="Close pin"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <h4>{h.title}</h4>
                  <p>{h.description}</p>
                </div>
              )}
            </div>
          ))}

        <div className="stage-hint-badge">
          <span>{loupeActive ? 'Hover to inspect fabric texture' : 'Click to inspect in fullscreen'}</span>
        </div>
      </div>

      {/* Interactive 360° / Multi-Angle Slider */}
      {picList.length > 1 && (
        <div className="gallery-angle-slider-wrap">
          <span className="slider-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <RotateCw size={13} /> Multi-Angle View:
          </span>
          <input
            type="range"
            min="0"
            max={picList.length - 1}
            value={activeIdx}
            onChange={(e) => setActiveIdx(parseInt(e.target.value, 10))}
            className="angle-slider"
            aria-label="Rotate garment view"
          />
          <span className="slider-idx">
            {activeIdx + 1} / {picList.length}
          </span>
        </div>
      )}

      {/* Thumbnails strip */}
      {picList.length > 1 && (
        <div className="gallery-thumbs-rail" role="tablist" aria-label="Garment angles">
          {picList.map((src, n) => (
            <button
              key={src + n}
              type="button"
              className={`gallery-thumb ${n === activeIdx ? 'on' : ''}`}
              onClick={() => {
                setActiveIdx(n);
                setActiveHotspot(null);
              }}
              aria-label={`View angle ${n + 1}`}
            >
              <Img src={src} alt="" w={200} />
              <span className="thumb-idx">{n === 0 ? 'Front' : n === 1 ? 'Angle' : n === 2 ? 'Detail' : `View ${n + 1}`}</span>
            </button>
          ))}
        </div>
      )}

      {/* Live Color Swatch Switcher */}
      {colors?.length > 0 && (
        <div className="gallery-swatch-picker">
          <span className="swatch-title">Fabric Palette:</span>
          <div className="swatch-list">
            {colors.map((c) => {
              const active = selectedColor === c;
              return (
                <button
                  key={c}
                  type="button"
                  className={`swatch-pill ${active ? 'active' : ''}`}
                  onClick={() => setSelectedColor(c)}
                  title={`Select ${c}`}
                >
                  <span className="swatch-sample" style={{ backgroundColor: getSwatchHex(c) }} />
                  <span className="swatch-name">{c}</span>
                  {active && <Check size={12} className="swatch-check" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Luxury Lightbox */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close fullscreen"
            >
              <X size={24} />
            </button>

            <div className="lightbox-content">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={curImg} alt={alt} className="lightbox-main-img" />

              <div className="lightbox-controls">
                <button
                  type="button"
                  className="lightbox-nav-btn prev"
                  onClick={() => setActiveIdx((prev) => (prev - 1 + picList.length) % picList.length)}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="lightbox-counter">
                  {activeIdx + 1} of {picList.length}
                </span>
                <button
                  type="button"
                  className="lightbox-nav-btn next"
                  onClick={() => setActiveIdx((prev) => (prev + 1) % picList.length)}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="lightbox-caption">
                <h3>{productName || alt}</h3>
                {fabric && <p>Bespoke Fabric: {fabric}</p>}
                {selectedColor && <p>Colorway: {selectedColor}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to provide realistic luxury swatch color shades
function getSwatchHex(name = '') {
  const n = name.toLowerCase();
  if (n.includes('white') || n.includes('ivory') || n.includes('cream')) return '#faf8f2';
  if (n.includes('blue') || n.includes('sapphire') || n.includes('navy')) return '#1e3a8a';
  if (n.includes('emerald') || n.includes('green') || n.includes('maragatham')) return '#065f46';
  if (n.includes('red') || n.includes('crimson') || n.includes('maroon') || n.includes('ruby')) return '#991b1b';
  if (n.includes('gold') || n.includes('mustard') || n.includes('haldi') || n.includes('yellow')) return '#d97706';
  if (n.includes('pink') || n.includes('rose')) return '#f472b6';
  if (n.includes('purple') || n.includes('plum') || n.includes('lilac')) return '#7e22ce';
  if (n.includes('black') || n.includes('onyx')) return '#111827';
  if (n.includes('grey') || n.includes('charcoal') || n.includes('slate')) return '#4b5563';
  if (n.includes('tan') || n.includes('camel') || n.includes('sandal')) return '#d9b382';
  return '#cca000';
}
