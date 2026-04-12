export default function Header() {
  return (
    <header style={{ textAlign: 'center', paddingTop: 48, paddingBottom: 32 }}>
      <h1
        style={{
          fontFamily: "'IBM Plex Serif', Georgia, serif",
          fontSize: 28,
          fontWeight: 600,
          color: '#f4f4f4',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          marginBottom: 6,
        }}
      >
        Claude Family
      </h1>
      <p
        style={{
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        agent management system
      </p>
    </header>
  );
}
