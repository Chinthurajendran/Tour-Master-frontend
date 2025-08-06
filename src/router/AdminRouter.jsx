import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminHome from "../page/adminPage/AdminHome"
import AdminUser from "../page/adminPage/AdminUser"
import CountriesCitiesPage from "../page/adminPage/CountriesCitiesPage"
import EnquiriesManagement from "../page/adminPage/EnquiriesManagement"
import TourPackageManagement from "../page/adminPage/TourPackageManagement"
import PackageSchedules from "../page/adminPage/PackageSchedules"
import AdminBannerManagement from "../page/adminPage/AdminBannerManagement"

function AdminRouter() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/AdminHome" element={<AdminHome />}>
            <Route path="AdminUser" element={<AdminUser />} />
            <Route
              path="AdminBannerManagement"
              element={<AdminBannerManagement />}
            />
            <Route
              path="CountriesCitiesPage"
              element={<CountriesCitiesPage />}
            />
            <Route
              path="TourPackageManagement"
              element={<TourPackageManagement />}
            />
            <Route path="PackageSchedules" element={<PackageSchedules />} />
            <Route
              path="EnquiriesManagement"
              element={<EnquiriesManagement />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AdminRouter
