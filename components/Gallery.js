'use client';
import { useState, useEffect, useCallback } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Img from './Img';

export default function Gallery({
  images = [],
  alt = 'Garment',
  productName = '',
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const picList = images.length
    ? images
    : ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85'];

  const curImg = picList[activeIdx] || picList[0];

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
      {/* Main Display Stage */}
      <div
        className="gallery-main-stage"
        onClick={() => setLightboxOpen(true)}
        title="Click to view fullscreen"
      >
        <Img src={curImg} alt={alt} w={1400} loading="eager" className="main-display-img" />

        <button
          type="button"
          className="gallery-expand-btn"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
          }}
          aria-label="View fullscreen"
        >
          <Maximize2 size={15} />
        </button>
      </div>

      {/* Clean Thumbnails Rail */}
      {picList.length > 1 && (
        <div className="gallery-thumbs-rail" role="tablist" aria-label="Garment views">
          {picList.map((src, n) => (
            <button
              key={src + n}
              type="button"
              className={`gallery-thumb ${n === activeIdx ? 'on' : ''}`}
              onClick={() => setActiveIdx(n)}
              aria-label={`View angle ${n + 1}`}
            >
              <Img src={src} alt="" w={200} />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
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

              {picList.length > 1 && (
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
              )}

              <div className="lightbox-caption">
                <h3>{productName || alt}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
