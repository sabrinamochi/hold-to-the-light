export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header-left">
        <span
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: '10px',
            fontWeight: 300,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(200,170,130,0.4)',
            display: 'block',
            marginBottom: '10px',
          }}
        >
          a call · every sunday
        </span>

        <h1
          style={{
            fontFamily: "'EB Garamond', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(48px, 9vw, 80px)',
            color: '#fff',
            lineHeight: 1.0,
            margin: 0,
          }}
        >
          What to say<br />to <span style={{ color: '#ffa602' }}>you</span>
        </h1>

        <div
          style={{
            width: '48px',
            height: '1px',
            background: 'rgba(200,170,130,0.2)',
            marginTop: '20px',
          }}
        />
      </div>

      <p
        style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: '14px',
          fontWeight: 300,
          color: 'rgba(245,233,218,0.7)',
          lineHeight: 1.7,
          maxWidth: '90%',
        }}
      >
        She rode the bus with me to school and taught me everything — cooking,
        folding clothes, how to be still. Now I'm in the US and she's in Taiwan,
        and every Sunday I call without knowing what to say. She has dementia.
        She still knows my voice, but the conversation fades quickly. Her world
        has grown smaller as mine has expanded, and the overlap feels thin. This
        project is for that gap — a simple page to remind me there's always
        something to talk about, if I know where to look.
      </p>
    </header>
  );
}
