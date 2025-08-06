import React, { useState } from "react"
import { Plus, X, Pencil, Trash2, Image as ImageIcon } from "lucide-react"

const AdminBannerManagement = () => {
  const [banners, setBanners] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [image, setImage] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
    }
  }

  const handleAddOrUpdateBanner = () => {
    if (!image) return

    const newBanner = { title, image }

    if (editingIndex !== null) {
      const updated = [...banners]
      updated[editingIndex] = newBanner
      setBanners(updated)
      setEditingIndex(null)
    } else {
      setBanners([...banners, newBanner])
    }

    resetForm()
    setShowForm(false)
  }

  const resetForm = () => {
    setTitle("")
    setImage(null)
  }

  const handleEdit = (index) => {
    const banner = banners[index]
    setTitle(banner.title)
    setImage(banner.image)
    setEditingIndex(index)
    setShowForm(true)
  }

  const handleDelete = (index) => {
    setBanners(banners.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50 p-4 shadow flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-600" />
            Banner Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage homepage banners here</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
      </div>

      {/* Banner List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-lg overflow-hidden relative"
          >
            <img
              src={banner.image}
              alt="Banner"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {banner.title || "Untitled Banner"}
              </h2>
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleEdit(idx)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(idx)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => {
                setShowForm(false)
                setEditingIndex(null)
                resetForm()
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingIndex !== null ? "Edit Banner" : "Add Banner"}
            </h2>

            <input
              type="text"
              placeholder="Banner Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4"
            />

            {image && (
              <img
                src={image}
                alt="Preview"
                className="h-32 w-full object-cover rounded mb-4"
              />
            )}

            <button
              onClick={handleAddOrUpdateBanner}
              className="bg-green-600 hover:bg-green-700 text-white font-medium w-full py-2 rounded"
            >
              {editingIndex !== null ? "Update Banner" : "Add Banner"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBannerManagement
