import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Today       from "./pages/Today";
import Stats       from "./pages/Stats";
import Manage      from "./pages/Manage";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday:"long", month:"long", day:"numeric"
  });

  return (
    <BrowserRouter>
      <div style={{ background:"var(--bg)", minHeight:"100vh", padding:"2rem 1rem" }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>

          <div className="fade-up" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem" }}>
            <div>
              <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, lineHeight:1.15, letterSpacing:"-0.3px", color:"var(--text)" }}>
                Good morning 🌿
              </h1>
              <p style={{ fontSize:13, color:"var(--text-muted)", marginTop:4 }}>{dateStr}</p>
            </div>
            <ThemeToggle />
          </div>

          <nav className="fade-up-1" style={{ display:"flex", background:"var(--surface2)", borderRadius:12, padding:4, marginBottom:"1.5rem" }}>
            {[
              { to:"/",       label:"Today"  },
              { to:"/stats",  label:"Stats"  },
              { to:"/manage", label:"Manage" },
            ].map(({ to, label }) => (
              <NavLink key={to} to={to} end={to==="/"}
                style={({ isActive }) => ({
                  flex:1, textAlign:"center", padding:"8px",
                  borderRadius:9, fontSize:13, fontWeight:500,
                  fontFamily:"'DM Sans',sans-serif", textDecoration:"none",
                  background: isActive ? "var(--surface)" : "none",
                  color:      isActive ? "var(--text)"    : "var(--text-muted)",
                  boxShadow:  isActive ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                  transition: "all 0.2s",
                })}>
                {label}
              </NavLink>
            ))}
          </nav>

          <Routes>
            <Route path="/"       element={<Today  />} />
            <Route path="/stats"  element={<Stats  />} />
            <Route path="/manage" element={<Manage />} />
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  );
}