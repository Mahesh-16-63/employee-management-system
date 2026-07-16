import axios from "axios";

// Use environment variable if available, otherwise use local Flask in development
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://employees-management-system-lrok.onrender.com"
    : "http://localhost:5000");

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