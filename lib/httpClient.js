import axios from "axios";

// Base URL for the accounts/auth API. The token-refresh endpoint always
// lives here, regardless of which client (auth, blog, reviews) triggered
// the 401 in the first place.
export const AUTH_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.0.120:8000/api/auth";

/**
 * Builds an axios instance that:
 *  - attaches the JWT access token to every request
 *  - on a 401, transparently refreshes the access token once and replays
 *    the original request (a single shared refresh lock is used across
 *    every client built from this factory, so parallel 401s don't each
 *    trigger their own refresh call)
 */
export function createClient(baseURL) {
  const client = axios.create({ baseURL });

  client.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        typeof window !== "undefined"
      ) {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          return Promise.reject(error);
        }

        if (sharedRefreshState.isRefreshing) {
          return new Promise((resolve, reject) => {
            sharedRefreshState.queue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          });
        }

        originalRequest._retry = true;
        sharedRefreshState.isRefreshing = true;

        try {
          const { data } = await axios.post(`${AUTH_API_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem("access_token", data.access);
          processQueue(null, data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          sharedRefreshState.isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

const sharedRefreshState = { isRefreshing: false, queue: [] };

function processQueue(error, token = null) {
  sharedRefreshState.queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  sharedRefreshState.queue = [];
}
