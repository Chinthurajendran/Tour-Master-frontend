import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import axiosInstance from "../../utils/axiosInstance"

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: true,
  fade: true,
  cssEase: "ease-out",
}

function PackageDetails() {
  const location = useLocation()
  const { pkgID } = location.state
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeDay, setActiveDay] = useState("1")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  useEffect(() => {
    if (pkgID) {
      fetchBanners()
    } else {
      console.error("No pkgID found in location state")
    }
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axiosInstance.get(`PackageDetails/${pkgID}/`)
      const packageData = res.data.package?.[0]
      setSelected(packageData)
    } catch (err) {
      setError(err.message || "Failed to load package details")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      const res = await axiosInstance.post(`Customerenquire`, form)
    } catch (err) {
      setError(err.response?.data || err.message || "Failed to submit enquiry")
    } finally {
      setLoading(false)
      setSubmitted(true)
      setShowEnquiry(false)
    }
  }

  // Show loading state with modern spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-medium text-gray-700">
            Loading your adventure...
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-red-600 text-xl font-semibold mb-4">
            Oops! Something went wrong
          </div>
          <div className="text-gray-600 mb-6">{error}</div>
          <button
            onClick={() => fetchBanners()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!selected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md">
          <div className="text-6xl mb-4">🏝️</div>
          <div className="text-xl font-semibold text-gray-700 mb-4">
            No package found
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300"
          >
            Explore Packages
          </button>
        </div>
      </div>
    )
  }

  const groupedSchedules =
    selected.schedules?.reduce((acc, schedule) => {
      const day = schedule.day
      if (!acc[day]) acc[day] = []
      acc[day].push(schedule)
      return acc
    }, {}) || {}

  const days = Object.keys(groupedSchedules).sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 relative z-20">
          <div className="text-center mb-8">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
              <span className="text-blue-700 font-medium text-sm">
                ✈️ Premium Experience
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-4 leading-tight">
              {selected.schedule_title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-lg text-gray-700 font-medium">
              <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
                {selected.from_date}
              </span>
              <span className="text-2xl">→</span>
              <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
                {selected.to_date}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Slider */}
      {selected.schedules && selected.schedules.length > 0 && (
        <div className="container mx-auto px-4 mb-16">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm p-2">
            <Slider {...sliderSettings}>
              {selected.schedules
                .flatMap((schedule) => schedule.photos || [])
                .map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`http://127.0.0.1:8000${photo.image}`}
                      alt={`Experience ${index + 1}`}
                      className="w-full h-[500px] object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                  </div>
                ))}
            </Slider>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-4xl">🌟</span>
                About This Adventure
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {selected.tour_package?.description ||
                  "Embark on an unforgettable journey crafted just for you."}
              </p>

              {selected.tour_package?.terms_and_conditions && (
                <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <span>📋</span> Terms & Conditions
                  </h3>
                  <p className="text-blue-800">
                    {selected.tour_package.terms_and_conditions}
                  </p>
                </div>
              )}
            </div>

            {/* Schedule Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <span className="text-4xl">📅</span>
                Your Itinerary
              </h3>

              {/* Day Tabs */}
              {days.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                        activeDay === day
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Day {day}
                    </button>
                  ))}
                </div>
              )}

              {/* Schedule Cards */}
              {Object.entries(groupedSchedules)
                .filter(([day]) => days.length === 1 || day === activeDay)
                .map(([day, daySchedules]) => (
                  <div key={day} className="space-y-6">
                    {days.length === 1 && (
                      <h4 className="text-2xl font-bold text-center text-gray-800 mb-8 bg-gradient-to-r from-blue-100 to-purple-100 py-4 rounded-2xl">
                        Day {day}
                      </h4>
                    )}

                    <div className="grid gap-6">
                      {daySchedules.map((schedule, index) => {
                        const timePeriods = ["Morning", "Evening", "Night"]
                        const timePeriod =
                          timePeriods[index] || `Activity ${index + 1}`
                        const timeIcons = ["🌅", "🌆", "🌙"]
                        const timeIcon = timeIcons[index] || "⭐"

                        return (
                          <div key={schedule.id} className="group relative">
                            {/* Timeline connector */}
                            {index < daySchedules.length - 1 && (
                              <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-blue-300 to-purple-300 z-10"></div>
                            )}

                            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] border border-white/50">
                              <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {timeIcon}
                                  </div>
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold">
                                      {timePeriod}
                                    </span>
                                  </div>

                                  <h5 className="text-xl font-bold text-gray-800 mb-3">
                                    {schedule.title}
                                  </h5>

                                  <p className="text-gray-600 leading-relaxed mb-4">
                                    {schedule.description}
                                  </p>

                                  {schedule.photos &&
                                    schedule.photos.length > 0 && (
                                      <div className="mt-4">
                                        {schedule.photos.length === 1 ? (
                                          <img
                                            src={`http://127.0.0.1:8000${schedule.photos[0].image}`}
                                            alt={schedule.title}
                                            className="w-full h-40 object-cover rounded-2xl shadow-lg"
                                          />
                                        ) : (
                                          <div className="grid grid-cols-3 gap-3">
                                            {schedule.photos.map((photo, k) => (
                                              <img
                                                key={k}
                                                src={`http://127.0.0.1:8000${photo.image}`}
                                                alt={`${schedule.title} ${
                                                  k + 1
                                                }`}
                                                className="w-full h-24 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                                              />
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}

              {!selected.schedules?.length && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🗓️</div>
                  <p className="text-gray-600 text-lg">
                    Itinerary coming soon...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Pricing Card */}
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl border border-white/50 mb-8">
                <div className="text-center">
                  <div className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-2">
                    Starting From
                  </div>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">
                    ₹{parseInt(selected.amount).toLocaleString("en-IN")}
                  </div>
                  <div className="text-sm text-gray-500 mb-8">per person</div>

                  <button
                    onClick={() => setShowEnquiry(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="mr-2">✨</span>
                    Book Your Adventure
                  </button>
                </div>

                {/* Quick Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{days.length} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Group Size:</span>
                      <span className="font-semibold">2-15 People</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  What's Included
                </h4>
                <div className="space-y-3">
                  {[
                    { icon: "🏨", text: "Accommodation" },
                    { icon: "🍽️", text: "All Meals" },
                    { icon: "🚐", text: "Transportation" },
                    { icon: "👨‍🏫", text: "Expert Guide" },
                    { icon: "📸", text: "Photo Sessions" },
                    { icon: "🎫", text: "Entry Tickets" },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <span className="text-xl">{feature.icon}</span>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">✨</div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Let's Plan Your Trip
              </h2>
              <p className="text-gray-600 mt-2">
                We'll get back to you within 24 hours
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Any special requests or questions?"
                  value={form.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300"
                >
                  Send Enquiry
                </button>
                <button
                  onClick={() => setShowEnquiry(false)}
                  type="button"
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-3">
              Thank You!
            </h3>
            <p className="text-gray-600 mb-6">
              Your enquiry has been submitted successfully. Our travel experts
              will contact you within 24 hours to plan your perfect adventure.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300"
            >
              Explore More Packages
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PackageDetails
