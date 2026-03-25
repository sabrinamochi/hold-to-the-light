export function AppHeader() {
  return (
    <header className="app-header">
      <span
        style={{
          fontFamily: "'Lora', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(28px, 8.5vw, 60px)",
          color: "#fff",
          lineHeight: 1.1,
        }}
      >
        What to say to <span style={{ color: "#ffa602" }}>you</span>
      </span>

      <p
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "14px",
          color: "rgba(245, 233, 218, 0.8)",
          lineHeight: 1.65,
          maxWidth: "90%",
          textAlign: "left",
        }}
      >
        She rode the bus with me to school and taught me everything — cooking,
        folding clothes, how to be still. Now I’m in the US and she’s in Taiwan,
        and every Sunday I call without knowing what to say. She has dementia.
        She still knows my voice, but the conversation fades quickly. Her world
        has grown smaller as mine has expanded, and the overlap feels thin. This
        project is for that gap — a simple page to remind me there’s always
        something to talk about, if I know where to look.
      </p>
    </header>
  );
}
