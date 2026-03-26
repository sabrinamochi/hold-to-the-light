import type { Card } from "../data/cards";
import { FRAME_FILLS } from "../data/cards";

export const FRAME_HEIGHT = 170;
export const FRAME_W = 220;

// Auto-discover all images in public/img/film/ at build time.
const CARD_IMAGE_MAP: Record<number, string> = {};

for (const fsPath of Object.keys(
  import.meta.glob("/public/img/film/*.{jpg,jpeg,png}"),
)) {
  const filename = fsPath.split("/").pop() ?? "";
  const publicUrl = `${import.meta.env.BASE_URL}img/film/${filename}`;
  const num = parseInt(filename.replace(/\.[^.]+$/, ""), 10);
  if (!isNaN(num)) {
    CARD_IMAGE_MAP[num] = publicUrl;
  }
}

// All image URLs — used for preloading
export const FILM_IMAGE_URLS: string[] = Object.values(CARD_IMAGE_MAP);


export function getCardImage(cardId: number): string {
  if (cardId >= 1000) return ''; // user-submitted cards use gradient, no image
  const keys = Object.keys(CARD_IMAGE_MAP).map(Number);
  return CARD_IMAGE_MAP[cardId] ?? CARD_IMAGE_MAP[keys[(cardId - 1) % keys.length]] ?? '';
}
interface Props {
  card: Card;
  index: number;
  isSelected: boolean;
  onSelect: (card: Card, imgSrc: string) => void;
}

export function FilmFrame({ card, isSelected, onSelect }: Props) {
  const isUserCard = card.id >= 1000;
  const keys = Object.keys(CARD_IMAGE_MAP).map(Number);
  const imgSrc = isUserCard
    ? undefined
    : CARD_IMAGE_MAP[card.id] ?? CARD_IMAGE_MAP[keys[(card.id - 1) % keys.length]];

  return (
    <button
      aria-label={`Open memory card: ${card.category}`}
      onClick={() => onSelect(card, imgSrc ?? '')}
      style={{
        position: "relative",
        width: `${FRAME_W}px`,
        height: `${FRAME_HEIGHT}px`,
        border: "none",
        borderLeft: "1px solid rgba(80,50,20,0.35)",
        cursor: "pointer",
        padding: 0,
        overflow: "hidden",
        flexShrink: 0,
        background: FRAME_FILLS[(card.id - 1) % FRAME_FILLS.length],
        display: "block",
      }}
    >
      {/* Film photo — only for built-in cards */}
      {!isUserCard && imgSrc && (
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            filter: isSelected
              ? "blur(0px) saturate(1)"
              : "blur(10px) saturate(0.7)",
            transform: isSelected ? "scale(1)" : "scale(1.08)",
            transition: "filter 0.55s ease, transform 0.55s ease",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      )}

      {/* Vignette overlay */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(61, 61, 61, 0.7) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Film edge metadata */}
      <span
        style={{
          position: "absolute",
          bottom: "6px",
          right: "10px",
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "12px",
          fontWeight: 300,
          color: "rgba(232, 232, 232, 0.72)",
          letterSpacing: "0.05em",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          // textTransform: "uppercase",
        }}
      >
        {card.category}
      </span>
    </button>
  );
}
