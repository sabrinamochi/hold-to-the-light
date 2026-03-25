import { useEffect, useRef, useState } from 'react';
import type { Card } from '../data/cards';
import { CategoryPill } from './CategoryPill';

interface Props {
  card: Card;
  imgSrc?: string;
  usedCount: number;
  totalCount: number;
  onNext: () => void;
  onDismiss: () => void;
}

const SPROCKET_HOLE_COUNT = 5;

function GhostSprockets() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        padding: '8px 0',
        opacity: 0.12,
      }}
    >
      {Array.from({ length: SPROCKET_HOLE_COUNT }).map((_, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: '16px',
            height: '11px',
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '3px',
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
}

export function CardOverlay({ card, imgSrc, onNext, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [displayCard, setDisplayCard] = useState(card);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Fade in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Update displayed card with flip animation when card changes
  useEffect(() => {
    if (card.id === displayCard.id) return;
    setFlipping(true);
    const t = setTimeout(() => {
      setDisplayCard(card);
      setFlipping(false);
    }, 250);
    return () => clearTimeout(t);
  }, [card]);

  // Focus trap
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
        return;
      }
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    first?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  const handleNext = () => {
    onNext();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onDismiss();
  };

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    width: 'min(300px, 88vw)',
    minHeight: 'min(300px, 72dvh)',
    background: 'rgba(14, 11, 20, 0.1)',
    backdropFilter: 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.11)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transformOrigin: 'center center',
    animation: flipping
      ? 'none'
      : 'cardOpen 0.65s cubic-bezier(0.4,0,0.2,1) forwards',
    transform: flipping ? 'rotateY(90deg) scale(0.95)' : undefined,
    transition: flipping ? 'transform 0.25s ease-in' : undefined,
  };

  const backdropBg = imgSrc
    ? `url(${imgSrc}) center/cover no-repeat`
    : 'rgba(10,6,2,0.82)';

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Memory card: ${displayCard.category}`}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: backdropBg,
        backdropFilter: imgSrc ? undefined : 'blur(4px)',
        WebkitBackdropFilter: imgSrc ? undefined : 'blur(4px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* Dark overlay on top of photo backdrop for readability */}
      {imgSrc && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10,6,2,0.4)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div style={cardStyle}>
        {/* Noise texture */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '256px 256px',
            opacity: 0.1,
            mixBlendMode: 'luminosity',
            pointerEvents: 'none',
            borderRadius: '18px',
            zIndex: 1,
          }}
        />

        {/* Subtle dark vignette at corners */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)',
            pointerEvents: 'none',
            borderRadius: '18px',
            zIndex: 1,
          }}
        />

        {/* Ghost sprockets top */}
        <GhostSprockets />

        {/* Card body */}
        <div
          style={{
            flex: 1,
            padding: '16px 24px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <CategoryPill category={displayCard.category} />

          <p
            style={{
              fontFamily: "'Lora', serif",
              fontStyle: '',
              fontSize: '18px',
              lineHeight: 1.4,
              color: 'rgba(240,232,220,0.92)',
              flex: 1,
            }}
          >
            {displayCard.question}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '14px',
              fontWeight: 300,
              color: 'rgba(240,232,220,0.35)',
              letterSpacing: '0.06em',
            }}
          >
            {/* {usedCount} / {totalCount} */}
          </span>
          <button
            ref={closeButtonRef}
            onClick={handleNext}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(240,232,220,0.95)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              opacity: 0.65,
              padding: '4px 0',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.65')}
          >
            next →
          </button>
        </div>

        {/* Ghost sprockets bottom */}
        <GhostSprockets />
      </div>
    </div>
  );
}
