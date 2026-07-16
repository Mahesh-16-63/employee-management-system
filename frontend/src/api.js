import axios from "axios";

// In development, talk directly to the local Flask server.
// In production (Vercel), use a relative "/api" path — vercel.json rewrites
// /api/* to the backend service, so this avoids hardcoding a URL and avoids
// CORS entirely since both live on the same domain.
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000");

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Employee endpoints
export const getEmployees = () => api.get("/employees");
export const addEmployee = (employeeData) => api.post("/employees", employeeData);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Review endpoints
export const saveReview = (reviewData) => api.post("/reviews", reviewData);
export const getReviews = (employeeId) => api.get(`/reviews/${employeeId}`);

export default api;
