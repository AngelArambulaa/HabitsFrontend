import { useState, useEffect } from "react";
import { useStats } from "../hooks/useStats";

import { getHabits, getLogs, toggleLog, localToday } from "../api";
const today = localToday();

const CIRC       = 2 * Math.PI * 30;
const DAY_JS     = new Date().getDay();
const todayIndex = DAY_JS === 0 ? 6 : DAY_JS - 1;

const ICON_BG = {
  "🏃":"#E8F5EE","📚":"#EAF1FB","🧘":"#FBF0EA",
  "🍎":"#FBF5EA","✍️":"#F5EAF5","⭐":"#FEFAEA",
  "💧":"#EAF5FB","🎯":"#FBEAEA","💪":"#F5EBF5","🌙":"#EEEAF5",
  "⚽":"#F5EAF5","🪥":"#EAF1FB",
};

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function Today() {
  const [habits, setHabits] = useState([]);
  const [done,   setDone]   = useState(new Set());
  const { weeklyAvg, loading, refetch } = useStats();

  useEffect(() => {
    Promise.all([getHabits(), getLogs(today)]).then(([h, l]) => {
      const scheduled = h.data.filter(habit =>
        (habit.days ?? [0,1,2,3,4,5,6]).includes(todayIndex)
      );
      setHabits(scheduled);
      setDone(new Set(l.data.map(log => log.habit_id)));
    });
  }, []);

  const toggle = async (id) => {
    await toggleLog(id, today);
    setDone(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    refetch();
  };

  const doneCount = done.size;
  const total     = habits.length;
  const pct       = total ? Math.round(doneCount / total * 100) : 0;
  const offset    = CIRC - (CIRC * pct / 100);
  const remaining = total - doneCount;

  const message = pct === 100 ? "All done! Amazing work 🎉"
    : pct >= 60 ? "Keep going, almost there!"
    : pct > 0   ? "Great start, keep it up!"
    : "Let's get started!";

  const card = {
    background:"var(--surface)", borderRadius:"var(--radius-sm)",
    padding:"1rem 1.125rem", boxShadow:"var(--shadow)", border:"1px solid var(--border)",
  };

  return (
    <div>
      {/* Ring card */}
      <div className="fade-up-2" style={{
        background:"var(--green)", borderRadius:"var(--radius)",
        padding:"1.5rem", display:"flex", alignItems:"center",
        gap:"1.5rem", marginBottom:"1rem",
      }}>
        <div style={{ position:"relative", width:72, height:72, flexShrink:0 }}>
          <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform:"rotate(-90deg)" }}>
            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6"/>
            <circle cx="36" cy="36" r="30" fill="none" stroke="#fff" strokeWidth="6"
              strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset}
              style={{ transition:"stroke-dashoffset 0.8s ease" }} />
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:600, color:"#fff" }}>
            {doneCount}/{total}
          </div>
        </div>
        <div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:"#fff", marginBottom:4 }}>{message}</h2>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>
            {remaining > 0 ? `${remaining} habit${remaining > 1 ? "s" : ""} left today` : "You completed everything!"}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="fade-up-3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:"1rem" }}>
        <div style={card}>
          <div style={{ fontSize:11, color:"var(--text-hint)", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 }}>Completion</div>
          <div style={{ fontSize:22, fontWeight:600, color:"var(--text)" }}>{pct}%</div>
          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>today</div>
        </div>
        <div style={card}>
          <div style={{ fontSize:11, color:"var(--text-hint)", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 }}>This week</div>
          <div style={{ fontSize:22, fontWeight:600, color:"var(--text)" }}>{loading ? "—" : `${weeklyAvg}%`}</div>
          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>avg completion</div>
        </div>
      </div>

      {/* Habit list */}
      <div className="fade-up-4" style={{ background:"var(--surface)", borderRadius:"var(--radius)", boxShadow:"var(--shadow)", border:"1px solid var(--border)", overflow:"hidden" }}>
        <div style={{ padding:"1.125rem 1.25rem 0.75rem", borderBottom:"1px solid var(--border)", fontSize:11, fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase", color:"var(--text-hint)" }}>
          Today's habits
        </div>

        {habits.length === 0 && (
          <p style={{ textAlign:"center", padding:"3rem 1rem", fontSize:14, color:"var(--text-hint)" }}>
            No habits scheduled for today!
          </p>
        )}

        {habits.map(h => (
          <div key={h._id} onClick={() => toggle(h._id)}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 1.25rem", borderBottom:"1px solid var(--border)", cursor:"pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background: ICON_BG[h.icon] || "#F0EDE6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
              {h.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:500, color: done.has(h._id) ? "var(--text-hint)" : "var(--text)", textDecoration: done.has(h._id) ? "line-through" : "none", transition:"all 0.2s" }}>
                {h.name}
              </div>
              <div style={{ fontSize:11, color:"var(--text-hint)", marginTop:1 }}>
                {h.category} · {(!h.days || h.days.length === 7) ? "every day" : h.days.map(d => DAYS[d]).join(", ")}
              </div>
            </div>
            <div style={{
              width:30, height:30, borderRadius:"50%", flexShrink:0,
              border: done.has(h._id) ? "none" : "1.5px solid var(--text-hint)",
              background: done.has(h._id) ? "var(--green)" : "none",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, color:"#fff",
              transform: done.has(h._id) ? "scale(1.1)" : "scale(1)",
              transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              {done.has(h._id) ? "✓" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}