import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
  type?: "project" | "me";
}

export function AboutModal({ onClose, type = "project" }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "transparent",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(560px, 100vw)",
          height: "100dvh",
          overflowY: "auto",
          background: "rgba(28, 18, 8, 0.96)",
          backdropFilter: "blur(60px)",
          WebkitBackdropFilter: "blur(60px)",
          borderRadius: 0,
          border: "none",
          padding: "clamp(24px, 6dvh, 48px) clamp(20px, 6vw, 36px) 52px",
        }}
      >
        {/* Grain */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
            mixBlendMode: "overlay",
            opacity: 0.1,
            pointerEvents: "none",
          }}
        />

        {type === "project" ? (
          <>
            {/* Eyebrow */}
            <p
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(201,169,110,0.6)",
                marginBottom: "14px",
              }}
            >
              about the project
            </p>
            <h2
              style={{
                fontFamily: "'EB Garamond', serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(28px, 5vw, 38px)",
                color: "rgba(255,248,238,0.96)",
                lineHeight: 1.1,
                margin: "0 0 28px",
              }}
            >
              What to say to you
            </h2>
            <div
              style={{
                width: "40px",
                height: "1px",
                background: "rgba(201,169,110,0.3)",
                marginBottom: "28px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                marginBottom: "40px",
              }}
            >
              {[
                "This is a card-drawing app I made for myself. A page to open before each weekly call with my grandma, who has dementia. She still knows my voice, still recognizes me. For a long time, I told myself that meant we could work on it. That there was still a way to help her recover.",
                "What I didn't understand is that dementia doesn't happen overnight. It happens gradually. She talks less. She stopped seeing her friends. The person I knew is still there, but she is also slowly someone different. The conversation on our weekly calls started fading. I kept running out of things to say.",
                "So I built this as a conversation opener for our weekly calls. Each card is a question inspired by Alzheimer's Association research, caregiver communities, and my own memories with her.",
                "If you're here, you probably have someone too. These cards are for you as well. If you have a question worth asking a grandparent, share it. It might help someone else find the words too."
              ].map((text, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "clamp(17px, 2.2vw, 20px)",
                    fontWeight: 400,
                    color: "rgba(245,233,218,0.82)",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {text}
                </p>
              ))}
            </div>
          </>
        ) : (
          <></>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            background: "rgba(14, 9, 4, 0.95)",
            border: "1px solid rgba(201,169,110,0.22)",
            borderRadius: "100px",
            padding: "16px",
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(245,233,218,0.88)",
            cursor: "pointer",
            boxShadow:
              "0 0 0 1px rgba(201,169,110,0.1), 0 -8px 24px -4px rgba(201,169,110,0.42), 0 8px 20px -4px rgba(220,200,170,0.08), 0 0 50px rgba(196,133,106,0.14), inset 0 1px 0 rgba(255,255,255,0.06)",
            transition: "box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 0 1px rgba(201,169,110,0.2), 0 -12px 32px -2px rgba(201,169,110,0.6), 0 10px 28px -2px rgba(220,200,170,0.14), 0 0 70px rgba(196,133,106,0.24), inset 0 1px 0 rgba(255,255,255,0.09)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 0 1px rgba(201,169,110,0.1), 0 -8px 24px -4px rgba(201,169,110,0.42), 0 8px 20px -4px rgba(220,200,170,0.08), 0 0 50px rgba(196,133,106,0.14), inset 0 1px 0 rgba(255,255,255,0.06)";
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
