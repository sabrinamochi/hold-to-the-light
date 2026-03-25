# CLAUDE.md — hold-to-the-light
> Conversation card app with 35mm film strip UI

---

## Project overview

A mobile-first single-page web app. A horizontal strip of 35mm camera film scrolls slowly across the screen. Each film frame holds a blurred, multi-color wash. The user taps a frame — the film pauses, the frame flips and expands into a card revealing a conversation prompt. Designed for use before weekly phone calls with a grandmother who has dementia.

**Stack:** React + TypeScript + Vite + Tailwind CSS  
**Target:** Mobile (375px primary), responsive up to desktop  
**Fonts:** Google Fonts — Cormorant Garamond (Italic 400), DM Mono (300, 400)

---

## File structure to scaffold

```
src/
  components/
    FilmStrip.tsx        # scrolling strip with frames + sprockets
    FilmFrame.tsx        # individual frame (idle + selected state)
    CardOverlay.tsx      # full-screen card reveal
    CategoryPill.tsx     # colored pill label
    AppHeader.tsx        # title + counter
  data/
    cards.ts             # all conversation prompts
  hooks/
    useShake.ts          # device motion / shake detection
    useDeck.ts           # deck state, used pile, reshuffle logic
  styles/
    globals.css          # CSS variables, grain texture, base styles
  App.tsx
  main.tsx
```

---

## Design tokens — CSS variables

Define in `globals.css` and reference everywhere:

```css
:root {
  /* backgrounds */
  --bg:           #1a1208;   /* page — dark warm brown-black */
  --film-base:    #2a1c0a;   /* film strip base */
  --film-border:  #4a3018;   /* strip edge */
  --card-bg:      #f5ede0;   /* open card — aged cream */

  /* text */
  --text-primary: #2c1f0e;   /* question text — deep warm brown */
  --text-muted:   rgba(200,170,130,0.5);
  --text-hint:    rgba(200,170,120,0.35);

  /* structural */
  --sprocket-bg:  #1a1208;   /* hole color = page bg (true hole) */

  /* categories */
  --cat-memory:   #C4856A;   /* Shared memories — terracotta */
  --cat-youth:    #7A9E8E;   /* Her younger years — sage */
  --cat-favs:     #C9A96E;   /* Favourite things — amber */
  --cat-stories:  #8EB4C4;   /* Pets & stories — cornflower */
  --cat-family:   #A88EC4;   /* Family — mauve */
}
```

---

## Data — `src/data/cards.ts`

```ts
export type Category = 'shared memories' | 'her younger years' | 'favourite things' | 'pets & stories' | 'family';

export interface Card {
  id: number;
  category: Category;
  question: string;
}

export const CARDS: Card[] = [
  { id: 1,  category: 'shared memories',   question: 'Remember when we took the bus together every morning to my elementary school? What did we talk about on the way?' },
  { id: 2,  category: 'her younger years', question: 'When you were young, how did kids get around? Did you ever ride a bicycle — where did you go?' },
  { id: 3,  category: 'favourite things',  question: 'Are you watching anything good on TV lately? What\'s your favourite show right now?' },
  { id: 4,  category: 'shared memories',   question: 'That trip we took to Japan together — what\'s the one thing you remember most clearly?' },
  { id: 5,  category: 'family',            question: 'Was Grandpa your first love? How did the two of you first meet?' },
  { id: 6,  category: 'favourite things',  question: 'I know how much you love dancing. Do you still listen to music that makes you want to move?' },
  { id: 7,  category: 'her younger years', question: 'What was your favourite thing to do on a free afternoon when you were my age?' },
  { id: 8,  category: 'pets & stories',    question: 'What\'s the silliest thing a pet ever did in our family? I could use a good story.' },
  { id: 9,  category: 'shared memories',   question: 'You used to make that dish for me when I was little. What was the secret that made it so good?' },
  { id: 10, category: 'family',            question: 'What do you remember about the day I was born — or the first time you held me?' },
  { id: 11, category: 'favourite things',  question: 'What\'s the best thing you\'ve eaten recently? Did you make it yourself?' },
  { id: 12, category: 'pets & stories',    question: 'Tell me a story about when I was really little. I never get tired of hearing them.' },
];

export const CATEGORY_COLORS: Record<Category, { solid: string; tint: string }> = {
  'shared memories':   { solid: '#C4856A', tint: 'rgba(196,133,106,0.15)' },
  'her younger years': { solid: '#7A9E8E', tint: 'rgba(122,158,142,0.15)' },
  'favourite things':  { solid: '#C9A96E', tint: 'rgba(201,169,110,0.15)' },
  'pets & stories':    { solid: '#8EB4C4', tint: 'rgba(142,180,196,0.15)' },
  'family':            { solid: '#A88EC4', tint: 'rgba(168,142,196,0.15)' },
};

// Multi-color film frame fills — dynamic collisions, not flat washes
export const FRAME_FILLS: string[] = [
  'radial-gradient(ellipse at 70% 20%, #C4856A 0%, #7a3820 45%, #1a0c04 100%)',
  'radial-gradient(ellipse at 30% 75%, #c49090 0%, #8a6040 50%, #1a1005 100%)',
  'radial-gradient(ellipse at 60% 30%, #d4a850 0%, #8a5820 50%, #100a02 100%)',
  'radial-gradient(ellipse at 40% 60%, #7a9e8e 0%, #3a6050 50%, #050f0a 100%)',
  'radial-gradient(ellipse at 55% 25%, #8eb4c4 0%, #406080 50%, #050c10 100%)',
  'radial-gradient(ellipse at 45% 70%, #a88ec4 0%, #604880 50%, #08050f 100%)',
  'radial-gradient(ellipse at 25% 40%, #c49090 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, #c9a96e 0%, #1a1005 70%)',
  'radial-gradient(ellipse at 70% 30%, #c9a96e 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, #7a9e8e 0%, #050f0a 65%)',
];
```

---

## Hook — `src/hooks/useDeck.ts`

Manages deck state: shuffle, draw, used pile, reshuffle.

```ts
import { useState, useCallback } from 'react';
import { CARDS, Card } from '../data/cards';

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
```

---

## Hook — `src/hooks/useShake.ts`

Shake detection via DeviceMotion API. iOS 13+ requires permission — request on first user gesture.

```ts
import { useEffect, useRef } from 'react';

export function useShake(onShake: () => void, threshold = 18) {
  const last = useRef({ x: 0, y: 0, z: 0, t: 0, init: false });

  useEffect(() => {
    const handler = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a || a.x == null) return;
      const { x = 0, y = 0, z = 0 } = a;
      if (!last.current.init) {
        last.current = { x, y, z, t: Date.now(), init: true };
        return;
      }
      const delta = Math.abs(x - last.current.x)
                  + Math.abs(y - last.current.y)
                  + Math.abs(z - last.current.z);
      const now = Date.now();
      if (delta > threshold && now - last.current.t > 700) {
        last.current.t = now;
        onShake();
      }
      last.current = { x, y, z, t: last.current.t, init: true };
    };

    const requestAndListen = async () => {
      if (typeof DeviceMotionEvent !== 'undefined' &&
          // @ts-ignore — iOS 13+
          typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
          // @ts-ignore
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('devicemotion', handler);
          }
        } catch {}
      } else {
        window.addEventListener('devicemotion', handler);
      }
    };

    // request on first tap anywhere
    document.addEventListener('click', requestAndListen, { once: true });
    return () => {
      window.removeEventListener('devicemotion', handler);
    };
  }, [onShake, threshold]);
}
```

---

## Component specs

### `FilmStrip.tsx`
- Horizontal strip, full viewport width, overflows both edges
- Animates: `translateX` loop — duplicate card array for seamless scroll
- Scroll speed: `~70px/s` — use `animation: scrollFilm 22s linear infinite`
- Pauses (`animation-play-state: paused`) when a card is open
- Strip height: `220px` on mobile
- Contains: top sprocket row + frames + bottom sprocket row + light leak div

**Sprocket rows:**
- Height: `22px`, background matches `--film-base`
- Holes: `16×11px`, `border-radius: 3px`, background `--sprocket-bg` (true holes)
- Spacing: every `21px`, padding `0 6px`

**Frame:**
- `120px × 168px`, no gaps between frames, `border-left: 1px solid rgba(80,50,20,0.4)`
- Fill: `FRAME_FILLS[index % FRAME_FILLS.length]` as background CSS
- Vignette overlay: `radial-gradient(ellipse at center, transparent 30%, rgba(10,6,2,0.75) 100%)`
- Frame number: bottom-left, DM Mono 8px, `rgba(255,220,160,0.25)`
- Film edge metadata: right side, vertical writing-mode, "CLAY 6608 FF1", 7px, `rgba(200,150,80,0.18)`
- Hover: `filter: brightness(1.15)`, `transition: filter 0.3s`
- Click: calls `draw(card)` for that index

