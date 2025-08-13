import axios from "axios"
import { toast } from "react-toastify"
import store from "../store/store"
import { admin_logout } from "../store/slices/AdminToken"
import { logout } from "../store/slices/UserToken"
import { login } from "../store/slices/UserToken"
import { admin_login } from "../store/slices/AdminToken"

const baseURL = import.meta.env.VITE_API_LOCAL_URL

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: `${baseURL}`, // e.g., http://localhost:8000/auth
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies if needed
})

// ────────────────────────────────────────────────────────────
// ✅ Request Interceptor
// Attach access token to Authorization header
// ────────────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      store.getState().userAuth.user_access_token ||
       store.getState().adminAuth.admin_access_token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ────────────────────────────────────────────────────────────
// ✅ Response Interceptor
// Handle token expiration and retry logic
// ────────────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response, // success: pass the response
  async (error) => {
    const originalRequest = error.config
    const Authenticated =
      store.getState().userAuth.isAuthenticated ||
      store.getState().adminAuth.isAuthenticated_admin;
      
    // Handle no server response (network issues)
    if (!error.response) {
      console.error("⚠️ Network Error or No Response from Server")
      toast.error("Network Error. Please check your connection.")
      return Promise.reject(error)
    }

    // ─── 401 Unauthorized → Try refresh token ───────────────
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken =
          store.getState().userAuth.user_refresh_token ||
          store.getState().adminAuth.admin_refresh_token
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        // const { data } = await axios.post(
        //   `${baseURL}/user_refresh_token`,
        //   {},
        //   {
        //     headers: {
        //       Authorization: `Bearer ${refreshToken}`,
        //     },
        //     withCredentials: true,
        //   }
        // )

        const { data } = await axios.post(
          `${baseURL}user_refresh_token/`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
            withCredentials: true,
          }
        )

        // Save new access token in store
        store.dispatch(
          login({
            user_access_token: data.access_token,
            user_refresh_token: refreshToken,
          })
        )

        store.dispatch(
          admin_login({
            admin_access_token: data.access_token,
            admin_refresh_token: refreshToken,
          })
        )

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error("❌ Refresh Token Expired or Invalid")
        store.dispatch(logout())
        store.dispatch(admin_logout())
        window.location.assign("/UserLoginPage")
        return Promise.reject(refreshError)
      }
    }

    // ─── 403 Forbidden ──────────────────────────────────────
    if (error.response.status === 403) {
      toast.error("Permission Denied!")
      console.warn("🚫 403 Forbidden")
    }

    // ─── 404 Not Found ──────────────────────────────────────
    else if (error.response.status === 404) {
      console.warn("🔍 404 Not Found")
    }

    // ─── 5xx Server Errors ──────────────────────────────────
    else if (error.response.status >= 500) {
      console.error("💥 Server Error")
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
