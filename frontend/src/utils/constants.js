export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
});

export const ROUTES = Object.freeze({
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  LOGIN: "/login",
  REGISTER: "/register",
});