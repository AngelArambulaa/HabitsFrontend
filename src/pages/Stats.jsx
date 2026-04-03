import { useEffect, useState } from "react";
import { getWeekly, getMonthly, getYearly } from "../api";
import { useStats } from "../hooks/useStats";
import WeeklyChart from "../components/WeeklyChart";
import Heatmap     from "../components/Heatmap";
import YearlyChart from "../components/YearlyChart";

const card = {
  background:"var(--surface)", borderRadius:"var(--radius)",
  boxShadow:"var(--shadow)", padding:"1.25rem",
  marginBottom:"1rem", border:"1px solid var(--border)",
};

const sectionTitle = {
  fontSize:11, fontWeight:600, letterSpacing:"0.07em",
  textTransform:"uppercase", color:"var(--text-hint)", marginBottom:"1rem",
};

export default function Stats() {
  const [weekly,  setWeekly]  = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly,  setYearly]  = useState([]);
  const { weeklyAvg, monthlyAvg, loading } = useStats();

  useEffect(() => {
    getWeekly().then(r  => setWeekly(r.data));
    getMonthly().then(r => setMonthly(r.data));
    getYearly().then(r  => setYearly(r.data));
  }, []);

  const metricCard = {
    background:"var(--surface)", borderRadius:"var(--radius-sm)",
    padding:"1rem 1.125rem", boxShadow:"var(--shadow)", border:"1px solid var(--border)",
  };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:"1rem" }}>
        <div style={metricCard}>
          <div style={{ fontSize:11, color:"var(--text-hint)", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 }}>Weekly avg</div>
          <div style={{ fontSize:22, fontWeight:600, color:"var(--text)" }}>{loading ? "—" : `${weeklyAvg}%`}</div>
          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>last 7 days</div>
        </div>
        <div style={metricCard}>
          <div style={{ fontSize:11, color:"var(--text-hint)", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 }}>Monthly avg</div>
          <div style={{ fontSize:22, fontWeight:600, color:"var(--text)" }}>{loading ? "—" : `${monthlyAvg}%`}</div>
          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>last 30 days</div>
        </div>
      </div>

      <div style={card}>
        <div style={sectionTitle}>This week — daily completion %</div>
        <WeeklyChart data={weekly} />
      </div>

      <div style={card}>
        <div style={sectionTitle}>Last 30 days — activity</div>
        <Heatmap data={monthly} />
      </div>

      <div style={card}>
        <div style={sectionTitle}>This year — monthly average %</div>
        <YearlyChart data={yearly} />
      </div>
    </div>
  );
}