import { useState, useEffect, useCallback } from "react";
import { getWeekly, getMonthly } from "../api";

export function useStats() {
  const [weeklyAvg,  setWeeklyAvg]  = useState(null);
  const [monthlyAvg, setMonthlyAvg] = useState(null);
  const [loading,    setLoading]    = useState(true);

  const fetchStats = useCallback(() => {
    setLoading(true);
    Promise.all([getWeekly(), getMonthly()]).then(([w, m]) => {
      const weekly  = w.data;
      const monthly = m.data;

      const weeklyDays = weekly.filter(d => d.total > 0);
      const avgWeekly  = weeklyDays.length
        ? Math.round(weeklyDays.reduce((sum, d) => sum + d.pct, 0) / weeklyDays.length)
        : 0;

      const monthlyDays = monthly.filter(d => d.total > 0);
      const avgMonthly  = monthlyDays.length
        ? Math.round(monthlyDays.reduce((sum, d) => sum + d.pct, 0) / monthlyDays.length)
        : 0;

      setWeeklyAvg(avgWeekly);
      setMonthlyAvg(avgMonthly);
      setLoading(false);
    });
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { weeklyAvg, monthlyAvg, loading, refetch: fetchStats };
}