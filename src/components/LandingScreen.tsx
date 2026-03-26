import { CARDS, FRAME_FILLS } from "../data/cards";

const FRAME_W = 160;
const SPROCKET_H = 22;

function SprocketRow() {
  const count = 60;
  return (
    <div
      style={{
        height: `${SPROCKET_H}px`,
        background: "var(--film-base)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "8px",
        paddingLeft: "6px",
        flexShrink: 0,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: "11px",
            height: "8px",
            background: "var(--sprocket-bg)",
            borderRadius: "2px",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

function HorizontalStrip({
  delay = 0,
  duration = 40,
  reversed = false,
}: {
  delay?: number;
  duration?: number;
  reversed?: boolean;
}) {
  const frames = [...CARDS, ...CARDS];
  return (
    <div
      style={{
        width: "100%",
        height: "40vh",
        overflow: "hidden",
        background: "var(--film-base)",
        borderTop: "2px solid var(--film-border)",
        borderBottom: "2px solid var(--film-border)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "max-content",
          animation: `scrollFilmH ${duration}s linear ${delay}s infinite`,
          animationDirection: reversed ? "reverse" : "normal",
          willChange: "transform",
        }}
      >
        <SprocketRow />
        <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
          {frames.map((card, i) => (
            <div
              key={`${card.id}-${i}`}
              style={{
                width: `${FRAME_W}px`,
                height: "100%",
                flexShrink: 0,
                background: FRAME_FILLS[(card.id - 1) % FRAME_FILLS.length],
                borderLeft: "1px solid rgba(80,50,20,0.4)",
                position: "relative",
              }}
            >
              {/* vignette */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at center, transparent 30%, rgba(10,6,2,0.7) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          ))}
        </div>
        <SprocketRow />
      </div>
    </div>
  );
}

interface Props {
  onEnter: () => void;
  imagesReady?: boolean;
}

export function LandingScreen({ onEnter, imagesReady = false }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        zIndex: 10,
        overflow: "hidden",
      }}
    >
      {/* Horizontal film strips — top and bottom background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pointerEvents: "none",
          opacity: 0.3,
        }}
      >
        {/* <HorizontalStrip duration={300} delay={0} /> */}
        <HorizontalStrip duration={300} delay={-12} reversed />
      </div>

      {/* Gradient fade — top and bottom strips fade into background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(to bottom,
              var(--bg) 0%,
              transparent 32vh,
              transparent calc(100% - 32vh),
              var(--bg) 100%
            )
          `,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "clamp(32px, 7vw, 96px)",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: "'EB Garamond', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(52px, 11vw, 120px)",
            color: "#fff",
            lineHeight: 0.95,
            margin: 0,
            maxWidth: "14ch",
          }}
        >
          What to say
          <br />
          to <span style={{ color: "#ffa602" }}>you</span>
        </h1>

        {/* Rule */}
        <div
          style={{
            width: "56px",
            height: "1px",
            // background: "rgba(200,170,130,0.25)",
            margin: "28px 0",
          }}
        />

        {/* Description */}
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "clamp(16px, 2vw, 20px)",
            fontWeight: 400,
            color: "rgba(249, 243, 235, 0.96)",
            lineHeight: 1.5,
            maxWidth: "46ch",
            marginBottom: "40px",
          }}
        >
          She rode the bus with me to school every morning and taught me
          everything — how to do long division, how to talk a market vendor down
          to half price, how to knit a scarf from scratch. Now I'm in the US and
          she's in Taiwan, and every Sunday I call without knowing what to say.
          My grandmother has dementia. She still knows my voice, but the
          conversation fades fast. This is for that gap. A reminder there's
          always something to talk about.
        </p>

        {/* CTA */}
        <button
          onClick={imagesReady ? onEnter : undefined}
          disabled={!imagesReady}
          style={{
            background: "rgba(18, 11, 5, 0.9)",
            color: imagesReady
              ? "rgba(245,233,218,0.92)"
              : "rgba(245,233,218,0.4)",
            border: "none",
            borderRadius: "100px",
            padding: "clamp(12px, 2vw, 16px) clamp(36px, 6vw, 52px)",
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "clamp(13px, 1.4vw, 16px)",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: imagesReady ? "pointer" : "default",
            boxShadow: imagesReady
              ? "0px 0px 0px 1px rgba(201,169,110,0.16), 0 -8px 20px -4px rgba(201,169,110,0.28), 0 8px 18px -4px rgba(220,200,170,0.06), 0 0 40px rgba(196,133,106,0.09), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0px 0px 0px 1px rgba(255,255,255,0.06)",
            transition: "box-shadow 0.3s ease, color 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          onMouseEnter={(e) => {
            if (!imagesReady) return;
            e.currentTarget.style.boxShadow =
              "0px 0px 0px 1px rgba(201,169,110,0.24), 0 -10px 26px -2px rgba(201,169,110,0.4), 0 10px 22px -2px rgba(220,200,170,0.1), 0 0 55px rgba(196,133,106,0.14), inset 0 1px 0 rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0px 0px 0px 1px rgba(201,169,110,0.16), 0 -8px 20px -4px rgba(201,169,110,0.28), 0 8px 18px -4px rgba(220,200,170,0.06), 0 0 40px rgba(196,133,106,0.09), inset 0 1px 0 rgba(255,255,255,0.06)";
          }}
        >
          {imagesReady ? (
            <>
              Explore <span style={{ opacity: 0.6, fontSize: "16px" }}>→</span>
            </>
          ) : (
            <>
              <span
                style={{
                  display: "inline-block",
                  width: "14px",
                  height: "14px",
                  border: "2px solid rgba(245,233,218,0.2)",
                  borderTopColor: "rgba(245,233,218,0.55)",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  flexShrink: 0,
                }}
              />
              Loading
            </>
          )}
        </button>
      </div>
    </div>
  );
}
