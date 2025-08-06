import React, { useState } from "react";
import { Calendar, Clock, Plus, X, Pencil, Trash2 } from "lucide-react";

const PackageScheduleManagement = () => {
  const packageTitles = [
    "Kerala to Malaysia 4 Days",
    "Japan Adventure Tour",
    "USA Explore 7 Nights",
  ];

  const scheduleTimes = ["Morning", "Evening", "Night"];

  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);

  const [editingIndex, setEditingIndex] = useState(null);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setPhotos(imageUrls);
  };

  const handleAddSchedule = () => {
    if (!selectedPackage || !selectedTime) return;

    const newSchedule = {
      packageTitle: selectedPackage,
      scheduleTime: selectedTime,
      fromDate,
      toDate,
      amount,
      description,
      photos,
    };

    if (editingIndex !== null) {
      const updatedSchedules = [...schedules];
      updatedSchedules[editingIndex] = newSchedule;
      setSchedules(updatedSchedules);
      setEditingIndex(null);
    } else {
      setSchedules([...schedules, newSchedule]);
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setSelectedPackage("");
    setSelectedTime("");
    setFromDate("");
    setToDate("");
    setAmount("");
    setDescription("");
    setPhotos([]);
  };

  const handleEdit = (index) => {
    const schedule = schedules[index];
    setSelectedPackage(schedule.packageTitle);
    setSelectedTime(schedule.scheduleTime);
    setFromDate(schedule.fromDate);
    setToDate(schedule.toDate);
    setAmount(schedule.amount);
    setDescription(schedule.description);
    setPhotos(schedule.photos);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const filtered = schedules.filter((_, idx) => idx !== index);
    setSchedules(filtered);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
        
      <div className="sticky top-0 z-20 bg-gray-50 p-6 shadow flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Package Schedules
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage schedules for each package</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Schedule
        </button>
      </div>
      

      <div className="flex-1 overflow-y-auto p-6">
        {schedules.length === 0 ? (
          <p className="text-gray-400 italic text-center mt-10">No schedules added yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((sch, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow border relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => handleEdit(idx)} className="text-blue-600 hover:text-blue-800">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(idx)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-lg font-bold text-blue-700 mb-1">{sch.packageTitle}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Schedule:</strong> {sch.scheduleTime}<br />
                  <strong>Dates:</strong> {sch.fromDate} → {sch.toDate}<br />
                  <strong>Amount:</strong> ₹{sch.amount}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Description:</strong> {sch.description}
                </p>
                {sch.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {sch.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt="Schedule"
                        className="rounded object-cover h-20 w-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingIndex(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
              {editingIndex !== null ? "Edit Schedule" : "Add New Schedule"}
            </h2>

            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-3"
            >
              <option value="">Select Package</option>
              {packageTitles.map((pkg, idx) => (
                <option key={idx} value={pkg}>
                  {pkg}
                </option>
              ))}
            </select>

            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-3"
            >
              <option value="">Select Schedule Time</option>
              {scheduleTimes.map((time, idx) => (
                <option key={idx} value={time}>
                  {time}
                </option>
              ))}
            </select>

            <div className="flex gap-3 mb-3">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-1/2 border px-4 py-2 rounded"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-1/2 border px-4 py-2 rounded"
              />
            </div>

            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-3"
            />

            <textarea
              placeholder="Schedule Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-3"
              rows={3}
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Upload Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="mb-4"
            />

            <button
              onClick={handleAddSchedule}
              className="bg-green-600 hover:bg-green-700 text-white font-medium w-full py-2 rounded"
            >
              {editingIndex !== null ? "Update Schedule" : "Add Schedule"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageScheduleManagement;