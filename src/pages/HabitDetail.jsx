import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHabitStats } from "../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

const HEATMAP_COLORS = ["#F1EFE8","#C8EAD9","#5DCAA5","#1D9E75","#0F6E56"];

export default function HabitDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    getHabitStats(id).then(r => setData(r.data));
  }, [id]);

  if (!data) return (
    <div style={{ textAlign:"center", padding:"4rem 1rem", color:"var(--text-hint)", fontSize:14 }}>
      Loading...
    </div>
  );

  const { habit, current_streak, longest_streak, total_done, heatmap, weekly, recent_notes } = data;

  // parte heatmap en filas de 7
  const hmRows = [];
  for (let i = 0; i < heatmap.length; i += 7) hmRows.push(heatmap.slice(i, i + 7));

  // weekly bar data
  const weeklyBars = weekly
    .filter(d => d.scheduled)
    .map(d => ({
      date: d.date,
      pct:  d.done ? 100 : 0,
    }));

  const card = {
    background:"var(--surface)", borderRadius:"var(--radius)",
    boxShadow:"var(--shadow)", border:"1px solid var(--border)",
    padding:"1.25rem", marginBottom:"1rem",
  };

  const sectionTitle = {
    fontSize:11, fontWeight:600, letterSpacing:"0.07em",
    textTransform:"uppercase", color:"var(--text-hint)", marginBottom:"1rem",
  };

  return (
    <div>
      {/* Back button */}
      <button onClick={() => navigate(-1)} style={{
        background:"none", border:"none", cursor:"pointer",
        color:"var(--text-muted)", fontSize:13, padding:"0 0 1rem",
        fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:6,
      }}>
        ← Back
      </button>

      {/* Header */}
      <div className="fade-up" style={{ display:"flex", alignItems:"center", gap:14, marginBottom:"1.5rem" }}>
        <div style={{
          width:56, height:56, borderRadius:14, fontSize:26,
          background: habit.color + "22",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          {habit.icon}
        </div>
        <div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"var(--text)", lineHeight:1.2 }}>
            {habit.name}
          </h2>
          <div style={{ fontSize:12, color:"var(--text-hint)", marginTop:3 }}>
            {habit.category} · {(!habit.days || habit.days.length === 7) ? "every day" : habit.days.map(d => ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][d]).join(", ")}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="fade-up-1" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:"1rem" }}>
        {[
          { label:"Current streak", value:`${current_streak}d`, sub:"🔥" },
          { label:"Longest streak", value:`${longest_streak}d`, sub:"🏆" },
          { label:"Total done",     value:total_done,           sub:"✓"  },
        ].map(({ label, value, sub }) => (
          <div key={label} style={{
            background:"var(--surface)", borderRadius:"var(--radius-sm)",
            padding:"0.875rem 1rem", boxShadow:"var(--shadow)", border:"1px solid var(--border)",
            textAlign:"center",
          }}>
            <div style={{ fontSize:18, marginBottom:4 }}>{sub}</div>
            <div style={{ fontSize:20, fontWeight:600, color:"var(--text)" }}>{value}</div>
            <div style={{ fontSize:10, color:"var(--text-hint)", marginTop:2, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Weekly bar chart */}
      <div className="fade-up-2" style={card}>
        <div style={sectionTitle}>This week</div>
        {weeklyBars.length > 0 ? (
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weeklyBars} barSize={28}>
              <XAxis dataKey="date"
                tickFormatter={d => new Date(d + "T12:00:00").toLocaleDateString("en", { weekday:"short" })}
                tick={{ fontSize:11, fill:"#B0ADA6" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0,100]} tickFormatter={v => `${v}%`}
                tick={{ fontSize:11, fill:"#B0ADA6" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip formatter={v => [`${v}%`, "Done"]} cursor={{ fill:"rgba(0,0,0,0.04)" }} />
              <Bar dataKey="pct" radius={[4,4,0,0]}>
                {weeklyBars.map((entry, i) => (
                  <Cell key={i} fill={entry.pct === 100 ? "var(--green)" : "#D5D3CC"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ fontSize:13, color:"var(--text-hint)", textAlign:"center", padding:"1rem 0" }}>
            Not scheduled this week
          </p>
        )}
      </div>

      {/* 30-day heatmap */}
      <div className="fade-up-3" style={card}>
        <div style={sectionTitle}>Last 30 days</div>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          {hmRows.map((row, ri) => (
            <div key={ri} style={{ display:"flex", gap:5 }}>
              {row.map((cell, ci) => (
                <div key={ci}
                  title={cell.date}
                  style={{
                    flex:1, aspectRatio:1, borderRadius:5, cursor:"default",
                    background: cell.done ? habit.color : "var(--surface2)",
                    transition:"transform 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              ))}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:10, fontSize:11, color:"var(--text-hint)" }}>
          <div style={{ width:12, height:12, borderRadius:3, background:"var(--surface2)" }} />
          <span>Missed</span>
          <div style={{ width:12, height:12, borderRadius:3, background:habit.color, marginLeft:8 }} />
          <span>Done</span>
        </div>
      </div>

      {/* Recent notes */}
      {recent_notes.length > 0 && (
        <div className="fade-up-4" style={card}>
          <div style={sectionTitle}>Recent notes</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {recent_notes.map((n, i) => (
              <div key={i} style={{
                background:   "var(--bg)",
                borderRadius: "var(--radius-sm)",
                padding:      "10px 14px",
                borderLeft:   `3px solid ${habit.color}`,
              }}>
                <div style={{ fontSize:11, color:"var(--text-hint)", marginBottom:4 }}>{n.date}</div>
                <div style={{ fontSize:14, color:"var(--text)" }}>{n.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}