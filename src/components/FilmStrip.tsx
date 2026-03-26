import { useEffect, useRef } from 'react';
import type { Card } from '../data/cards';
import { CARDS } from '../data/cards';
import { FilmFrame, FRAME_HEIGHT, FRAME_W } from './FilmFrame';

interface Props {
  isOpen: boolean;
  selectedCardId: number | null;
  onSelect: (card: Card, imgSrc: string) => void;
  /** Scroll in the opposite direction */
  reversed?: boolean;
  /** Additional user-submitted cards to append to the strip */
  extraCards?: Card[];
}

const SPROCKET_H = 30;
const STRIP_H = FRAME_HEIGHT + SPROCKET_H * 2; // 170 + 32 = 202px

export const HALF_WIDTH = CARDS.length * FRAME_W; // loop wrap point (used externally)

function SprocketRow({ count }: { count: number }) {
  return (
    <div
      style={{
        height: `${SPROCKET_H}px`,
        background: 'var(--film-base)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        paddingLeft: '6px',
        flexShrink: 0,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            display: 'block',
            width: '11px',
            height: '8px',
            background: 'var(--sprocket-bg)',
            borderRadius: '2px',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

/** Spread extra cards evenly across the base deck so they appear quickly */
function interleave(base: Card[], extras: Card[]): Card[] {
  if (extras.length === 0) return base;
  const result = [...base];
  extras.forEach((card, i) => {
    const pos = Math.round((i + 1) * result.length / (extras.length + 1));
    result.splice(pos, 0, card);
  });
  return result;
}

export function FilmStrip({ isOpen, selectedCardId, onSelect, reversed = false, extraCards = [] }: Props) {
  const allCards = interleave([...CARDS], extraCards);
  const halfWidth = allCards.length * FRAME_W;
  const holeCount = Math.ceil((halfWidth * 2) / 24) + 10;
  const frames = [...allCards, ...allCards];

  const scrollRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(reversed ? halfWidth / 2 : 0);
  const isOpenRef = useRef(isOpen);
  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef(0);
  const velocityRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  // Keep latest halfWidth in a ref so the RAF loop always sees current value
  const halfWidthRef = useRef(halfWidth);
  halfWidthRef.current = halfWidth;

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const scrollSpeed = () => halfWidthRef.current / 350;
    const tick = (time: number) => {
      const hw = halfWidthRef.current;
      const elapsed = lastTimeRef.current > 0 ? (time - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = time;

      if (!isDraggingRef.current && elapsed < 0.1) {
        // Apply momentum inertia
        if (Math.abs(velocityRef.current) > 0.5) {
          offsetRef.current = ((offsetRef.current + velocityRef.current * elapsed) % hw + hw) % hw;
          velocityRef.current *= 0.88;
        } else if (!isOpenRef.current) {
          // Auto-scroll when no card is open and momentum settled
          velocityRef.current = 0;
          const delta = scrollSpeed() * elapsed;
          if (reversed) {
            offsetRef.current = ((offsetRef.current - delta) % hw + hw) % hw;
          } else {
            offsetRef.current = (offsetRef.current + delta) % hw;
          }
        }
      }

      if (scrollRef.current) {
        scrollRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reversed]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const delta = dragStartXRef.current - e.clientX;
    if (!isDraggingRef.current) {
      if (Math.abs(delta) <= 4) return;
      isDraggingRef.current = true;
      lastTimeRef.current = 0;
      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = performance.now();
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const now = performance.now();
    const dt = now - lastPointerTimeRef.current;
    if (dt > 0) {
      // px/s, positive = scrolling right (offset increases)
      velocityRef.current = (lastPointerXRef.current - e.clientX) / (dt / 1000);
    }
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;
    const hw = halfWidthRef.current;
    offsetRef.current = ((dragStartOffsetRef.current + delta) % hw + hw) % hw;
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    isDraggingRef.current = false;
    lastTimeRef.current = 0;
    // Clamp launch velocity
    velocityRef.current = Math.max(-3000, Math.min(3000, velocityRef.current));
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: `${STRIP_H}px`,
        overflow: 'hidden',
        background: 'var(--film-base)',
        borderTop: '2px solid var(--film-border)',
        borderBottom: '2px solid var(--film-border)',
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
        flexShrink: 0,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Light leak */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '80px',
          background: 'linear-gradient(to right, rgba(220,140,60,0.1), transparent)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* Scrolling inner */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: 'max-content',
          willChange: 'transform',
          
        }}
      >
        <SprocketRow count={holeCount} />

        <div style={{ display: 'flex', flexDirection: 'row', flex: 1, gap: "10px" }}>
          {frames.map((card, i) => (
            <FilmFrame
              key={`${card.id}-${i}`}
              card={card}
              index={i}
              isSelected={card.id === selectedCardId}
              onSelect={onSelect}
            />
          ))}
        </div>

        <SprocketRow count={holeCount} />
      </div>
    </div>
  );
}
