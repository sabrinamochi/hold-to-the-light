import { useState, useCallback } from 'react';
import type { Card } from '../data/cards';
import { CARDS } from '../data/cards';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useDeck() {
  const [deck, setDeck]       = useState<Card[]>(() => shuffle(CARDS));
  const [used, setUsed]       = useState<Card[]>([]);
  const [current, setCurrent] = useState<Card | null>(null);

  const draw = useCallback((card: Card) => {
    setCurrent(card);
    setUsed(prev => prev.find(c => c.id === card.id) ? prev : [...prev, card]);
  }, []);

  const next = useCallback(() => {
    if (!current) return;
    const remaining = deck.filter(c => !used.find(u => u.id === c.id));
    if (remaining.length === 0) {
      // reshuffle
      const fresh = shuffle(CARDS).filter(c => c.id !== current.id);
      setDeck(fresh);
      setUsed([current]);
      setCurrent(fresh[0]);
      return;
    }
    const idx = remaining.findIndex(c => c.id === current.id);
    const nextCard = remaining[(idx + 1) % remaining.length];
    draw(nextCard);
  }, [current, deck, used, draw]);

  const dismiss = useCallback(() => setCurrent(null), []);

  const remaining = CARDS.length - used.length;

  return { deck, current, used, remaining, draw, next, dismiss };
}
