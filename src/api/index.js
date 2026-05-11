import axios from "axios";
export const getBestStreak = () => api.get("/stats/streak", { params: { today: localToday() } });
const api = axios.create({ baseURL: "https://habitsbackend.onrender.com//api" });
// intercepta cada request para agregar el token automáticamente
api.interceptors.request.use(req => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

api.interceptors.response.use(
  res => res,
  err => {
    // if token expired, log out
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const localToday = () => {
  const d   = new Date();
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Auth
export const register = (data) => api.post("/auth/register", data);
export const login    = (data) => api.post("/auth/login",    data);
export const getMe    = ()     => api.get("/auth/me");

// Habits
export const getHabits   = ()               => api.get("/habits");
export const createHabit = (data)           => api.post("/habits", data);
export const updateHabit = (id, data)       => api.put(`/habits/${id}`, data);
export const deleteHabit = (id)             => api.delete(`/habits/${id}`);

// Logs
export const getLogs   = (date)              => api.get("/logs",  { params: { date } });
export const toggleLog = (habit_id, date, note) => api.post("/logs", { habit_id, date, note });

// Stats
export const getWeekly      = () => api.get("/stats/weekly",  { params: { today: localToday() } });
export const getMonthly     = () => api.get("/stats/monthly", { params: { today: localToday() } });
export const getYearly      = () => api.get("/stats/yearly",  { params: { today: localToday() } });
export const getHabitStats  = (id) => api.get(`/stats/habit/${id}`, { params: { today: localToday() } });