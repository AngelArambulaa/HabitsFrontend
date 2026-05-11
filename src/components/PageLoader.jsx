export default function PageLoader() {
  const pulse = {
    background:    "var(--surface2)",
    borderRadius:  "var(--radius-sm)",
    animation:     "pulse 1.4s ease-in-out infinite",
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {/* Ring card skeleton */}
        <div style={{ ...pulse, height:112, borderRadius:"var(--radius)" }} />

        {/* Metric cards skeleton */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div style={{ ...pulse, height:80 }} />
          <div style={{ ...pulse, height:80 }} />
        </div>

        {/* List skeleton */}
        <div style={{ background:"var(--surface)", borderRadius:"var(--radius)", border:"1px solid var(--border)", overflow:"hidden" }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 1.25rem", borderBottom:"1px solid var(--border)" }}>
              <div style={{ ...pulse, width:36, height:36, borderRadius:10, flexShrink:0 }} />
              <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
                <div style={{ ...pulse, height:14, width:"55%", borderRadius:4 }} />
                <div style={{ ...pulse, height:10, width:"35%", borderRadius:4 }} />
              </div>
              <div style={{ ...pulse, width:30, height:30, borderRadius:"50%", flexShrink:0 }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}