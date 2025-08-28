import React, { useState, useEffect } from "react"
import { Plus, X, CalendarDays, Pencil, Trash2 } from "lucide-react"
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

  const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9)

  useEffect(() => {
    fetchPackages()
    fetchPackageslist()
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await axiosInstance.get("PackageSchedulesview")
      setPackages(res.data.package)
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
        existing.photoFiles = fileArray
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

  const handleEditSchedule = (pkg) => {
    setIsEditing(true)
    setEditingIndex(pkg.id)
    setShowForm(true)
    setSelectedPackage(pkg.package_id || "")
    setFromDate(pkg.from_date)
    setToDate(pkg.to_date)
    setAmount(pkg.amount)
    const grouped = groupSchedulesByDay(pkg.schedules || [])
    const formatted = grouped.map((day) => ({
      day: day.day,
      schedules: day.schedules.map((s) => ({
        id: s.id || generateId(),
        time: s.time,
        title: s.title,
        description: s.description,
        photos: s.photos || [],
      })),
    }))
    setDaySchedules(formatted)
  }

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return
    try {
      await axiosInstance.delete(`PackageSchedulesdelete/${id}`)
      toast.success("Package schedule deleted!")
      fetchPackages()
    } catch (err) {
      toast.error("Failed to delete schedule.")
    }
  }

  const handleSubmitPackageSchedule = async () => {
    if (!selectedPackage || !fromDate || !toDate || !amount || daySchedules.length === 0) {
      toast.error("Please fill all fields.")
      return
    }
    const formData = new FormData()
    formData.append("package", selectedPackage)
    formData.append("from_date", fromDate)
    formData.append("to_date", toDate)
    formData.append("amount", amount)
    const schedulesWithoutFiles = daySchedules.map((day) => ({
      day: day.day,
      schedules: day.schedules.map(({ photoFiles, photos, ...rest }) => rest),
    }))
    formData.append("schedules", JSON.stringify(schedulesWithoutFiles))
    daySchedules.forEach((day) => {
      day.schedules.forEach((schedule, schedIdx) => {
        if (schedule.photoFiles && schedule.photoFiles.length > 0) {
          schedule.photoFiles.forEach((file) => {
            const scheduleId = schedule.id || schedIdx
            formData.append(scheduleId, file)
          })
        }
      })
    })

    try {
      if (isEditing && editingIndex) {
        await axiosInstance.put(`PackageSchedulesupdate/${editingIndex}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Package schedule updated!")
      } else {
        await axiosInstance.post("PackageSchedulesadd", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Package schedule saved!")
      }
      resetAll()
      fetchPackages()
    } catch (error) {
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
<div className="flex flex-col bg-gradient-to-br text-black">
  <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg p-6 mb-7 shadow-md border-b border-gray-200">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <h1 className="text-4xl font-extrabold text-black flex items-center gap-3">
          <CalendarDays className="w-9 h-9 text-blue-600" />
          Package Schedules
        </h1>
        <p className="text-black mt-1">
          Manage and organize package schedules with ease.
        </p>
      </div>
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all"
      >
        <Plus className="w-5 h-5" />
        Add Schedule
      </button>
    </div>
  </div>

  {packages.length === 0 ? (
    <p className="text-black">No package schedules added yet.</p>
  ) : (
    <div className="grid gap-8">
      {packages.map((pkg, idx) => (
        <div
          key={idx}
          className="rounded-3xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
          <div className="p-8 lg:flex lg:gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-blue-800 mb-3">
                {pkg.schedule_title || pkg.packagetitle || "Untitled Package"}
              </h2>
              <div className="text-black text-sm mb-2">
                <span className="font-semibold">Date:</span> {pkg.from_date} → {pkg.to_date}
              </div>
              <div className="text-black text-sm mb-6">
                <span className="font-semibold">Amount:</span> ₹{pkg.amount}
              </div>
              <div className="space-y-6">
                {groupSchedulesByDay(pkg.schedules || []).map((day, i) => (
                  <div key={i}>
                    <h4 className="text-xl font-semibold text-black mb-3">
                      🗓️ Day {day.day}
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {day.schedules.map((s) => (
                        <div
                          key={s.id}
                          className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100"
                        >
                          <div className="font-semibold text-blue-700 mb-1">
                            {s.time || "Time"} — <span className="text-black">{s.title}</span>
                          </div>
                          <p className="text-black text-sm">{s.description}</p>
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

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleEditSchedule(pkg)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteSchedule(pkg.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

  {showForm && (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-y-auto max-h-[90vh] animate-fadeIn text-black">
        <button
          onClick={resetAll}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="px-6 pt-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-black">
            {isEditing ? "Edit Package Schedule" : "Add Package Schedule"}
          </h2>
          <p className="text-sm text-black mt-1">
            Fill in the details below to {isEditing ? "update" : "create"} a package schedule.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Select Package
            </label>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">-- Select Package --</option>
              {packageslist.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.packagetitle}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Package Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-gray-500"
            />
          </div>
          {daySchedules.map((dayObj, dayIdx) => (
            <div
              key={dayIdx}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50"
            >
              <h4 className="text-lg font-semibold text-black mb-4">
                Day {dayObj.day}
              </h4>
              <div className="grid gap-4">
                {["Morning", "Evening", "Night"].map((slot) => {
                  const schedule = dayObj.schedules.find((s) => s.time === slot) || {}
                  return (
                    <div
                      key={schedule.id || slot}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <h5 className="text-sm font-semibold text-blue-600 mb-2">{slot}</h5>
                      <input
                        type="text"
                        placeholder="Title"
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-gray-500"
                        onChange={(e) =>
                          handleDayScheduleInput(dayIdx, slot, "title", e.target.value)
                        }
                        value={schedule.title || ""}
                      />
                      <textarea
                        placeholder="Description"
                        rows={2}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-gray-500"
                        onChange={(e) =>
                          handleDayScheduleInput(dayIdx, slot, "description", e.target.value)
                        }
                        value={schedule.description || ""}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="block w-full text-sm text-black file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        onChange={(e) =>
                          handleDaySchedulePhotoUpload(dayIdx, slot, e.target.files)
                        }
                      />
                      {schedule.photos && schedule.photos.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {schedule.photos.map((photo, photoIdx) => (
                            <img
                              key={photoIdx}
                              src={`http://127.0.0.1:8000${photo.image}`}
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
