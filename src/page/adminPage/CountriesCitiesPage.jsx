import React, { useEffect, useState } from "react"
import { Globe2, Plus, X, Pencil, Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import axiosInstance from "../../utils/axiosInstance"

const CountryCityManagement = () => {
  const [countries, setCountries] = useState([])
  const [newCountry, setNewCountry] = useState("")
  const [cityInputs, setCityInputs] = useState([""])
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editCountryId, setEditCountryId] = useState(null)

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      const res = await axiosInstance.get("fetch-countries")
      setCountries(res.data.country)
    } catch {
      toast.error("Failed to load countries")
    }
  }

  const openAddForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (country) => {
    setNewCountry(country.name)
    setEditCountryId(country.id)
    setCityInputs(country.cities.map((c) => c.name))
    setIsEditing(true)
    setShowForm(true)
  }

  const resetForm = () => {
    setNewCountry("")
    setCityInputs([""])
    setIsEditing(false)
    setEditCountryId(null)
    setShowForm(false)
  }

  const handleAddCityField = () => {
    setCityInputs([...cityInputs, ""])
  }

  const handleCityChange = (index, value) => {
    const updated = [...cityInputs]
    updated[index] = value
    setCityInputs(updated)
  }

  const handleSubmit = async () => {
    const trimmedCountry = newCountry.trim()
    const filteredCities = cityInputs.filter((c) => c.trim() !== "").map((name) => ({ name }))

    if (!trimmedCountry) return toast.error("Country name is required")

    const payload = { name: trimmedCountry, cities: filteredCities }

    try {
      if (isEditing && editCountryId) {
        await axiosInstance.put(`update-countries/${editCountryId}/`, payload)
        toast.success("Country updated successfully")
      } else {
        await axiosInstance.post("adding-countries", payload)
        toast.success("Country & cities added successfully!")
      }
      fetchCountries()
      resetForm()
    } catch {
      toast.error("Operation failed")
    }
  }

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`delete-countries/${id}/`)
      fetchCountries()
      toast.success("Deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg p-6 shadow-md border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
              <Globe2 className="w-9 h-9 text-blue-600" />
              Country & City Manager
            </h1>
            <p className="text-gray-500 mt-1">Manage countries and their cities in style.</p>
          </div>
          <button
            onClick={openAddForm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Country
          </button>
        </div>
      </div>

      {/* Countries List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country) => (
            <div
              key={country.id}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{country.name}</h3>
                  <p className="text-sm text-gray-500">
                    {country.cities.length} {country.cities.length === 1 ? "city" : "cities"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openEditForm(country)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(country.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <ul className="space-y-1 text-gray-700 text-sm">
                {country.cities.length > 0 ? (
                  country.cities.map((city, idx) => <li key={idx} className="pl-2">• {city.name}</li>)
                ) : (
                  <li className="italic text-gray-400">No cities added</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-5 text-gray-800">
              {isEditing ? "Edit Country" : "Add New Country"}
            </h2>

            <input
              type="text"
              placeholder="Country name"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <h3 className="text-gray-700 font-semibold mb-2">Cities</h3>
            {cityInputs.map((city, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`City ${idx + 1}`}
                value={city}
                onChange={(e) => handleCityChange(idx, e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-xl mb-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
            ))}

            <button
              onClick={handleAddCityField}
              className="text-blue-600 hover:underline text-sm mt-1 mb-4"
            >
              + Add another city
            </button>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition-all"
            >
              {isEditing ? "Update Country" : "Add Country"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CountryCityManagement
