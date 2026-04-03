import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(req => {
  console.log(`[API] ${req.method.toUpperCase()} ${req.baseURL}${req.url}`, req.data ?? "");
  return req;
});

api.interceptors.response.use(
  res  => { console.log(`[API] ✓ ${res.status}`, res.data); return res; },
  err  => { console.error(`[API] ✗`, err.response?.status, err.response?.data ?? err.message); return Promise.reject(err); }
);

// Build date from local year/month/day — never affected by UTC offset
export const localToday = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const getHabits   = ()               => api.get("/habits");
export const createHabit = (data)           => api.post("/habits", data);
export const updateHabit = (id, data)       => api.put(`/habits/${id}`, data);
export const deleteHabit = (id)             => api.delete(`/habits/${id}`);

export const getLogs     = (date)           => api.get("/logs",          { params: { date } });
export const toggleLog   = (habit_id, date) => api.post("/logs",         { habit_id, date });

export const getWeekly   = ()               => api.get("/stats/weekly",  { params: { today: localToday() } });
export const getMonthly  = ()               => api.get("/stats/monthly", { params: { today: localToday() } });
export const getYearly   = ()               => api.get("/stats/yearly",  { params: { today: localToday() } });