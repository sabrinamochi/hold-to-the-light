export function AppHeader() {
  return (
    <header
      style={{
     
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px 2px 50px',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <span
        style={{
          fontFamily: "'Lora', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 'clamp(28px, 8.5vw, 60px)',
          color: '#fff',
        }}
      >
        What to say to <span style={{color: '#ffa602'}}>you</span>
      </span>
    </header>
  );
}
