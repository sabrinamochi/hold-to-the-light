import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Category } from "../data/cards";

const CATEGORY_OPTIONS: { label: string; value: Category; color: string }[] = [
  { label: "Favourite things",    value: "favourite things",    color: "#C9A96E" },
  { label: "Their younger years", value: "their younger years", color: "#7A9E8E" },
  { label: "Shared memories",     value: "shared memories",     color: "#faaa88ff" },
];

interface Props {
  onTopicSubmit?: (topic: string, category: Category) => void;
}

export function SuggestTopic({ onTopicSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<Category>("favourite things");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    } else {
      setTopic("");
      setStatus("idle");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleSubmit = async () => {
    if (!topic.trim()) return;
    setStatus("loading");
    const { error } = await supabase
      .from("topic_suggestions")
      .insert({ topic: topic.trim(), category });
    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      onTopicSubmit?.(topic.trim(), category);
      setTopic("");
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  return (
    <>
      {/* Floating pill button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Suggest a conversation topic"
        style={{
          position: "fixed",
          bottom: "max(28px, calc(env(safe-area-inset-bottom) + 16px))",
          right: "max(4dvh, 24px)",
          zIndex: 90,
          background: "rgba(18, 11, 5, 0.92)",
          color: "rgba(245,233,218,0.9)",
          border: "1px solid rgba(201,169,110,0.18)",
          borderRadius: "100px",
          padding: "12px 28px",
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "0 0 0 1px rgba(201,169,110,0.1), 0 -8px 24px -4px rgba(201,169,110,0.38), 0 8px 20px -4px rgba(220,200,170,0.08), 0 0 48px rgba(196,133,106,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
          transition: "box-shadow 0.3s ease",
          display: "flex",
          alignItems: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 1px rgba(201,169,110,0.22), 0 -12px 32px -2px rgba(201,169,110,0.55), 0 10px 28px -2px rgba(220,200,170,0.14), 0 0 70px rgba(196,133,106,0.22), inset 0 1px 0 rgba(255,255,255,0.09)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 1px rgba(201,169,110,0.1), 0 -8px 24px -4px rgba(201,169,110,0.38), 0 8px 20px -4px rgba(220,200,170,0.08), 0 0 48px rgba(196,133,106,0.12), inset 0 1px 0 rgba(255,255,255,0.06)";
        }}
      >
        Suggest a topic
      </button>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Suggest a topic"
          onClick={handleBackdropClick}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            background: "rgba(8,5,2,0.75)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            animation: "fadeIn 0.25s ease forwards",
          }}
        >
          {/* Sheet */}
          <div
            style={{
              position: "relative",
              width: "min(480px, 100vw)",
              background: "rgba(38,24,10,0.72)",
              backdropFilter: "blur(60px)",
              WebkitBackdropFilter: "blur(60px)",
              borderRadius: "28px 28px 0 0",
              border: "1px solid rgba(255,255,255,0.1)",
              borderBottom: "none",
              boxShadow: "0 -20px 80px rgba(0,0,0,0.5)",
              padding: "40px 36px 48px",
              display: "flex",
              flexDirection: "column",
              gap: "0",
              // Subtle grain via pseudo handled by globals; add an inset grain via box-shadow
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grain overlay */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                backgroundSize: "200px 200px",
                mixBlendMode: "overlay",
                opacity: 0.12,
                pointerEvents: "none",
                borderRadius: "inherit",
              }}
            />

            {/* Drag handle */}
            <div
              aria-hidden="true"
              style={{
                width: "36px",
                height: "4px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "2px",
                margin: "0 auto 36px",
              }}
            />

            {/* Header */}
            <div style={{ marginBottom: "32px" }}>

              <h2
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(32px, 6vw, 42px)",
                  color: "rgba(255,248,238,0.96)",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                What would you<br />ask a grandparent?
              </h2>
            </div>

            {status === "success" ? (
              <div style={{ paddingTop: "8px", paddingBottom: "32px" }}>
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "20px",
                    color: "rgba(201,169,110,0.9)",
                    lineHeight: 1.6,
                  }}
                >
                  Thank you — your topic has been added to the strip ✦
                </p>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    marginTop: "32px",
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
                    boxShadow: "0 0 0 1px rgba(201,169,110,0.1), 0 -8px 24px -4px rgba(201,169,110,0.42), 0 8px 20px -4px rgba(220,200,170,0.08), 0 0 50px rgba(196,133,106,0.14), inset 0 1px 0 rgba(255,255,255,0.06)",
                    transition: "box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 0 1px rgba(201,169,110,0.2), 0 -12px 32px -2px rgba(201,169,110,0.6), 0 10px 28px -2px rgba(220,200,170,0.14), 0 0 70px rgba(196,133,106,0.24), inset 0 1px 0 rgba(255,255,255,0.09)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 0 1px rgba(201,169,110,0.1), 0 -8px 24px -4px rgba(201,169,110,0.42), 0 8px 20px -4px rgba(220,200,170,0.08), 0 0 50px rgba(196,133,106,0.14), inset 0 1px 0 rgba(255,255,255,0.06)";
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Category picker */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
                  {CATEGORY_OPTIONS.map((opt) => {
                    const active = category === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setCategory(opt.value)}
                        style={{
                          background: active ? `${opt.color}22` : "transparent",
                          border: `1px solid ${active ? opt.color + "99" : "rgba(255,255,255,0.15)"}`,
                          borderRadius: "100px",
                          padding: "7px 14px",
                          fontFamily: "'Nunito Sans', sans-serif",
                          fontSize: "12px",
                          fontWeight: active ? 600 : 400,
                          letterSpacing: "0.06em",
                          color: active ? opt.color : "rgba(220,195,160,0.55)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          textTransform: 'uppercase'
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Underline-style textarea */}
                <div style={{ marginBottom: "36px" }}>
                  <textarea
                    ref={textareaRef}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. What song always takes you back?"
                    rows={3}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.18)",
                      borderRadius: 0,
                      padding: "8px 0 14px",
                      fontFamily: "'EB Garamond', serif",
                      fontStyle: "italic",
                      fontSize: "20px",
                      fontWeight: 400,
                      color: "rgba(255,248,238,0.92)",
                      resize: "none",
                      outline: "none",
                      lineHeight: 1.6,
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderBottomColor = "rgba(201,169,110,0.6)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.18)")
                    }
                  />
                  {status === "error" && (
                    <p
                      style={{
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: "12px",
                        color: "rgba(196,133,106,0.8)",
                        marginTop: "8px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Something went wrong — please try again
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <button
                    onClick={handleSubmit}
                    disabled={!topic.trim() || status === "loading"}
                    style={{
                      width: "100%",
                      background: topic.trim() ? "rgba(14, 9, 4, 0.95)" : "rgba(255,255,255,0.04)",
                      border: topic.trim() ? "1px solid rgba(201,169,110,0.25)" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "100px",
                      padding: "16px",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: topic.trim() ? "rgba(245,233,218,0.92)" : "rgba(255,255,255,0.28)",
                      cursor: topic.trim() ? "pointer" : "default",
                      transition: "box-shadow 0.3s ease, border-color 0.3s ease, color 0.3s ease",
                      boxShadow: topic.trim()
                        ? "0 0 0 1px rgba(201,169,110,0.1), 0 -8px 24px -4px rgba(201,169,110,0.5), 0 8px 20px -4px rgba(220,200,170,0.1), 0 0 50px rgba(196,133,106,0.18), inset 0 1px 0 rgba(255,255,255,0.07)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!topic.trim()) return;
                      e.currentTarget.style.boxShadow = "0 0 0 1px rgba(201,169,110,0.2), 0 -12px 32px -2px rgba(201,169,110,0.65), 0 10px 28px -2px rgba(220,200,170,0.16), 0 0 70px rgba(196,133,106,0.28), inset 0 1px 0 rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      if (!topic.trim()) return;
                      e.currentTarget.style.boxShadow = "0 0 0 1px rgba(201,169,110,0.1), 0 -8px 24px -4px rgba(201,169,110,0.5), 0 8px 20px -4px rgba(220,200,170,0.1), 0 0 50px rgba(196,133,106,0.18), inset 0 1px 0 rgba(255,255,255,0.07)";
                    }}
                  >
                    {status === "loading" ? "Sending…" : "Submit"}
                  </button>

                  <button
                    onClick={() => setOpen(false)}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "rgba(220,195,160,0.5)",
                      cursor: "pointer",
                      padding: "10px",
                      letterSpacing: "0.04em",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "rgba(220,195,160,0.85)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(220,195,160,0.5)")
                    }
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
