import { useEffect, useState } from "react";
import { getWeekly, getMonthly, getYearly, getBestStreak } from "../api";
import { useStats }   from "../hooks/useStats";
import ChartCard      from "../components/ChartCard";
import WeeklyChart    from "../components/WeeklyChart";
import Heatmap        from "../components/Heatmap";
import YearlyChart    from "../components/YearlyChart";

export default function Stats() {
  const [weekly,       setWeekly]       = useState([]);
  const [monthly,      setMonthly]      = useState([]);
  const [yearly,       setYearly]       = useState([]);
  const [streakData,   setStreakData]   = useState(null);

  const [loadingWeekly,  setLoadingWeekly]  = useState(true);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [loadingYearly,  setLoadingYearly]  = useState(true);
  const [loadingStreak,  setLoadingStreak]  = useState(true);

  const [errorWeekly,  setErrorWeekly]  = useState(false);
  const [errorMonthly, setErrorMonthly] = useState(false);
  const [errorYearly,  setErrorYearly]  = useState(false);

  const { weeklyAvg, monthlyAvg, loading: avgLoading } = useStats();

  useEffect(() => {
    getWeekly()
      .then(r  => setWeekly(r.data))
      .catch(() => setErrorWeekly(true))
      .finally(() => setLoadingWeekly(false));

    getMonthly()
      .then(r  => setMonthly(r.data))
      .catch(() => setErrorMonthly(true))
      .finally(() => setLoadingMonthly(false));

    getYearly()
      .then(r  => setYearly(r.data))
      .catch(() => setErrorYearly(true))
      .finally(() => setLoadingYearly(false));

    getBestStreak()
      .then(r  => setStreakData(r.data))
      .finally(() => setLoadingStreak(false));
  }, []);

  const metricCard = {
    background:   "var(--surface)",
    borderRadius: "var(--radius-sm)",
    padding:      "1rem 1.125rem",
    boxShadow:    "var(--shadow)",
    border:       "1px solid var(--border)",
  };

  const pulse = {
    background:  "var(--surface2)",
    borderRadius: "var(--radius-sm)",
    animation:   "pulse 1.4s ease-in-out infinite",
  };

  return (
    <div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      {/* Summary metric cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:"1rem" }}>

        {/* Weekly avg */}
        <div style={metricCard}>
          <div style={{ fontSize:11, color:"var(--text-hint)", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 }}>Weekly avg</div>
          {avgLoading
            ? <div style={{ ...pulse, height:28, width:"60%", marginBottom:6 }} />
            : <div style={{ fontSize:22, fontWeight:600, color:"var(--text)" }}>{weeklyAvg}%</div>
          }
          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>last 7 days</div>
        </div>

        {/* Monthly avg */}
        <div style={metricCard}>
          <div style={{ fontSize:11, color:"var(--text-hint)", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:6 }}>Monthly avg</div>
          {avgLoading
            ? <div style={{ ...pulse, height:28, width:"60%", marginBottom:6 }} />
            : <div style={{ fontSize:22, fontWeight:600, color:"var(--text)" }}>{monthlyAvg}%</div>
          }
          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>last 30 days</div>
        </div>
      </div>

      {/* Best active streak card */}
      <div style={{ marginBottom:"1rem" }}>
        {loadingStreak ? (
          <div style={{ ...pulse, height:80, borderRadius:"var(--radius)" }} />
        ) : streakData?.best_streak > 0 ? (
          <div style={{
            background:   "var(--green)",
            borderRadius: "var(--radius)",
            padding:      "1rem 1.25rem",
            display:      "flex",
            alignItems:   "center",
            gap:          14,
          }}>
            <div style={{ fontSize:32 }}>{streakData.habit.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:4 }}>
                Best active streak 🔥
              </div>
              <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                <span style={{ fontSize:28, fontWeight:700, color:"#fff" }}>{streakData.best_streak}</span>
                <span style={{ fontSize:14, color:"rgba(255,255,255,0.8)" }}>days in a row</span>
              </div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginTop:2 }}>
                {streakData.habit.name}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background:   "var(--surface)",
            borderRadius: "var(--radius)",
            border:       "1px solid var(--border)",
            padding:      "1rem 1.25rem",
            textAlign:    "center",
            color:        "var(--text-hint)",
            fontSize:     13,
          }}>
            🔥 Complete habits today to start a streak!
          </div>
        )}
      </div>

      {/* Weekly chart */}
      <ChartCard
        title="This week — daily completion %"
        loading={loadingWeekly}
        error={errorWeekly}
      >
        <WeeklyChart data={weekly} />
      </ChartCard>

      {/* Monthly heatmap */}
      <ChartCard
        title="Last 30 days — activity"
        loading={loadingMonthly}
        error={errorMonthly}
      >
        <Heatmap data={monthly} />
      </ChartCard>

      {/* Yearly chart */}
      <ChartCard
        title="This year — monthly average %"
        loading={loadingYearly}
        error={errorYearly}
      >
        <YearlyChart data={yearly} />
      </ChartCard>
    </div>
  );
}