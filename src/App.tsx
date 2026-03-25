import { useEffect, useRef, useState } from 'react';
import { useDeck } from './hooks/useDeck';
import { useShake } from './hooks/useShake';
import { AppHeader } from './components/AppHeader';
import { FilmStrip } from './components/FilmStrip';
import { CardOverlay } from './components/CardOverlay';
import { getCardImage } from './components/FilmFrame';
import { CARDS } from './data/cards';

export default function App() {
  const { current, used, draw, next, dismiss } = useDeck();
  const [showToast, setShowToast] = useState(false);
  const [currentImgSrc, setCurrentImgSrc] = useState<string | null>(null);
  const prevUsedLen = useRef(used.length);

  // Detect reshuffle: used count drops (resets to 1 after exhausting all cards)
  useEffect(() => {
    const prev = prevUsedLen.current;
    const curr = used.length;
    if (prev >= CARDS.length - 1 && curr <= 1) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 2800);
      return () => clearTimeout(t);
    }
    prevUsedLen.current = curr;
  }, [used.length]);

  // Keep imgSrc in sync with current card — covers both initial tap and next()
  useEffect(() => {
    setCurrentImgSrc(current ? getCardImage(current.id) : null);
  }, [current]);

  const handleSelect = (card: Parameters<typeof draw>[0], _imgSrc: string) => {
    draw(card);
  };

  const handleDismiss = () => {
    dismiss();
  };

  useShake(() => {
    if (current) next();
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        perspective: '1200px',
      }}
    >
       <AppHeader />

      <FilmStrip isOpen={!!current} selectedCardId={current?.id ?? null} onSelect={handleSelect} />
      <div style={{ height: 'clamp(12px, 3dvh, 32px)', flexShrink: 0 }} />
      <FilmStrip isOpen={!!current} selectedCardId={current?.id ?? null} onSelect={handleSelect} reversed />


      {current && (
        <CardOverlay
          card={current}
          imgSrc={currentImgSrc ?? undefined}
          usedCount={used.length}
          totalCount={CARDS.length}
          onNext={next}
          onDismiss={handleDismiss}
        />
      )}

      {/* Reshuffle toast */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#2c1f0e',
            color: 'rgba(245,237,224,0.85)',
            fontFamily: "'DM Mono', monospace",
            fontSize: '14px',
            fontWeight: 400,
            letterSpacing: '0.08em',
            borderRadius: '24px',
            padding: '10px 20px',
            whiteSpace: 'nowrap',
            zIndex: 200,
            animation: 'toastIn 0.4s ease forwards',
          }}
        >
          end of roll · rewinding
        </div>
      )}
    </div>
  );
}
