import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Today       from "./pages/Today";
import Stats       from "./pages/Stats";
import Manage      from "./pages/Manage";
import HabitDetail from "./pages/HabitDetail";
import Login       from "./pages/Login";
import ThemeToggle from "./components/ThemeToggle";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function Shell() {
  const { user, signout } = useAuth();

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday:"long", month:"long", day:"numeric"
  });

  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", padding:"2rem 1rem" }}>
      <div style={{ maxWidth:560, margin:"0 auto" }}>

        {/* Header */}
        <div className="fade-up" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"2rem" }}>
          <div>
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, lineHeight:1.15, letterSpacing:"-0.3px", color:"var(--text)" }}>
              Good morning, {user?.name?.split(" ")[0]} 🌿
            </h1>
            <p style={{ fontSize:13, color:"var(--text-muted)", marginTop:4 }}>{dateStr}</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <ThemeToggle />
            <button onClick={signout} style={{
              background:"none", border:"1px solid var(--border)",
              borderRadius:8, padding:"6px 12px", fontSize:12,
              color:"var(--text-muted)", cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",
            }}>
              Log out
            </button>
          </div>
        </div>

        {/* Nav — hide on detail page */}
        <Routes>
          <Route path="/habit/:id" element={null} />
          <Route path="*" element={
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
          } />
        </Routes>

        {/* Pages */}
        <Routes>
          <Route path="/"          element={<Today       />} />
          <Route path="/stats"     element={<Stats       />} />
          <Route path="/manage"    element={<Manage      />} />
          <Route path="/habit/:id" element={<HabitDetail />} />
        </Routes>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Shell />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}