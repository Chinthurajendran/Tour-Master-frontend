import React, { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { FiAlertCircle } from "react-icons/fi"
import { toast } from "react-toastify"

const baseURL = import.meta.env.VITE_API_LOCAL_URL

const OTPVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""))
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)
  const [reloading, setReloading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [resendEnabled, setResendEnabled] = useState(false)
  const [resetTimer, setResetTimer] = useState(false)
  const [email, setEmail] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const inputRefs = useRef([])

  useEffect(() => {
    let storedEmail = localStorage.getItem("email")
    if (!storedEmail) {
      storedEmail = location.state?.email
      
      if (storedEmail) {
        localStorage.setItem("email", storedEmail)
      }
    }
    setEmail(storedEmail)
  }, [location.state?.email])
  console.log(email)

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown)
          setResendEnabled(true)
          setReloading(false)
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(countdown)
  }, [resetTimer])

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const handleOTPChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "")
    if (!value) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      } else if (index > 0) {
        inputRefs.current[index - 1].focus()
      }
    }
  }

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    const fullOtp = otp.join("")
    if (fullOtp.length !== 6) {
      setFormError("Please enter a valid 6-digit OTP.")
      setLoading(false)
      return
    }

    try {
      const res = await axios.post(`${baseURL}/OTPVerification`, {
        email,
        otp: fullOtp,
      })
      if (res.status === 200) {
        toast.success(res.data.message)
        navigate("/SignUpPage")
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
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

  const handleResendOTP = async () => {
    setReloading(true)
    try {
      const res = await axios.post(`${baseURL}/ResendOTPVerification`, { email })
      if (res.status === 200) {
        setEmail(res.data.email)
        toast.success(res.data.message)
        setTimer(60)
        setOtp(Array(6).fill(""))
        setResendEnabled(false)
        setFormError("")
        setResetTimer((prev) => !prev)
      }
    } catch (error) {
      setReloading(false)
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
          <p className="text-sm text-gray-600 mt-2">
            Please enter the 6-digit OTP sent to <strong>{email}</strong>
          </p>
        </div>

        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between gap-2">
            {otp.map((value, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={value}
                onChange={(e) => handleOTPChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-12 border border-gray-300 rounded text-center text-xl text-gray-700 focus:outline-none focus:border-blue-700"
              />
            ))}
          </div>

          <div className="text-center text-sm text-gray-500">
            Time remaining:{" "}
            <span className="font-medium">{formatTime(timer)}</span>
          </div>

          <button
            type="submit"
            disabled={resendEnabled}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-bold ${
              resendEnabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "text-white bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={!resendEnabled}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-bold ${
              resendEnabled
                ? "text-white bg-blue-700 hover:bg-blue-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {reloading ? "Resending..." : "Resend OTP"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Have an account?{" "}
            <Link
              to="/UserLoginPage"
              className="text-blue-700 hover:underline font-semibold"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification
