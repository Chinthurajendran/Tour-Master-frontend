import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// import UserLoginPage from "../pages/userPage/UserLoginPage"
// import EmailVerification from "../pages/userPage/EmailVerification"
// import OTPVerification from "../pages/userPage/OTPVerification"
// import SignUpPage from "../pages/userPage/SignUpPage"
import UserHome from "../page/userPage/UserHome"
// import UserProfilePage from "../pages/userPage/UserProfilePage"
// import UserProfile from "../pages/userPage/UserProfile"
// import UserBlogs from "../pages/userPage/UserBlogs"
// import AdminHome from "../pages/adminPage/AdminHome"
// import UserPrivateRouter from "../privateRoute/UserPrivateRouter"
// import CreateBlog from "../pages/userPage/CreateBlog"
// import EditBloge from "../pages/userPage/EditBloge"

function UserRouter() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/UserLoginPage" element={<UserLoginPage />} />
          <Route path="/EmailVerification" element={<EmailVerification />} />
          <Route path="/OTPVerification" element={<OTPVerification />} />
          <Route path="/SignUpPage" element={<SignUpPage />} /> */}
          <Route path="/" element={<UserHome />} />

            {/* <Route path="/UserProfilePage" element={<UserProfilePage />}>
              <Route path="UserProfile" element={<UserProfile />} />
              <Route path="UserBlogs" element={<UserBlogs />} />
            </Route>
            <Route path="/CreateBlog" element={<CreateBlog />} />
            <Route path="/EditBloge" element={<EditBloge />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default UserRouter
