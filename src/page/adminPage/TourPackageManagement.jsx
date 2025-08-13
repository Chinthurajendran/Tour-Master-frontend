import React, { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash2, PlaneTakeoff, Upload } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const TourPackageManagement = () => {
  const [countries, setCountries] = useState([]);
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    source: "",
    destination: "",
    description: "",
    terms: "",
    photos: [],
  });

  const [previewPhotos, setPreviewPhotos] = useState([]);

  useEffect(() => {
    fetchCountries();
    fetchPackages();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await axiosInstance.get("fetch-countries");
      setCountries(res.data.country);
    } catch {
      toast.error("Failed to load countries");
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await axiosInstance.get("admin-tourpackages");
      setPackages(res.data.Package);
    } catch {
      toast.error("Failed to load packages");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      source: "",
      destination: "",
      description: "",
      terms: "",
      photos: [],
    });
    setPreviewPhotos([]);
    setIsEditing(false);
    setEditIndex(null);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, photos: files }));
    setPreviewPhotos(files.map((file) => URL.createObjectURL(file)));
  };

  const handleAddOrUpdatePackage = async () => {
    if (!formData.title || !formData.source || !formData.destination) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("packagetitle", formData.title);
    formDataToSend.append("source_country_city", formData.source);
    formDataToSend.append("destination_country_city", formData.destination);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("terms_and_conditions", formData.terms);
    for (let file of formData.photos) {
      formDataToSend.append("photos", file);
    }

    try {
      await axiosInstance.post("Add-TourPackage", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(isEditing ? "Package updated!" : "Package added!");
      setShowForm(false);
      resetForm();
      fetchPackages();
    } catch {
      toast.error("Failed to save package");
    }
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      const updated = packages.filter((_, i) => i !== index);
      setPackages(updated);
    }
  };

  const handleEdit = (index) => {
    const pkg = packages[index];
    setFormData({
      title: pkg.packagetitle,
      source: pkg.source_country_city,
      destination: pkg.destination_country_city,
      description: pkg.description,
      terms: pkg.terms_and_conditions,
      photos: [],
    });
    setPreviewPhotos(pkg.photos.map((p) => `http://127.0.0.1:8000${p.image}`));
    setEditIndex(index);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 p-6 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <PlaneTakeoff className="w-7 h-7 text-blue-600" />
            Tour Packages
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create, edit, and manage travel packages
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition text-white font-medium px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Package
        </button>
      </div>

      {/* Package List */}
      <div className="flex-1 overflow-y-auto p-6">
        {packages.length === 0 ? (
          <p className="text-gray-400 italic text-center mt-10">
            No tour packages added yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-5 border border-gray-100 relative hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(idx)}
                    className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {pkg.packagetitle}
                </h2>
                <p className="text-sm text-gray-600">
                  <strong>From:</strong> {pkg.source_country_city} <br />
                  <strong>To:</strong> {pkg.destination_country_city}
                </p>
                <p className="text-gray-700 mt-3 text-sm leading-relaxed">
                  {pkg.description}
                </p>
                {pkg.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {pkg.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={`http://127.0.0.1:8000${photo.image}`}
                        alt=""
                        className="rounded-lg object-cover h-24 w-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white/90 rounded-2xl shadow-2xl w-full max-w-lg relative p-6 animate-fadeIn">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              {isEditing ? "Edit Package" : "Add New Package"}
            </h2>

            {/* Title */}
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            />

            {/* Country & City */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Source Country
                </label>
                <select
                  value={formData.source.split(" - ")[0] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, source: `${e.target.value} - ` })
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="">Select</option>
                  {countries.map((c, idx) => (
                    <option key={idx} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Source City
                </label>
                <select
                  value={formData.source.split(" - ")[1] || ""}
                  onChange={(e) => {
                    const country = formData.source.split(" - ")[0];
                    setFormData({
                      ...formData,
                      source: `${country} - ${e.target.value}`,
                    });
                  }}
                  className="w-full border px-3 py-2 rounded-lg"
                  disabled={!formData.source}
                >
                  <option value="">Select</option>
                  {countries
                    .find((c) => c.name === formData.source.split(" - ")[0])
                    ?.cities.map((city, idx) => (
                      <option key={idx} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Destination */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Destination Country
                </label>
                <select
                  value={formData.destination.split(" - ")[0] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      destination: `${e.target.value} - `,
                    })
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="">Select</option>
                  {countries.map((c, idx) => (
                    <option key={idx} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Destination City
                </label>
                <select
                  value={formData.destination.split(" - ")[1] || ""}
                  onChange={(e) => {
                    const country = formData.destination.split(" - ")[0];
                    setFormData({
                      ...formData,
                      destination: `${country} - ${e.target.value}`,
                    });
                  }}
                  className="w-full border px-3 py-2 rounded-lg"
                  disabled={!formData.destination}
                >
                  <option value="">Select</option>
                  {countries
                    .find(
                      (c) => c.name === formData.destination.split(" - ")[0]
                    )
                    ?.cities.map((city, idx) => (
                      <option key={idx} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
              rows={3}
            />

            {/* Terms */}
            <label className="block text-sm font-medium mb-1">
              Terms & Conditions
            </label>
            <textarea
              value={formData.terms}
              onChange={(e) =>
                setFormData({ ...formData, terms: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
              rows={2}
            />

            {/* Upload */}
            <label className="block text-sm font-medium mb-1">Photos</label>
            <div className="flex items-center gap-3 mb-4">
              <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {previewPhotos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {previewPhotos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="h-14 w-14 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleAddOrUpdatePackage}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white font-medium py-2 rounded-full"
            >
              {isEditing ? "Update Package" : "Add Package"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourPackageManagement;
