import { useState, useEffect } from "react";
import { getHabits, createHabit, deleteHabit } from "../api";
import Button from "../components/Button";

const COLORS = ["#1D9E75","#378ADD","#D4537E","#D85A30","#BA7517","#534AB7"];
const ICONS  = ["⭐","🏃","📚","🧘","💧","🍎","✍️","🎯","💪","🌙","⚽","📖","🪥"];
const DAYS   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function Manage() {
  const [habits,   setHabits]   = useState([]);
  const [form,     setForm]     = useState({ name:"", icon:"⭐", color:COLORS[0], category:"general", days:[0,1,2,3,4,5,6] });
  const [adding,   setAdding]   = useState(false);   //  loading
  const [deleting, setDeleting] = useState(null);    // borra loading (guarda id)
  const [pageLoading, setPageLoading] = useState(true);

  const load = () => getHabits().then(r => setHabits(r.data));

  useEffect(() => {
    load().finally(() => setPageLoading(false));
  }, []);

  const toggleDay = (i) => {
    setForm(f => {
      const next = f.days.includes(i) ? f.days.filter(d => d !== i) : [...f.days, i].sort();
      return { ...f, days: next.length ? next : f.days };
    });
  };

  const add = async () => {
    if (!form.name.trim() || adding) return;          
    setAdding(true);
    try {
      await createHabit(form);
      setForm({ name:"", icon:"⭐", color:COLORS[0], category:"general", days:[0,1,2,3,4,5,6] });
      await load();
    } finally {
      setAdding(false);                               
    }
  };

  const remove = async (id) => {
    if (deleting) return;
    setDeleting(id);
    try {
      await deleteHabit(id);
      await load();
    } finally {
      setDeleting(null);
    }
  };

  const inputStyle = {
    width:"100%", marginBottom:12,
    border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)",
    padding:"10px 14px", fontFamily:"'DM Sans',sans-serif", fontSize:14,
    background:"var(--bg)", color:"var(--text)", outline:"none", display:"block",
  };

  if (pageLoading) return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ background:"var(--surface2)", borderRadius:"var(--radius)", height:420, animation:"pulse 1.4s ease-in-out infinite" }} />
      <div style={{ background:"var(--surface2)", borderRadius:"var(--radius)", height:200, animation:"pulse 1.4s ease-in-out infinite" }} />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );

  return (
    <div>
      {/* Add card */}
      <div style={{ background:"var(--surface)", borderRadius:"var(--radius)", boxShadow:"var(--shadow)", border:"1px solid var(--border)", padding:"1.25rem", marginBottom:"1rem" }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--text-hint)", marginBottom:"1rem" }}>
          New habit
        </div>

        <input style={inputStyle} placeholder="Habit name..."
          value={form.name}
          onChange={e => setForm(f => ({...f, name: e.target.value}))}
          onFocus={e => e.target.style.borderColor = "var(--green)"}
          onBlur={e  => e.target.style.borderColor = "var(--border)"}
          onKeyDown={e => e.key === "Enter" && add()}
          disabled={adding}
        />

        {/* Icons */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
          {ICONS.map(icon => (
            <button key={icon} onClick={() => setForm(f => ({...f, icon}))} disabled={adding} style={{
              fontSize:16, padding:6, borderRadius:8, border:"none", cursor: adding ? "not-allowed" : "pointer",
              background: form.icon === icon ? "var(--surface2)" : "transparent",
              transform:  form.icon === icon ? "scale(1.2)" : "scale(1)",
              transition: "all 0.15s",
            }}>{icon}</button>
          ))}
        </div>

        {/* Colors */}
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          {COLORS.map(c => (
            <button key={c} onClick={() => setForm(f => ({...f, color:c}))} disabled={adding} style={{
              width:28, height:28, borderRadius:"50%", background:c, border:"none",
              cursor:       adding ? "not-allowed" : "pointer",
              transform:    form.color === c ? "scale(1.25)" : "scale(1)",
              outline:      form.color === c ? `2px solid ${c}` : "none",
              outlineOffset: 2, transition:"transform 0.15s",
            }} />
          ))}
        </div>

        {/* Category */}
        <select style={{ ...inputStyle, cursor: adding ? "not-allowed" : "pointer" }}
          value={form.category}
          onChange={e => setForm(f => ({...f, category:e.target.value}))}
          disabled={adding}>
          {["general","health","learning","mindfulness","productivity","social"].map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>

        {/* Day picker */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, color:"var(--text-hint)", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:8 }}>
            Active days
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {DAYS.map((day, i) => {
              const active = form.days.includes(i);
              return (
                <button key={i} onClick={() => toggleDay(i)} disabled={adding} style={{
                  flex:1, padding:"7px 0", borderRadius:8,
                  border:      `1.5px solid ${active ? "var(--green)" : "var(--border)"}`,
                  background:  active ? "var(--green)" : "var(--bg)",
                  color:       active ? "#fff" : "var(--text-muted)",
                  fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
                  cursor:      adding ? "not-allowed" : "pointer",
                  transition:  "all 0.15s",
                }}>{day}</button>
              );
            })}
          </div>
        </div>

        {/* 👇 Button component handles loading state */}
        <Button onClick={add} loading={adding} fullWidth>
          Add habit
        </Button>
      </div>

      {/* Habits list */}
      <div style={{ background:"var(--surface)", borderRadius:"var(--radius)", boxShadow:"var(--shadow)", border:"1px solid var(--border)", overflow:"hidden" }}>
        <div style={{ padding:"1.125rem 1.25rem 0.75rem", borderBottom:"1px solid var(--border)", fontSize:11, fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--text-hint)" }}>
          Your habits
        </div>

        {habits.length === 0 && (
          <p style={{ textAlign:"center", padding:"3rem 1rem", fontSize:14, color:"var(--text-hint)" }}>
            No habits yet — add one above!
          </p>
        )}

        {habits.map(h => (
          <div key={h._id}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 1.25rem", borderBottom:"1px solid var(--border)", opacity: deleting === h._id ? 0.4 : 1, transition:"opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:h.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
              {h.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:500, color:"var(--text)" }}>{h.name}</div>
              <div style={{ fontSize:11, color:"var(--text-hint)", marginTop:1 }}>
                {h.category} · {(!h.days || h.days.length === 7) ? "every day" : h.days.map(d => DAYS[d]).join(", ")}
              </div>
            </div>
            <div style={{ width:8, height:8, borderRadius:"50%", background:h.color, flexShrink:0 }} />

            {/* Delete button — shows spinner while deleting this habit */}
            <button onClick={() => remove(h._id)} disabled={!!deleting}
              style={{ fontSize:14, color:"var(--text-hint)", background:"none", border:"none", cursor: deleting ? "wait" : "pointer", padding:"4px 8px", borderRadius:6, transition:"color 0.15s", display:"flex", alignItems:"center" }}
              onMouseEnter={e => { if (!deleting) e.currentTarget.style.color = "#E05555"; }}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-hint)"}
            >
              {deleting === h._id
                ? <svg width="14" height="14" viewBox="0 0 24 24" style={{ animation:"spin 0.7s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" fill="none" stroke="var(--text-hint)" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="var(--text-hint)" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                : "✕"
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}