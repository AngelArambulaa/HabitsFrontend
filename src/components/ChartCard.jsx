import Spinner from "./Spinner";

export default function ChartCard({ title, loading, error, children, action }) {
  return (
    <div style={{
      background:   "var(--surface)",
      borderRadius: "var(--radius)",
      boxShadow:    "var(--shadow)",
      border:       "1px solid var(--border)",
      padding:      "1.25rem",
      marginBottom: "1rem",
    }}>
      {/* Card header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: loading || error ? "1rem" : "1rem" }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--text-hint)" }}>
          {title}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {loading && <Spinner size={14} color="var(--text-hint)" />}
          {action}
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div style={{ textAlign:"center", padding:"2rem 1rem", color:"#B91C1C", fontSize:13 }}>
          Failed to load — try refreshing
        </div>
      ) : loading ? (
        <div style={{
          height:       140,
          background:   "var(--surface2)",
          borderRadius: "var(--radius-sm)",
          animation:    "pulse 1.4s ease-in-out infinite",
        }}>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
      ) : (
        children
      )}
    </div>
  );
}