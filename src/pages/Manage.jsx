import { useState, useEffect } from "react";
import { getHabits, createHabit, deleteHabit } from "../api";

const COLORS = ["#1D9E75","#378ADD","#D4537E","#D85A30","#BA7517","#534AB7"];
const ICONS  = ["⭐","🏃","📚","🧘","💧","🍎","✍️","🎯","💪","🌙","⚽","📖","🪥"];
const DAYS   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function Manage() {
  const [habits, setHabits] = useState([]);
  const [form,   setForm]   = useState({
    name:"", icon:"⭐", color:COLORS[0], category:"general", days:[0,1,2,3,4,5,6],
  });

  const load = () => getHabits().then(r => setHabits(r.data));
  useEffect(() => { load(); }, []);

  const toggleDay = (i) => {
    setForm(f => {
      const next = f.days.includes(i) ? f.days.filter(d => d !== i) : [...f.days, i].sort();
      return { ...f, days: next.length ? next : f.days };
    });
  };

  const add = async () => {
    if (!form.name.trim()) return;
    await createHabit(form);
    setForm({ name:"", icon:"⭐", color:COLORS[0], category:"general", days:[0,1,2,3,4,5,6] });
    load();
  };

  const remove = async (id) => {
    await deleteHabit(id);
    load();
  };

  const inputStyle = {
    width:"100%", marginBottom:12,
    border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)",
    padding:"10px 14px", fontFamily:"'DM Sans',sans-serif", fontSize:14,
    background:"var(--bg)", color:"var(--text)", outline:"none", display:"block",
  };

  return (
    <div>
      {/* Add card */}
      <div style={{ background:"var(--surface)", borderRadius:"var(--radius)", boxShadow:"var(--shadow)", border:"1px solid var(--border)", padding:"1.25rem", marginBottom:"1rem" }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--text-hint)", marginBottom:"1rem" }}>
          New habit
        </div>

        <input style={inputStyle} placeholder="Habit name..."
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          onFocus={e => e.target.style.borderColor = "var(--green)"}
          onBlur={e  => e.target.style.borderColor = "var(--border)"}
        />

        {/* Icons */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
          {ICONS.map(icon => (
            <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))} style={{
              fontSize:16, padding:6, borderRadius:8, border:"none", cursor:"pointer",
              background:  form.icon === icon ? "var(--surface2)" : "transparent",
              transform:   form.icon === icon ? "scale(1.2)" : "scale(1)",
              transition:  "all 0.15s",
            }}>{icon}</button>
          ))}
        </div>

        {/* Colors */}
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          {COLORS.map(c => (
            <button key={c} onClick={() => setForm(f => ({ ...f, color:c }))} style={{
              width:28, height:28, borderRadius:"50%", background:c, border:"none", cursor:"pointer",
              transform:    form.color === c ? "scale(1.25)" : "scale(1)",
              outline:      form.color === c ? `2px solid ${c}` : "none",
              outlineOffset: 2, transition:"transform 0.15s",
            }} />
          ))}
        </div>

        {/* Category */}
        <select style={{ ...inputStyle, cursor:"pointer" }}
          value={form.category} onChange={e => setForm(f => ({ ...f, category:e.target.value }))}>
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
                <button key={i} onClick={() => toggleDay(i)} style={{
                  flex:1, padding:"7px 0", borderRadius:8, cursor:"pointer",
                  border:      `1.5px solid ${active ? "var(--green)" : "var(--border)"}`,
                  background:  active ? "var(--green)" : "var(--bg)",
                  color:       active ? "#fff" : "var(--text-muted)",
                  fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
                  transition:  "all 0.15s",
                }}>{day}</button>
              );
            })}
          </div>
        </div>

        <button onClick={add} style={{
          width:"100%", background:"var(--green)", color:"#fff", border:"none",
          borderRadius:"var(--radius-sm)", padding:"11px",
          fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:"pointer",
        }}>
          Add habit
        </button>
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
            style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 1.25rem", borderBottom:"1px solid var(--border)" }}
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
            <button onClick={() => remove(h._id)}
              style={{ fontSize:14, color:"var(--text-hint)", background:"none", border:"none", cursor:"pointer", padding:"4px 8px", borderRadius:6, transition:"color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#E05555"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-hint)"}
            >✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}