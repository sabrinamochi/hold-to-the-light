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
  const [aboutType, setAboutType] = useState<"project" | "me">("project");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (FILM_IMAGE_URLS.length === 0) {
      setImagesReady(true);
      return;
    }
    let loaded = 0;
    const total = FILM_IMAGE_URLS.length;
    const timeout = setTimeout(() => setImagesReady(true), 4000);
    FILM_IMAGE_URLS.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded >= total) {
          clearTimeout(timeout);
          setImagesReady(true);
        }
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
          category: (row.category ?? "favourite things") as Category,
          question: row.topic,
        })),
      );
    }
  }, []);

  useEffect(() => {
    fetchTopicCards();
  }, [fetchTopicCards]);

  useEffect(() => {
    setCurrentImgSrc(current ? getCardImage(current.id) : null);
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
            animation:
              phase === "leaving"
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
              textAlign: "left",
              pointerEvents: "none",
              position: "absolute",
              top: "clamp(24px, 5dvh, 36px)",
              left: 'clamp(18px, 4dvw, 28px)',
              right: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "18px",
                fontWeight: 400,
                fontStyle: "italic",
                color: "rgb(255, 255, 255, 0.75)",
                lineHeight: "32px",
              }}
            >
              Tap a frame
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

      {/* Full-screen menu backdrop */}
      {phase === "film" && menuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 94,
            background: "rgba(8, 5, 2, 0.97)",
            animation: "fadeIn 0.22s ease forwards",
          }}
        />
      )}

      {/* Plus/minus menu — top right */}
      {phase === "film" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            zIndex: 95,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {/* Toggle button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none",
              border: "none",
              padding: "0 4px",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: "32px",
              fontWeight: 300,
              color: "rgba(245,233,218,0.55)",
              lineHeight: 1,
              transition: "color 0.2s ease, transform 0.3s ease",
              transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
              margin: "clamp(24px, 5dvh, 36px) clamp(18px, 4dvw, 28px)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(245,233,218,0.9)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(245,233,218,0.55)")
            }
          >
            +
          </button>

          {/* Menu items */}
          {menuOpen && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                gap: "4px",
                paddingRight: "clamp(18px, 4dvw, 28px)",
                animation: "menuIn 0.2s ease forwards",
              }}
            >
              {[
                {
                  label: "About the project",
                  delay: "0s",
                  onClick: () => {
                    setAboutType("project");
                    setShowAbout(true);
                    setMenuOpen(false);
                  },
                },
                {
                  label: "About me",
                  delay: "0.06s",
                  onClick: () => {
                    window.open("https://sabrinamochi.github.io/", "_blank", "noopener,noreferrer");
                    setMenuOpen(false);
                  },
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  style={{
                    background: "rgba(22, 14, 6, 0)",
                    border: "0px solid rgba(201,169,110,0)",
            
                    padding: "11px 18px",
                    cursor: "pointer",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "14px",
                    fontWeight: 400,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(245,233,218,0.85)",
                    textAlign: "right",
                    transition: "color 0.2s ease, background 0.2s ease",
                    animation: `menuItemIn 0.2s ease ${item.delay} forwards`,
                    opacity: 0,
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(245,233,218,1)";
                    e.currentTarget.style.background = "rgba(197, 136, 72, 0.95)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(245,233,218,0.85)";
                    e.currentTarget.style.background = "rgba(22, 14, 6, 0)";
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {phase === "film" && <SuggestTopic onTopicSubmit={handleTopicSubmit} />}

      {/* About modal */}
      {showAbout && (
        <AboutModal type={aboutType} onClose={() => setShowAbout(false)} />
      )}
    </>
  );
}
