import { useCallback, useEffect, useState } from "react";
import { useDeck } from "./hooks/useDeck";
import { useShake } from "./hooks/useShake";
import { LandingScreen } from "./components/LandingScreen";
import { FilmStrip } from "./components/FilmStrip";
import { CardOverlay } from "./components/CardOverlay";
import { SuggestTopic } from "./components/SuggestTopic";
import { AboutModal } from "./components/AboutModal";
import { getCardImage, FILM_IMAGE_URLS } from "./components/FilmFrame";
import { CARDS } from "./data/cards";
import type { Card, Category } from "./data/cards";
import { supabase } from "./lib/supabase";

export default function App() {
  const { current, used, draw, next, dismiss } = useDeck();
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [imagesReady, setImagesReady] = useState(false);
  const [currentImgSrc, setCurrentImgSrc] = useState<string | null>(null);
  const [phase, setPhase] = useState<"landing" | "leaving" | "film">("landing");
  const [showAbout, setShowAbout] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (FILM_IMAGE_URLS.length === 0) { setImagesReady(true); return; }
    let loaded = 0;
    const total = FILM_IMAGE_URLS.length;
    const timeout = setTimeout(() => setImagesReady(true), 4000);
    FILM_IMAGE_URLS.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded >= total) { clearTimeout(timeout); setImagesReady(true); }
      };
      img.src = src;
    });
    return () => clearTimeout(timeout);
  }, []);

  const fetchTopicCards = useCallback(async () => {
    const { data, error } = await supabase
      .from("topic_suggestions")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      console.warn("[topics] fetch error:", error.code, error.message);
      return;
    }
    console.log("[topics] fetched", data?.length ?? 0, "rows:", data);
    if (data) {
      setUserCards(
        data.map((row) => ({
          id: 1000 + Number(row.id),
          category: ((row.category ?? "favourite things") as Category),
          question: row.topic,
        }))
      );
    }
  }, []);

  useEffect(() => {
    fetchTopicCards();
  }, [fetchTopicCards]);

  useEffect(() => {
    setCurrentImgSrc(current ? getCardImage(current.id) : null);
  }, [current]);

  // Hide hint after 4s, or immediately when a card is opened
  useEffect(() => {
    if (phase !== "film") return;
    const t = setTimeout(() => setShowHint(false), 6000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (current) setShowHint(false);
  }, [current]);

  const handleEnter = () => {
    setPhase("leaving");
    setTimeout(() => setPhase("film"), 500);
  };

  const handleSelect = (card: Parameters<typeof draw>[0], _imgSrc: string) => {
    draw(card);
  };

  const handleTopicSubmit = (_topic: string, _category: Category) => {
    fetchTopicCards();
  };

  useShake(() => {
    if (current) next();
  });

  return (
    <>
      {/* Landing */}
      {(phase === "landing" || phase === "leaving") && (
        <div
          style={{
            animation: phase === "leaving"
              ? "fadeOut 0.5s ease forwards"
              : "fadeIn 0.6s ease forwards",
            pointerEvents: phase === "leaving" ? "none" : "auto",
          }}
        >
          <LandingScreen onEnter={handleEnter} imagesReady={imagesReady} />
        </div>
      )}

      {/* Film strips */}
      {phase === "film" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
            gap: "clamp(12px, 3dvh, 32px)",
            paddingBottom: "40px",
            animation: "fadeIn 0.6s ease forwards",
          }}
        >
          {/* Tap hint */}
          <div
            aria-hidden="true"
            style={{
              textAlign: "center",
              opacity: showHint ? 1 : 0,
              transition: "opacity 1s ease",
              pointerEvents: "none",
              position: "absolute",
              top: "clamp(18px, 4.5dvh, 34px)",
              left: 0,
              right: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "16px",
                fontWeight: 400,
                // letterSpacing: "0.22em",
                fontStyle: "italic",
                color: "rgb(255, 255, 255, 0.75)",
              }}
            >
              Tap any frame to begin
            </span>
          </div>

          <FilmStrip
            isOpen={!!current}
            selectedCardId={current?.id ?? null}
            onSelect={handleSelect}
            extraCards={userCards}
          />
          <FilmStrip
            isOpen={!!current}
            selectedCardId={current?.id ?? null}
            onSelect={handleSelect}
            reversed
            extraCards={userCards}
          />
        </div>
      )}

      {/* Fixed overlays */}
      {phase === "film" && current && (
        <CardOverlay
          card={current}
          imgSrc={currentImgSrc ?? undefined}
          usedCount={used.length}
          totalCount={CARDS.length}
          onNext={next}
          onDismiss={() => dismiss()}
        />
      )}

      {/* About mark — bottom left */}
      {phase === "film" && (
        <button
          onClick={() => setShowAbout(true)}
          aria-label="About this project"
          style={{
            position: "fixed",
            bottom: "max(30px, calc(env(safe-area-inset-bottom) + 16px))",
            left: "max(4dvh, 24px)",
            zIndex: 40,
            background: "none",
            border: "none",
            padding: "8px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            transition: "opacity 0.2s ease",
            opacity: 0.75,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.45")}
        >
          <span style={{
            fontSize: "18px",
            color: "rgb(255, 166, 2)",
            lineHeight: 1,
            display: "block",
            textShadow: "0 0 12px rgba(201,169,110,0.6)",
          }}>✦</span>
          <span style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgb(255, 166, 2)",
            display: "block",
          }}>about</span>
        </button>
      )}

      {phase === "film" && <SuggestTopic onTopicSubmit={handleTopicSubmit} />}

      {/* About modal */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </>
  );
}
