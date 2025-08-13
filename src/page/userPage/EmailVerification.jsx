import React, { useState } from "react"
import.meta.env
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FiAlertCircle } from "react-icons/fi"

const baseURL = import.meta.env.VITE_API_LOCAL_URL

function EmailVerification() {
  const [formError, setFormError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    setIsSubmitted(true)
    e.preventDefault()

    try {
      const res = await axios.post(`${baseURL}/verify-email`, formData)
      if (res.status == 200) {
        navigate("/OTPVerification", {
          state: {
            email: formData.email,
          },
        })
        toast.success(res.data.message)
        return res
      }
    } catch (error) {
      setIsSubmitted(false)

      if (error.response && error.response.data) {
        const detail = error.response.data.detail
        if (Array.isArray(detail)) {
          setFormError(detail.map((err) => err.msg).join(", "))
        } else if (typeof detail === "string") {
          setFormError(detail)
        } else {
          setFormError("An unexpected error occurred. Please try again.")
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Verify Your Email
        </h2>
        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formError}
          </div>
        )}

        {!isSubmitted ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blue-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value.toLowerCase(),
                  })
                }
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Send Verification Email
            </button>
          </form>
        ) : (
          <div className="text-center text-blue-700">
            <p className="mb-4">
              A verification email has been sent to{" "}
              <strong>{formData.email}</strong>.
            </p>
            <p>Please check your inbox to verify your email address.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailVerification
