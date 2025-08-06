import React, { useState } from "react";
import { Plus, X, Image, PlaneTakeoff } from "lucide-react";

const TourPackageManagement = () => {
  const countryData = [
    { name: "India", cities: ["Delhi", "Mumbai", "Kolkata"] },
    { name: "USA", cities: ["New York", "Los Angeles", "Chicago"] },
    { name: "France", cities: ["Paris", "Lyon", "Marseille"] },
    { name: "Japan", cities: ["Tokyo", "Kyoto", "Osaka"] },
    { name: "Australia", cities: ["Sydney", "Melbourne", "Brisbane"] },
  ];

  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [terms, setTerms] = useState("");
  const [photos, setPhotos] = useState([]);

  const [selectedSourceCountry, setSelectedSourceCountry] = useState("");
  const [selectedSourceCity, setSelectedSourceCity] = useState("");
//   const [selectedDestCountry, setSelectedDestCountry] = useState("");
//   const [selectedDestCity, setSelectedDestCity] = useState("");

  const handleAddPackage = () => {
    if (!title.trim()) return;

    const newPackage = {
      title,
      source: `${selectedSourceCity}, ${selectedSourceCountry}`,
    //   destination: `${selectedDestCity}, ${selectedDestCountry}`,
      description,
      terms,
      photos,
    };

    setPackages([...packages, newPackage]);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setSelectedSourceCountry("");
    setSelectedSourceCity("");
    // setSelectedDestCountry("");
    // setSelectedDestCity("");
    setDescription("");
    setTerms("");
    setPhotos([]);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setPhotos(imageUrls);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 z-20 bg-gray-50 p-6 shadow flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <PlaneTakeoff className="w-6 h-6 text-blue-600" />
            Tour Packages
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage travel packages with ease</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Package
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {packages.length === 0 ? (
          <p className="text-gray-400 italic text-center mt-10">No tour packages added yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{pkg.title}</h2>
                <p className="text-sm text-gray-600">
                  <strong>Country:</strong> {pkg.source} <br />
                  <strong>City:</strong> {pkg.destination}
                </p>
                <p className="text-gray-700 mt-2 text-sm">
                  <strong>Description:</strong> {pkg.description}
                </p>
                <p className="text-gray-700 mt-2 text-sm">
                  <strong>Terms:</strong> {pkg.terms}
                </p>
                {pkg.photos.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {pkg.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt={`Package ${i}`}
                        className="rounded object-cover h-24 w-full"
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
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold mb-5 text-gray-800">Add New Package</h2>

            <input
              type="text"
              placeholder="Package Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-3"
            />

            <select
              value={selectedSourceCountry}
              onChange={(e) => {
                setSelectedSourceCountry(e.target.value);
                setSelectedSourceCity("");
              }}
              className="w-full border px-4 py-2 rounded mb-3"
            >
              <option value="">Select Source Country</option>
              {countryData.map((c, idx) => (
                <option key={idx} value={c.name}>{c.name}</option>
              ))}
            </select>

            <select
              value={selectedSourceCity}
              onChange={(e) => setSelectedSourceCity(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-3"
              disabled={!selectedSourceCountry}
            >
              <option value="">Select Source City</option>
              {countryData.find(c => c.name === selectedSourceCountry)?.cities.map((city, idx) => (
                <option key={idx} value={city}>{city}</option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-3"
              rows={3}
            />
            <textarea
              placeholder="Terms and Conditions"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-3"
              rows={2}
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
              onClick={handleAddPackage}
              className="bg-green-600 hover:bg-green-700 text-white font-medium w-full py-2 rounded"
            >
              Add Package
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourPackageManagement;