import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach token automatically from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("writedna_token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// Auth
export const registerTeacher = (data) => api.post("/auth/register", data);
export const loginTeacher = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

// Students
export const getDashboard = () => api.get("/dashboard");
export const getStudents = () => api.get("/students");
export const getStudent = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post("/students", data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Submissions
export const getSubmissions = () => api.get("/submissions");
export const getSubmission = (id) => api.get(`/submissions/${id}`);
export const createSubmission = (data) => api.post("/submissions", data);
export const deleteSubmission = (id) => api.delete(`/submissions/${id}`);

export default api;