**Light leak:**
- `position: absolute`, left edge, `60px` wide
- `background: linear-gradient(to right, rgba(220,140,60,0.12), transparent)`

**Seamless loop:**
- Render `[...CARDS, ...CARDS]` for frames
- `@keyframes scrollFilm { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`

---

### `CardOverlay.tsx`
- `position: fixed`, `inset: 0`, `z-index: 50`
- Backdrop: `background: rgba(10,6,2,0.82)`, `backdrop-filter: blur(4px)`
- Fade in with `opacity` transition `0.5s`

**Card element:**
- `width: 300px`, `max-width: 88vw`, `min-height: 400px`
- `background: var(--card-bg)`, `border-radius: 14px`
- `border: 1px solid rgba(100,70,30,0.2)`
- `box-shadow: 0 32px 80px rgba(0,0,0,0.6)`
- Paper grain: pseudo-element with SVG `feTurbulence` noise, `opacity: 0.04`, `mix-blend-mode: multiply`
- Card vignette: pseudo-element `radial-gradient` soft darkness at corners

**Card entrance animation:**
- Opens: `rotateY(90deg) → rotateY(0deg)`, `0.65s`, `cubic-bezier(0.4,0,0.2,1)`
- Next transition: `rotateY(0deg) → rotateY(90deg)` in `0.25s`, then new content + reverse

**Ghost sprocket holes on card:**
- Top and bottom edges of card, `opacity: 0.12`
- Same hole shape as strip — visual memory of the film frame it came from

**Card layout (top → bottom):**
1. `CategoryPill` — top-left, `margin-bottom: 20px`
2. Question text — `font-family: Cormorant Garamond, serif`, `font-style: italic`, `24px`, `line-height: 1.62`, vertically centered in remaining space
3. Footer — `border-top: 1px solid rgba(80,50,20,0.12)`, frame counter left (`DM Mono` 10px light), Next → button right

**Esc / close:** clicking backdrop or esc button → `dismiss()` → film resumes after `400ms` delay

---

### `CategoryPill.tsx`
```tsx
// padding: 3px 10px, border-radius: 4px
// font: DM Mono 9px, weight 400, letter-spacing 0.16em, ALL CAPS
// background: category tint color
// color: category solid color
```

---

### `AppHeader.tsx`
- `position: absolute`, `top: 28px`, full width, `padding: 0 24px`
- Left: app title — Cormorant Garamond Italic 15px, `rgba(200,160,100,0.55)`
- Right: counter — DM Mono Light 10px, `--text-hint`
- Counter text: `"{n} memories"` — updates as cards are used

---

## Atmosphere — apply globally

**Film grain overlay** — on `body::before`:
```css
background-image: url("data:image/svg+xml,...feTurbulence...");
background-size: 256px 256px;
mix-blend-mode: overlay;
opacity: 0.6;
pointer-events: none;
position: fixed;
inset: 0;
z-index: 100;
```
Heavier on the strip region (`opacity: 0.25`), lighter on the card (`opacity: 0.04`).

**No hard edges anywhere.** Surfaces bleed softly into each other.

**The card is the only lit surface.** Everything behind it lives in warm shadow.

---

## Reshuffle toast

When deck exhausts:
- Bottom-center toast, `position: fixed`, `bottom: 32px`
- `background: #2c1f0e`, `color: rgba(245,237,224,0.85)`
- DM Mono 11px, `border-radius: 24px`, `padding: 10px 20px`
- Text: `"end of roll · rewinding"`
- Animate: slide up from `translateY(20px)` + fade in, auto-dismiss after `2.8s`

---

## Animations reference

```css
/* film scroll — seamless loop */
@keyframes scrollFilm {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* card open */
@keyframes cardOpen {
  from { transform: rotateY(90deg) scale(0.85); opacity: 0; }
  to   { transform: rotateY(0deg)  scale(1);    opacity: 1; }
}

/* toast */
@keyframes toastIn {
  from { transform: translateX(-50%) translateY(12px); opacity: 0; }
  to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
}
```

All animations respect `@media (prefers-reduced-motion: reduce)` — disable scroll animation, replace card flip with simple fade.

---

## Accessibility

- `aria-label` on each film frame: `"Open memory card: {category}"`
- `role="dialog"` + `aria-modal="true"` on card overlay
- `aria-live="polite"` on counter for screen readers
- Keyboard: `Escape` closes card, `Tab` navigates frames, `Enter` opens focused frame
- Focus trap inside card overlay when open

