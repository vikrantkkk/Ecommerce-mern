import axios from "axios";

async function refreshToken() {
  try {
    await axios.post(
      "http://localhost:5000/api/v1/auth/refresh-token",
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await refreshToken();
        const originalRequest = error.config;
        return api(originalRequest);
      } catch (error) {
        console.log("Error in token refresh retry:", error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
