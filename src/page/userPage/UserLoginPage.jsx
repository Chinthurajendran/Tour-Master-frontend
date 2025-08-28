import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi"
import { jwtDecode } from "jwt-decode"
import { login } from "../../store/slices/userAuthentication"
import { setUserTokens } from "../../store/slices/UserToken"
import { admin_login } from "../../store/slices/adminAuthentication"
import { setAdminTokens } from "../../store/slices/AdminToken"
import.meta.env

const baseURL = import.meta.env.VITE_API_LOCAL_URL

function UserLoginPage() {
  const [formError, setFormError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authState = useSelector((state) => state.userAuth.isAuthenticated)
  const admin_authenticated = useSelector(
    (state) => state.adminAuth.isAuthenticated_admin
  )

  useEffect(() => {
    if (admin_authenticated) {
      navigate("/AdminHome/AdminUser")
    } else if (authState) {
      navigate("/")
    } else {
      navigate("/UserLoginPage")
    }
  }, [authState, admin_authenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${baseURL}/LoginView`, formData)
      if (res.status === 200) {
        if (res.data.user_role === "user") {
          const decodedToken = jwtDecode(res.data.user_access_token)
          dispatch(
            login({
              userid: decodedToken.user_id,
              username: res.data.user_name,
              user_role: res.data.user_role,
              useremail: formData.email,
              isAuthenticated: true,
            })
          )
          dispatch(
            setUserTokens({
              user_access_token: res.data.user_access_token,
              user_refresh_token: res.data.user_refresh_token,
            })
          )
          navigate("/")
          toast.success(res.data.message)
        } else if (res.data.admin_role === "admin") {
          const decodedToken = jwtDecode(res.data.admin_access_token)
          dispatch(
            admin_login({
              admin_username: res.data.admin_username,
              admin_role: res.data.admin_role,
              isAuthenticated_admin: true,
            })
          )
          dispatch(
            setAdminTokens({
              admin_access_token: res.data.admin_access_token,
              admin_refresh_token: res.data.admin_refresh_token,
            })
          )
          navigate("/AdminHome/AdminUser")
          toast.success(res.data.message)
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const detail = error.response.data.detail
        if (Array.isArray(detail)) {
          setFormError(detail.map((err) => err.msg).join(", "))
        } else if (typeof detail === "string") {
          setFormError(detail)
        } else {
          setFormError("Something went wrong. Please try again.")
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Login to Your Account
        </h2>
        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value.toLowerCase(),
                })
              }
              placeholder="example@mail.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/EmailVerification"
            className="text-blue-700 hover:underline"
          >
            Become a Member
          </Link>
        </p>
      </div>
    </div>
  )
}

export default UserLoginPage
