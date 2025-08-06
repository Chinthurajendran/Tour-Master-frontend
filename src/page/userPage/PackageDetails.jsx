import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Slider from "react-slick"
import place1 from "../../assets/place1.jpg"
import place2 from "../../assets/place2.jpg"
import place3 from "../../assets/place3.jpg"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const dummyPackages = [
  {
    id: "pkg001",
    name: "Kerala to Malaysia",
    sourceCountry: "India",
    sourceCity: "Kochi",
    destinationCountry: "Malaysia",
    destinationCity: "Kuala Lumpur",
    description:
      "Experience the perfect blend of culture, nature, and city life as you travel from the tranquil backwaters of Kerala to the vibrant streets of Kuala Lumpur. This 4-day tour includes guided city tours, cultural performances, and relaxing beachside moments.",
    terms:
      "• Valid passport with minimum 6 months validity required.\n• Package is non-refundable once booked.\n• Includes return airfare, 3-star hotel accommodation, airport transfers, and daily breakfast.\n• Sightseeing as per itinerary with English-speaking guide.\n• Personal expenses and travel insurance not included.",
    amount: 25000,
    photos: [place1, place2, place3, place2, place3],
    schedules: [
      {
        time: "Morning",
        timeRange: "08:00 AM - 11:00 AM",
        title: "Backwater Cruise",
        description:
          "Enjoy a scenic boat cruise through the serene backwaters of Kerala before departure.",
      },
      {
        time: "Evening",
        timeRange: "04:00 PM - 07:00 PM",
        title: "Kuala Lumpur City Tour",
        description:
          "Experience Petronas Towers, street food, and cultural sites on arrival in Malaysia.",
      },
      {
        time: "Night",
        timeRange: "08:00 PM - 10:00 PM",
        title: "Night Market Stroll",
        description:
          "Relax at the night market with local cuisine and entertainment.",
      },
    ],
  },
]

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
}

function PackageDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const pkgID = location.state?.pkgID

  useEffect(() => {
    if (!pkgID) {
      navigate("/")
    } else {
      const pkg = dummyPackages.find((item) => item.id === pkgID)
      setSelected(pkg || dummyPackages[0])
    }
  }, [pkgID, navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setShowEnquiry(false)
  }

  if (!selected) return null

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-blue-700">{selected.name}</h1>
        <p className="text-lg text-gray-600 mt-2">
          {selected.sourceCity}, {selected.sourceCountry} →{" "}
          {selected.destinationCity}, {selected.destinationCountry}
        </p>
      </div>

      <div className="mb-10">
        <Slider {...sliderSettings} aria-label="Package photos">
          {selected.photos.map((photo, index) => (
            <div key={index}>
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-[400px] object-cover rounded-xl shadow-lg mx-auto"
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="grid md:grid-cols-3 gap-10 mb-12">
        <div className="md:col-span-3">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              About this package
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {selected.description}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Terms & Conditions
            </h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              {selected.terms.split("\n").map((term, idx) => (
                <li key={idx}>{term.replace(/^\u2022\s?/, "")}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Schedule Details
            </h3>
            <div className="space-y-4">
              {selected.schedules?.map((schedule, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-blue-600 font-medium">
                      {schedule.time}
                    </span>
                    <span className="text-sm text-gray-500">
                      {schedule.timeRange}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700">
                    {schedule.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {schedule.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border rounded-xl shadow-lg p-6 bg-white max-w-xl mx-auto text-center">
        <h4 className="text-gray-500 text-sm">Starting From</h4>
        <p className="text-3xl font-bold text-blue-700 mt-1 mb-6">
          ₹{selected.amount.toLocaleString()}
        </p>

        <button
          onClick={() => setShowEnquiry(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-medium transition"
        >
          Send Enquiry
        </button>
      </div>

      {/* Enquiry Modal */}
      {showEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
              Send Enquiry
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                required
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="tel"
                name="phone"
                required
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <textarea
                name="message"
                placeholder="Message (Optional)"
                value={form.message}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              ></textarea>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowEnquiry(false)}
                  type="button"
                  className="text-red-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation */}
      {submitted && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600">
              Your enquiry has been submitted. We’ll contact you soon.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PackageDetails
