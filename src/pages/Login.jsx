import { useState } from "react";
import { login, register } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [mode,    setMode]    = useState("login"); // "login" | "register"
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [password,setPassword]= useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { signin } = useAuth();
  const navigate   = useNavigate();

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const fn   = mode === "login" ? login : register;
      const body = mode === "login" ? { email, password } : { name, email, password };
      const res  = await fn(body);
      signin(res.data.token, { name: res.data.name, email: res.data.email });
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:"100%", marginBottom:12, display:"block",
    border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)",
    padding:"11px 14px", fontFamily:"'DM Sans',sans-serif", fontSize:14,
    background:"var(--bg)", color:"var(--text)", outline:"none",
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div style={{ width:"100%", maxWidth:400 }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
            <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ width:100, height:100, marginBottom:0, display:"inline-block" }} 
            />
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:"var(--text)", marginBottom:4 }}>
                Habit Tracker
            </h1>
            <p style={{ fontSize:13, color:"var(--text-muted)" }}>
                {mode === "login" ? "Welcome back!" : "Create your account"}
            </p>
        </div>
        {/* Card */}
        <div style={{ background:"var(--surface)", borderRadius:"var(--radius)", boxShadow:"var(--shadow)", border:"1px solid var(--border)", padding:"1.5rem" }}>

          {/* Tab switcher */}
          <div style={{ display:"flex", background:"var(--surface2)", borderRadius:10, padding:4, marginBottom:"1.5rem" }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                flex:1, padding:"8px", border:"none", borderRadius:8, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500,
                background: mode === m ? "var(--surface)" : "none",
                color:      mode === m ? "var(--text)"    : "var(--text-muted)",
                boxShadow:  mode === m ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                transition: "all 0.2s",
              }}>
                {m === "login" ? "Log in" : "Register"}
              </button>
            ))}
          </div>

          {/* Fields */}
          {mode === "register" && (
            <input style={inputStyle} placeholder="Your name" value={name}
              onChange={e => setName(e.target.value)}
              onFocus={e => e.target.style.borderColor = "var(--green)"}
              onBlur={e  => e.target.style.borderColor = "var(--border)"}
            />
          )}

          <input style={inputStyle} type="email" placeholder="Email address" value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={e => e.target.style.borderColor = "var(--green)"}
            onBlur={e  => e.target.style.borderColor = "var(--border)"}
          />

          <input style={inputStyle} type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={e => e.target.style.borderColor = "var(--green)"}
            onBlur={e  => e.target.style.borderColor = "var(--border)"}
            onKeyDown={e => e.key === "Enter" && submit()}
          />

          {/* Error */}
          {error && (
            <div style={{ background:"#FEF0F0", border:"1px solid #FCA5A5", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#DC2626", marginBottom:12 }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button onClick={submit} disabled={loading} style={{
            width:"100%", padding:"12px", border:"none",
            borderRadius:"var(--radius-sm)",
            background: loading ? "var(--text-hint)" : "var(--green)",
            color:"#fff", fontSize:14, fontWeight:600,
            fontFamily:"'DM Sans',sans-serif", cursor: loading ? "not-allowed" : "pointer",
            transition:"background 0.2s",
          }}>
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </button>
        </div>
      </div>
    </div>
  );
}