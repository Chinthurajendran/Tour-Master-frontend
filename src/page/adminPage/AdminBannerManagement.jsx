import React, { useState, useEffect } from "react"
import { Plus, X, Pencil, Trash2, Image as ImageIcon, UploadCloud } from "lucide-react"
import axiosInstance from "../../utils/axiosInstance"
import { toast } from "react-toastify"

const AdminBannerManagement = () => {
  const [banners, setBanners] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editingBannerId, setEditingBannerId] = useState(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await axiosInstance.get("fetch-banner")
      setBanners(res.data.users)
    } catch (err) {
      toast.error("Failed to load banners")
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleAddBanner = async () => {
    if (!imageFile) return toast.error("Please select an image")
    const formData = new FormData()
    formData.append("name", title)
    formData.append("image", imageFile)
    try {
      const res = await axiosInstance.post("upload-banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setBanners((prev) => [...prev, res.data])
      toast.success("Banner uploaded successfully")
      resetForm()
    } catch (err) {
      toast.error("Banner upload failed")
    }
  }

  const handleEditBanner = (banner) => {
    setEditMode(true)
    setEditingBannerId(banner.id)
    setTitle(banner.name)
    setPreviewUrl(`http://127.0.0.1:8000${banner.image}`)
    setShowForm(true)
  }

  const handleUpdateBanner = async () => {
    const formData = new FormData()
    formData.append("name", title)
    if (imageFile) formData.append("image", imageFile)
    try {
      const res = await axiosInstance.put(`update-banner/${editingBannerId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setBanners((prev) =>
        prev.map((b) => (b.id === editingBannerId ? res.data : b))
      )
      toast.success("Banner updated successfully")
      resetForm()
    } catch (err) {
      toast.error("Banner update failed")
    }
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/delete-banner/${id}/`)
      setBanners((prev) => prev.filter((b) => b.id !== id))
      toast.success("Banner deleted")
    } catch (err) {
      toast.error("Failed to delete")
    }
  }

  const resetForm = () => {
    setTitle("")
    setImageFile(null)
    setPreviewUrl(null)
    setShowForm(false)
    setEditMode(false)
    setEditingBannerId(null)
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-lg border-b border-gray-200 p-4 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-blue-600" />
            Banner Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and update homepage banners
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-5 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
      </div>

      {/* Banner Grid */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="group relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
          >
            <img
              src={`http://127.0.0.1:8000${banner.image}`}
              alt="Banner"
              className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {banner.name || "Untitled Banner"}
              </h2>
            </div>
            <div className="absolute top-3 right-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEditBanner(banner)}
                className="bg-white p-2 rounded-full shadow hover:bg-blue-50"
              >
                <Pencil className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                className="bg-white p-2 rounded-full shadow hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-6">
            <button
              onClick={resetForm}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-5 text-gray-800">
              {editMode ? "Edit Banner" : "Add Banner"}
            </h2>

            <input
              type="text"
              placeholder="Banner Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
            />

            <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors mb-4">
              <UploadCloud className="w-6 h-6 text-gray-500 mb-2" />
              <span className="text-sm text-gray-500">Click or drag image here</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 w-full object-cover rounded-lg mb-4 border"
              />
            )}

            <button
              onClick={editMode ? handleUpdateBanner : handleAddBanner}
              className={`${
                editMode
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              } text-white font-medium w-full py-2 rounded-lg shadow-lg transition-all`}
            >
              {editMode ? "Update Banner" : "Upload Banner"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBannerManagement
