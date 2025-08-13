import React, { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"
import axiosInstance from "../../utils/axiosInstance"
import { toast } from "react-toastify"

const PackageScheduleManagement = () => {
  const [packages, setPackages] = useState([])
  const [packageslist, setPackageslist] = useState([])
  const [daySchedules, setDaySchedules] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [amount, setAmount] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [skipEffect, setSkipEffect] = useState(false)


  // Helper to generate unique IDs for schedules
  const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9)

  useEffect(() => {
    fetchPackages()
    fetchPackageslist()
  }, [isEditing])

  const fetchPackages = async () => {
    try {
      const res = await axiosInstance.get("PackageSchedulesview")
      setPackages(res.data.package)
      console.log(res.data.package)
    } catch (err) {
      toast.error("Failed to load packages")
    }
  }

    const fetchPackageslist = async () => {
    try {
      const res = await axiosInstance.get("admin-tourpackages")
      setPackageslist(res.data.Package)
    } catch (err) {
      toast.error("Failed to load packages")
    }
  }

  useEffect(() => {
    if (skipEffect) {
      setSkipEffect(false)
      return
    }

    if (fromDate && toDate) {
      const start = new Date(fromDate)
      const end = new Date(toDate)
      const daysCount = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1

      const initialDays = Array.from({ length: daysCount }, (_, i) => ({
        day: i + 1,
        schedules: [],
      }))

      setDaySchedules(initialDays)
    }
  }, [fromDate, toDate])

  const handleDayScheduleInput = (dayIdx, timeSlot, field, value) => {
    setDaySchedules((prev) => {
      const updated = [...prev]
      const day = updated[dayIdx]

      const existing = day.schedules.find((s) => s.time === timeSlot)
      if (existing) {
        existing[field] = value
      } else {
        day.schedules.push({
          id: generateId(),
          time: timeSlot,
          [field]: value,
          photos: [],
        })
      }

      return updated
    })
  }

  const handleDaySchedulePhotoUpload = (dayIdx, timeSlot, files) => {
    const fileArray = Array.from(files)

    setDaySchedules((prev) => {
      const updated = [...prev]
      const day = updated[dayIdx]

      const existing = day.schedules.find((s) => s.time === timeSlot)
      if (existing) {
        existing.photoFiles = fileArray // for upload later
      } else {
        day.schedules.push({
          id: generateId(),
          time: timeSlot,
          title: "",
          description: "",
          photoFiles: fileArray,
        })
      }

      return updated
    })
  }

  const groupSchedulesByDay = (schedules) => {
    const grouped = schedules.reduce((acc, sched) => {
      const dayKey = sched.day
      if (!acc[dayKey]) acc[dayKey] = { day: dayKey, schedules: [] }
      acc[dayKey].schedules.push(sched)
      return acc
    }, {})

    return Object.values(grouped)
  }

  const handleSubmitPackageSchedule = async () => {
    if (
      !selectedPackage ||
      !fromDate ||
      !toDate ||
      !amount ||
      daySchedules.length === 0
    ) {
      toast.error("Please fill all fields.")
      return
    }

    const formData = new FormData()

    formData.append("package", selectedPackage)
    formData.append("from_date", fromDate)
    formData.append("to_date", toDate)
    formData.append("amount", amount)

    // Send schedules as JSON string but remove File objects
    const schedulesWithoutFiles = daySchedules.map((day) => ({
      day: day.day,
      schedules: day.schedules.map(({ photoFiles, photos, ...rest }) => rest),
    }))

    formData.append("schedules", JSON.stringify(schedulesWithoutFiles))

    // Append actual photo files with unique keys
    daySchedules.forEach((day, dayIdx) => {
      day.schedules.forEach((schedule, schedIdx) => {
        if (schedule.photoFiles && schedule.photoFiles.length > 0) {
          schedule.photoFiles.forEach((file, fileIdx) => {
            const scheduleId = schedule.id || schedIdx
            formData.append(scheduleId, file)
          })
        }
      })
    })

    console.log(formData)
    try {
      await axiosInstance.post("PackageSchedulesadd", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      toast.success("Package schedule saved!")
      resetAll()
      fetchPackages() // refresh list
    } catch (error) {
      console.error(error)
      toast.error("Failed to save schedule.")
    }
  }

  const resetAll = () => {
    setSelectedPackage("")
    setFromDate("")
    setToDate("")
    setAmount("")
    setDaySchedules([])
    setShowForm(false)
    setIsEditing(false)
    setEditingIndex(null)
    setSkipEffect(false)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Package Schedules</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="inline-block mr-1" /> Add Schedule
        </button>
      </div>

      {packages.length === 0 ? (
        <p className="text-gray-500">No package schedules added yet.</p>
      ) : (
        <div className="grid gap-8">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-8 lg:flex lg:gap-8">
                {/* Package Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-extrabold text-blue-800 mb-3">
                    {pkg.schedule_title ||
                      pkg.packagetitle ||
                      "Untitled Package"}
                  </h2>

                  <div className="text-gray-600 text-sm mb-2">
                    <span className="font-semibold">Date:</span> {pkg.from_date}{" "}
                    → {pkg.to_date}
                  </div>
                  <div className="text-gray-600 text-sm mb-6">
                    <span className="font-semibold">Amount:</span> ₹{pkg.amount}
                  </div>

                  {/* Daily Schedules */}
                  <div className="space-y-6">
                    {groupSchedulesByDay(pkg.schedules || []).map((day, i) => (
                      <div key={i}>
                        <h4 className="text-xl font-semibold text-gray-800 mb-3">
                          🗓️ Day {day.day}
                        </h4>

                        <div className="grid sm:grid-cols-2 gap-6">
                          {day.schedules.map((s) => (
                            <div
                              key={s.id}
                              className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100"
                            >
                              <div className="font-semibold text-blue-700 mb-1">
                                {s.time || "Time"} —{" "}
                                <span className="text-gray-900">{s.title}</span>
                              </div>
                              <p className="text-gray-700 text-sm">
                                {s.description}
                              </p>

                              {/* Photos */}
                              {s.photos?.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-3">
                                  {s.photos.map((photo, photoIdx) => (
                                    <img
                                      key={photoIdx}
                                      src={`http://127.0.0.1:8000${photo.image}`}
                                      alt="Schedule Photo"
                                      className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

{showForm && (
  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-y-auto max-h-[90vh] animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={resetAll}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Header */}
      <div className="px-6 pt-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? "Edit Package Schedule" : "Add Package Schedule"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to {isEditing ? "update" : "create"} a package schedule.
        </p>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        {/* Package Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Package
          </label>
          <select
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Package --</option>
            {packageslist.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.packagetitle}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Package Amount
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Day Schedules */}
        {daySchedules.map((dayObj, dayIdx) => (
          <div key={dayIdx} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">
              Day {dayObj.day}
            </h4>
            <div className="grid gap-4">
              {["Morning", "Evening", "Night"].map((slot) => {
                const schedule =
                  dayObj.schedules.find((s) => s.time === slot) || {}
                return (
                  <div key={schedule.id || slot} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h5 className="text-sm font-semibold text-blue-600 mb-2">
                      {slot}
                    </h5>

                    <input
                      type="text"
                      placeholder="Title"
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) =>
                        handleDayScheduleInput(dayIdx, slot, "title", e.target.value)
                      }
                      value={schedule.title || ""}
                    />

                    <textarea
                      placeholder="Description"
                      rows={2}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) =>
                        handleDayScheduleInput(dayIdx, slot, "description", e.target.value)
                      }
                      value={schedule.description || ""}
                    />

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      onChange={(e) =>
                        handleDaySchedulePhotoUpload(dayIdx, slot, e.target.files)
                      }
                    />

                    {schedule.photos && schedule.photos.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {schedule.photos.map((photo, photoIdx) => (
                          <img
                            key={photoIdx}
                            src={photo}
                            alt="Uploaded"
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <button
          onClick={handleSubmitPackageSchedule}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all"
        >
          {isEditing ? "Update Package Schedule" : "Save Package Schedule"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

export default PackageScheduleManagement
