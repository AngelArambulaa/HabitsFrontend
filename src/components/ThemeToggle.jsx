import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} title={dark ? "Switch to light" : "Switch to dark"}
      style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", padding:0 }}>
      <span style={{ fontSize:12, color:"var(--text-muted)", fontFamily:"'DM Sans',sans-serif" }}>
        {dark ? "Dark" : "Light"}
      </span>
      <div style={{
        width:44, height:24, borderRadius:12,
        background: dark ? "var(--green)" : "var(--surface2)",
        border:"1px solid var(--border)", position:"relative", flexShrink:0,
      }}>
        <div style={{
          width:18, height:18, borderRadius:"50%", background:"#fff",
          position:"absolute", top:2, left:3,
          transform: dark ? "translateX(20px)" : "translateX(0)",
          transition:"transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow:"0 1px 4px rgba(0,0,0,0.15)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:10,
        }}>
          {dark ? "🌙" : "☀️"}
        </div>
      </div>
    </button>
  );
}