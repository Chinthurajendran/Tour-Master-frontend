import React, { useState } from "react"
import { UserCircle } from "lucide-react"
import locationLogo from "../../assets/location.png"
import { useSelector } from "react-redux"
import axiosInstance from "../../utils/axiosInstance"
import { logout } from "../../store/slices/UserToken"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"

const UserHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.userAuth.isAuthenticated)

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.put(`user_logout`)
      if (res.status === 200) {
        dispatch(logout())
        navigate("/UserLoginPage")
        toast.success(res.data.message)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const detail = error.response.data.detail
        if (Array.isArray(detail)) {
          toast.error(detail.map((err) => err.msg).join(", "))
        } else if (typeof detail === "string") {
          toast.error(detail)
        } else {
          toast.error("Logout failed. Please try again.")
        }
      } else {
        toast.error("Logout failed. Please try again.")
      }
    }
  }

  const handleLogin = async () => {}

  return (
    <header className="sticky top-0 z-30 bg-white shadow-md p-5 flex justify-between items-center">
      {/* Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 p-2 rounded-full shadow-sm animate-wiggle">
          <img
            src={locationLogo}
            alt="Tour Master Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Tour Master
          </h1>
          <p className="text-sm text-gray-500">
            Your journey begins here – 2025
          </p>
        </div>
      </div>

      {/* User Info & Auth Buttons */}
      <div className="flex items-center gap-4">
        {/* Welcome Text */}
        <span className="text-sm font-semibold text-gray-700 tracking-wide">
          {isAuthenticated ? "Welcome back, Explorer" : "Hello, Guest"}
        </span>

        {/* Auth Button */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-md transition-all duration-300"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-md transition-all duration-300"
          >
            Login
          </button>
        )}
      </div>
    </header>
  )
}

export default UserHeader
