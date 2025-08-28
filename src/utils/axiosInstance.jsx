import axios from "axios"
import { toast } from "react-toastify"
import store from "../store/store"
import { logout } from "../store/slices/userAuthentication"
import { admin_login } from "../store/slices/adminAuthentication"
import { admin_logout } from "../store/slices/adminAuthentication"
import { clearUserTokens } from "../store/slices/UserToken"
import { setUserTokens } from "../store/slices/UserToken"
import { setAdminTokens } from "../store/slices/AdminToken"
import { clearAdminTokens } from "../store/slices/AdminToken"

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
      store.getState().userToken.user_access_token ||
      store.getState().adminToken.admin_access_token
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
  // (response) => response, // success: pass the response
  (response) => {
    return response
  },

  async (error) => {
    const originalRequest = error.config
    const Authenticated =
      store.getState().userAuth.isAuthenticated ||
      store.getState().adminAuth.isAuthenticated_admin

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
          store.getState().userToken.user_refresh_token ||
          store.getState().adminToken.admin_refresh_token
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }
        const { data } = await axios.post(
          `${baseURL}/user_refresh_token`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
            withCredentials: true,
          }
        )

        // Save new access token in store

        const role =
          store.getState().userAuth?.user_role ||
          store.getState().adminAuth?.admin_role

        if (role === "user") {
          // Normal user login
          store.dispatch(
            setUserTokens({
              user_access_token: data.access_token,
              user_refresh_token: refreshToken,
            })
          )
        } else if (role === "admin") {
          // Admin login
          store.dispatch(
            setAdminTokens({
              admin_access_token: data.access_token,
              admin_refresh_token: refreshToken,
            })
          )
        } else {
          console.error("Unexpected role:", role)
        }

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error("❌ Refresh Token Expired or Invalid")

        store.dispatch(logout())
        store.dispatch(admin_logout())
        store.dispatch(clearUserTokens())
        store.dispatch(clearAdminTokens())
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
