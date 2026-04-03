import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const toColor = pct => pct >= 80 ? "#1D9E75" : pct >= 50 ? "#5DCAA5" : "#888780";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"var(--text)" }}>
      <div style={{ color:"var(--text-muted)", marginBottom:2 }}>{label}</div>
      <div style={{ fontWeight:600 }}>{payload[0].value}% complete</div>
    </div>
  );
};

export default function WeeklyChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={28}>
        <XAxis dataKey="date"
          tickFormatter={d => new Date(d + "T12:00:00").toLocaleDateString("en", { weekday:"short" })}
          tick={{ fontSize:11, fill:"#B0ADA6" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0,100]} tickFormatter={v => `${v}%`}
          tick={{ fontSize:11, fill:"#B0ADA6" }} axisLine={false} tickLine={false} width={36} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(0,0,0,0.04)" }} />
        <Bar dataKey="pct" radius={[4,4,0,0]}>
          {data.map((entry, i) => <Cell key={i} fill={toColor(entry.pct)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}