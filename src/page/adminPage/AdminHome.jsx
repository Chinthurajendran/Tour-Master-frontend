import React, { useEffect } from "react"
import { Outlet, Navigate } from "react-router-dom"
import AdminSidebar from "../../components/adminCompnents/AdminSidebar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

function AdminHome() {
  const navigate = useNavigate()
  const admin_authenticated = useSelector(
    (state) => state.adminAuth.isAuthenticated_admin
  )

  useEffect(() => {
    if (!admin_authenticated) {
      navigate("/UserLoginPage")
    }
  }, [admin_authenticated, navigate])

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex flex-grow">
        <AdminSidebar />
        <div className="w-5/6 p-6">
          <div className="h-[85vh] overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
