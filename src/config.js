const API_URL = process.env.REACT_APP_API_URL || "https://url-shortener-xndv.onrender.com";
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || (typeof window !== "undefined" ? window.location.origin : "https://shorturl0.netlify.app");

export { API_URL, FRONTEND_URL };
