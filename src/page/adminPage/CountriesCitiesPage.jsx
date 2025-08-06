import React, { useState } from "react";
import { Globe2, Plus, X, Pencil, Trash2 } from "lucide-react";

const CountryCityManagement = () => {
  const [countries, setCountries] = useState([
    { name: "India", cities: ["Delhi", "Mumbai", "Kolkata"] },
    { name: "USA", cities: ["New York", "Los Angeles", "Chicago"] },
  ]);

  const [newCountry, setNewCountry] = useState("");
  const [cityInputs, setCityInputs] = useState([""]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const openAddForm = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewCountry("");
    setCityInputs([""]);
  };

  const openEditForm = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setShowForm(true);
    setNewCountry(countries[index].name);
    setCityInputs([...countries[index].cities]);
  };

  const handleAddCityField = () => {
    setCityInputs([...cityInputs, ""]);
  };

  const handleCityChange = (index, value) => {
    const updated = [...cityInputs];
    updated[index] = value;
    setCityInputs(updated);
  };

  const handleSubmit = () => {
    const filteredCities = cityInputs.filter((city) => city.trim() !== "");
    const entry = { name: newCountry.trim(), cities: filteredCities };

    if (!entry.name) return;

    if (isEditing && editIndex !== null) {
      const updated = [...countries];
      updated[editIndex] = entry;
      setCountries(updated);
    } else {
      setCountries([...countries, entry]);
    }

    setNewCountry("");
    setCityInputs([""]);
    setShowForm(false);
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      const updated = countries.filter((_, i) => i !== index);
      setCountries(updated);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-gray-50 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-2">
              <Globe2 className="w-8 h-8 text-blue-600" />
              Country & City Manager
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Efficiently manage countries and their cities.
            </p>
          </div>
          <button
            onClick={openAddForm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg flex items-center gap-2 shadow"
          >
            <Plus className="w-5 h-5" />
            Add Country
          </button>
        </div>
      </div>

      {/* Scrollable Content (scrollbar only appears when needed) */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-5 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {country.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {country.cities.length} city
                    {country.cities.length !== 1 && "ies"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(index)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                {country.cities.length > 0 ? (
                  country.cities.map((city, idx) => <li key={idx}>{city}</li>)
                ) : (
                  <li className="italic text-gray-400">No cities added</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
              {isEditing ? "Edit Country" : "Add New Country"}
            </h2>

            <input
              type="text"
              placeholder="Country name"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <h3 className="text-gray-700 font-medium mb-2">Cities</h3>
            {cityInputs.map((city, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`City ${idx + 1}`}
                value={city}
                onChange={(e) => handleCityChange(idx, e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
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
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg mt-2 transition-all"
            >
              {isEditing ? "Update Country" : "Add Country"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryCityManagement;
