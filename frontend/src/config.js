// export const BASE_URL = "https://task-b1w0.onrender.com"
// export const BASE_URL = "172.20.10.3:5000"
// export const BASE_URL = "172.20.10.3:5000"

// config.js
export const BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000"
  : "https://task-b1w0.onrender.com";

