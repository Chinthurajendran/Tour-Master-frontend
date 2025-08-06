import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import UserHome from "../page/userPage/UserHome"
import PackageDetails from "../page/userPage/PackageDetails"
import UserLoginPage from "../page/userPage/UserLoginPage"
import SignUpPage from "../page/userPage/SignUpPage"
import EmailVerification from "../page/userPage/EmailVerification"
import OTPVerification from "../page/userPage/OTPVerification"


function UserRouter() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/UserLoginPage" element={<UserLoginPage />} />
          <Route path="/SignUpPage" element={<SignUpPage />} />
          <Route path="/EmailVerification" element={<EmailVerification />} />
          <Route path="/OTPVerification" element={<OTPVerification />} />
          <Route path="/" element={<UserHome />} />
          <Route path="/PackageDetails" element={<PackageDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default UserRouter
