import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:8, padding:"8px 12px", fontSize:12, color:"var(--text)" }}>
      <div style={{ color:"var(--text-muted)", marginBottom:2 }}>{label}</div>
      <div style={{ fontWeight:600 }}>{payload[0].value}% avg</div>
    </div>
  );
};

export default function YearlyChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="teal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#1D9E75" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={{ fontSize:11, fill:"#B0ADA6" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0,100]} tickFormatter={v => `${v}%`}
          tick={{ fontSize:11, fill:"#B0ADA6" }} axisLine={false} tickLine={false} width={36} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke:"rgba(0,0,0,0.08)" }} />
        <Area type="monotone" dataKey="pct" stroke="#1D9E75" strokeWidth={2}
          fill="url(#teal)" dot={{ fill:"#1D9E75", r:3, strokeWidth:0 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}