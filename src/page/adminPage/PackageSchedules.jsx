import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

const PackageScheduleManagement = () => {
  const packageTitles = [
    "Kerala to Malaysia 4 Days",
    "Japan Adventure Tour",
    "USA Explore 7 Nights",
  ];

  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [amount, setAmount] = useState("");

  const [daySchedules, setDaySchedules] = useState([]);

  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const daysCount = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

      const initialDays = Array.from({ length: daysCount }, (_, i) => ({
        day: i + 1,
        schedules: [],
      }));

      setDaySchedules(initialDays);
    }
  }, [fromDate, toDate]);

  const handleDayScheduleInput = (dayIdx, timeSlot, field, value) => {
    setDaySchedules((prev) => {
      const updated = [...prev];
      const day = updated[dayIdx];

      const existing = day.schedules.find((s) => s.time === timeSlot);
      if (existing) {
        existing[field] = value;
      } else {
        day.schedules.push({ time: timeSlot, [field]: value, photos: [] });
      }

      return updated;
    });
  };

  const handleDaySchedulePhotoUpload = (dayIdx, timeSlot, files) => {
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setDaySchedules((prev) => {
      const updated = [...prev];
      const day = updated[dayIdx];

      const existing = day.schedules.find((s) => s.time === timeSlot);
      if (existing) {
        existing.photos = imageUrls;
      } else {
        day.schedules.push({
          time: timeSlot,
          title: "",
          description: "",
          photos: imageUrls,
        });
      }

      return updated;
    });
  };

  const handleSubmitPackageSchedule = () => {
    if (!selectedPackage || !fromDate || !toDate || !amount || daySchedules.length === 0) return;

    const fullSchedule = {
      packageTitle: selectedPackage,
      fromDate,
      toDate,
      amount,
      days: daySchedules,
    };

    setSchedules([...schedules, fullSchedule]);
    resetAll();
  };

  const resetAll = () => {
    setSelectedPackage("");
    setFromDate("");
    setToDate("");
    setAmount("");
    setDaySchedules([]);
    setShowForm(false);
  };

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

      {schedules.length === 0 ? (
        <p className="text-gray-500">No package schedules added yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((pkg, idx) => (
            <div key={idx} className="border rounded p-4 shadow">
              <h2 className="font-bold text-blue-600 mb-1">{pkg.packageTitle}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Date:</strong> {pkg.fromDate} → {pkg.toDate}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Amount:</strong> ₹{pkg.amount}
              </p>
              {pkg.days.map((day, i) => (
                <div key={i} className="mb-2">
                  <p className="font-semibold text-gray-700">Day {day.day}</p>
                  {day.schedules.map((s, j) => (
                    <div key={j} className="text-sm text-gray-600">
                      {s.time} - {s.title}: {s.description}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Add Package Schedule</h2>

            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            >
              <option value="">Select Package</option>
              {packageTitles.map((pkg, idx) => (
                <option key={idx} value={pkg}>{pkg}</option>
              ))}
            </select>

            <div className="flex gap-3 mb-3">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-1/2 border px-3 py-2 rounded"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-1/2 border px-3 py-2 rounded"
              />
            </div>

            <input
              type="number"
              placeholder="Package Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            {daySchedules.map((dayObj, dayIdx) => (
              <div key={dayIdx} className="mb-6 border rounded p-4">
                <h4 className="text-lg font-semibold mb-2">Day {dayObj.day}</h4>
                {["Morning", "Evening", "Night"].map((slot) => (
                  <div key={slot} className="mb-3">
                    <h5 className="text-sm font-medium text-blue-600">{slot}</h5>
                    <input
                      type="text"
                      placeholder="Title"
                      className="w-full border px-2 py-1 rounded mb-1"
                      onChange={(e) =>
                        handleDayScheduleInput(dayIdx, slot, "title", e.target.value)
                      }
                    />
                    <textarea
                      placeholder="Description"
                      className="w-full border px-2 py-1 rounded mb-1"
                      rows={2}
                      onChange={(e) =>
                        handleDayScheduleInput(dayIdx, slot, "description", e.target.value)
                      }
                    />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        handleDaySchedulePhotoUpload(dayIdx, slot, e.target.files)
                      }
                    />
                  </div>
                ))}
              </div>
            ))}

            <button
              onClick={handleSubmitPackageSchedule}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Save Package Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageScheduleManagement;