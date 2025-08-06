import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import UserHome from "../page/userPage/UserHome"
import PackageDetails from "../page/userPage/PackageDetails"


function UserRouter() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/PackageDetails" element={<PackageDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default UserRouter
