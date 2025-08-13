import React, { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"


function UserBody() {
  const [banners, setBanners] = useState([])
  const [packages, setPackages] = useState([])
  const [currentBanner, setCurrentBanner] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    fetchBanners()
    fetchPackages()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await axiosInstance.get("fetch-banner")
      setBanners(res.data.users)
    } catch (err) {
      toast.error("Failed to load banners")
    }
  }

  const fetchPackages = async () => {
    try {
      const res = await axiosInstance.get("admin-tourpackages")
      setPackages(res.data.Package)
    } catch (err) {
      toast.error("Failed to load packages")
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [banners])

  const handlePrev = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const handleNext = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const handleCardClick = (id) => {
    navigate(`/PackageDetails`, { state: { pkgID: id } })
  }

  return (
    <main className="w-full bg-gray-50 min-h-screen">
      {/* Banner Carousel */}
      <section className="relative w-full h-64 sm:h-[500px] overflow-hidden group">
        {banners.length > 0 && (
          <img
            src={`http://127.0.0.1:8000${banners[currentBanner].image}`}
            alt={`Banner ${currentBanner + 1}`}
            className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          />
        )}

        {/* Slide Controls */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center px-4 transform -translate-y-1/2">
          <button
            onClick={handlePrev}
            className="bg-black/40 hover:bg-black/70 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="bg-black/40 hover:bg-black/70 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx === currentBanner ? "bg-white" : "bg-white/40"
              } transition-all duration-300`}
            />
          ))}
        </div>
      </section>

      {/* Tour Packages */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-tight">
          ✈️ Explore Our Best Tour Packages – 2025
        </h2>

        {packages.length === 0 ? (
          <p className="text-center text-gray-500">
            No packages available at the moment.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(pkg.id)}
                className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border overflow-hidden"
              >
                {pkg?.photos?.length > 0 && (
                  <img
                    src={`http://127.0.0.1:8000${pkg.photos[0].image}`}
                    alt={pkg.packagetitle || "Package Image"}
                    className="w-full h-52 object-cover"
                  />
                )}

                <div className="p-5">
                  <h3 className="text-xl font-bold text-blue-700 mb-2">
                    {pkg.packagetitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {pkg.description}
                  </p>
                  {/* <p className="text-gray-900 font-semibold text-lg">
                    ₹{pkg.amount.toLocaleString()}
                  </p> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default UserBody
