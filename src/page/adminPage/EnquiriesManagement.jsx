import React, { useEffect, useState } from "react"
import { Mail, Phone, FileText, MessageCircle } from "lucide-react"
import axiosInstance from "../../utils/axiosInstance"

const EnquiriesManagement = () => {
  const [enquiries, setEnquiries] = useState([])

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      const response = await axiosInstance.get(`CustomerenquireView`)
      setEnquiries(response.data.customerdata)
    } catch (error) {
      console.error("Error fetching enquiries:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-br from-gray-50 to-blue-50 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Enquiries Management
          </h1>
        </div>
        <p className="text-gray-500 text-sm">
          Track and respond to customer enquiries quickly and efficiently.
        </p>
      </div>

      {/* Enquiries Grid */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {enquiries.length > 0 ? (
          enquiries.map((enquiry, idx) => (
            <div
              key={enquiry.id || idx}
              className="group relative bg-white/80 backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl p-5 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              {/* Name */}
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                {enquiry.name}
              </h2>

              {/* Email */}
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <a
                  href={`mailto:${enquiry.email}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {enquiry.email}
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 text-green-500" />
                <span className="text-gray-700 text-sm">{enquiry.phone}</span>
              </div>

              {/* Message */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500 uppercase">
                    Message
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{enquiry.message}</p>
              </div>

              {/* Hover Accent Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300 transition-all duration-300 pointer-events-none"></div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 italic py-10">
            No enquiries yet.
          </div>
        )}
      </div>
    </div>
  )
}

export default EnquiriesManagement