---

## Asset notes

Frame fills are CSS gradients by default. To use Flux-generated film frame images instead:
1. Place cropped frame images in `public/frames/frame-01.jpg` through `frame-08.jpg`
2. Replace `background: FRAME_FILLS[i]` with `background-image: url('/frames/frame-0${i+1}.jpg')` + `background-size: cover`
3. Keep the vignette overlay — it unifies the frames regardless of source

---

## Commands to get started

```bash
npm create vite@latest hold-to-the-light -- --template react-ts
cd hold-to-the-light
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

Add to `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
```

---

*Project: hold-to-the-light · Claude Code spec v1.0*

---

## Figma MCP Integration Rules

> These rules govern how to translate Figma designs into code for this project. Follow them for every Figma-driven implementation task.

### Required workflow (do not skip steps)

1. Run `get_design_context` on the target node(s) to get the structured design representation
2. If the response is too large, run `get_metadata` first to get the node map, then re-fetch specific nodes
3. Run `get_screenshot` for a visual reference of the node being implemented
4. Download any image/SVG assets needed — use localhost sources from the MCP server directly
5. Translate the output into this project's conventions (see rules below)
6. Validate against the Figma screenshot for 1:1 visual parity before marking complete

### Component organization

- All UI components live in `src/components/` — check here before creating anything new
- Components: `FilmStrip.tsx`, `FilmFrame.tsx`, `CardOverlay.tsx`, `CategoryPill.tsx`, `AppHeader.tsx`
- Hooks live in `src/hooks/` (`useDeck.ts`, `useShake.ts`)
- Card data and category colors live in `src/data/cards.ts`

### Styling approach

- IMPORTANT: This project uses **inline React `style` objects** — there is no Tailwind CSS
- Global styles and animations live in `src/styles/globals.css` — add new keyframes there
- IMPORTANT: Never hardcode color values — always reference CSS variables (see tokens below)
- CSS variables are the only styling mechanism beyond inline `style` props; do not add new CSS files

### Design tokens — always use these CSS variables

```
--bg            #1a1208   page background
--film-base     #2a1c0a   film strip
--film-border   #4a3018   strip edge
--card-bg       #f5ede0   open card (aged cream)
--text-primary  #2c1f0e   question text
--text-muted    rgba(200,170,130,0.5)
--text-hint     rgba(200,170,120,0.35)
--sprocket-bg   #1a1208   sprocket holes
--cat-memory    #C4856A   shared memories
--cat-youth     #7A9E8E   her younger years
--cat-favs      #C9A96E   favourite things
--cat-stories   #8EB4C4   pets & stories
--cat-family    #A88EC4   family
```

Use `CATEGORY_COLORS` from `src/data/cards.ts` for category solid/tint values in JS contexts.

### Typography

- Body / UI: `'DM Mono', monospace` (weights 300, 400) — already set on `body` in globals.css
- Question text: `'Cormorant Garamond', serif` with `fontStyle: 'italic'` — apply inline
- IMPORTANT: Do not import or add other font families

### Film frame images

- Real JPEG film photos live in `public/img/film/` (5 images, UUID filenames)
- `FilmFrame.tsx` cycles through them: `FILM_IMAGES[index % FILM_IMAGES.length]`
- To add new frame images: drop JPEGs into `public/img/film/` and add the path to the `FILM_IMAGES` array in `FilmFrame.tsx`
- IMPORTANT: Do not install image libraries or create image placeholders

### Animations

- Keyframes are defined in `src/styles/globals.css`: `scrollFilm`, `cardOpen`, `toastIn`
- IMPORTANT: All animations must include a `@media (prefers-reduced-motion: reduce)` override in `globals.css`
- Apply animation via inline `style={{ animation: '...' }}` referencing the named keyframe

### Asset handling

- IMPORTANT: If the Figma MCP server returns a localhost source for an image or SVG, use it directly — do not create placeholders
- Static assets go in `public/img/`
- IMPORTANT: Do not install icon packages; use inline SVG or existing assets only

### What the Figma output represents

The Figma MCP returns React + Tailwind as a representation of design intent — not final code. When you receive it:
- Replace Tailwind classes with inline `style` objects
- Map Figma color values to the CSS variables above
- Reuse existing components from `src/components/` rather than duplicating markup
- Respect the warm-shadow aesthetic: no hard edges, surfaces bleed softly, card is the only lit surface
