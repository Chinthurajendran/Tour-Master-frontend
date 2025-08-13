import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  MapPin,
  Package,
  CalendarDays,
  HelpCircle,
  LogOut,
  ImageIcon, // 📸 Banner Carousel
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { admin_logout } from "../../store/slices/AdminToken";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

function AdminSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogoutSubmit = async () => {
    try {
      const res = await axiosInstance.put(`admin_logout`)
      if (res.status === 200) {
        dispatch(admin_logout())
        navigate("/UserLoginPage")
        toast.success(res.data.message)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const detail = error.response.data.detail
        if (Array.isArray(detail)) {
          toast.error(detail.map((err) => err.msg).join(", "))
        } else if (typeof detail === "string") {
          toast.error(detail)
        } else {
          toast.error("Logout failed. Please try again.")
        }
      } else {
        toast.error("Logout failed. Please try again.")
      }
    }
  }

  const isActive = (path) => location.pathname.endsWith(path);

  return (
    <aside className="w-1/6 bg-blue-700 text-white min-h-screen p-4 shadow-lg flex flex-col">
      <header className="text-xl font-semibold mb-4">Admin Panel</header>

      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Link
              to="AdminUser"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-600 ${
                isActive("AdminUser") ? "bg-blue-900" : ""
              }`}
            >
              <Users className="h-5 w-5 mr-3" /> User Management
            </Link>
          </li>

          <li>
            <Link
              to="AdminBannerManagement"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-600 ${
                isActive("AdminBannerManagement") ? "bg-blue-900" : ""
              }`}
            >
              <ImageIcon className="h-5 w-5 mr-3" /> Banner Carousel
            </Link>
          </li>

          <li>
            <Link
              to="CountriesCitiesPage"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-600 ${
                isActive("CountriesCitiesPage") ? "bg-blue-900" : ""
              }`}
            >
              <MapPin className="h-5 w-5 mr-3" /> Countries & Cities
            </Link>
          </li>

          <li>
            <Link
              to="TourPackageManagement"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-600 ${
                isActive("TourPackageManagement") ? "bg-blue-900" : ""
              }`}
            >
              <Package className="h-5 w-5 mr-3" /> Tour Packages
            </Link>
          </li>

          <li>
            <Link
              to="PackageSchedules"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-600 ${
                isActive("PackageSchedules") ? "bg-blue-900" : ""
              }`}
            >
              <CalendarDays className="h-5 w-5 mr-3" /> Package Schedules
            </Link>
          </li>

          <li>
            <Link
              to="EnquiriesManagement"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-600 ${
                isActive("EnquiriesManagement") ? "bg-blue-900" : ""
              }`}
            >
              <HelpCircle className="h-5 w-5 mr-3" /> Enquiries
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          onClick={handleLogoutSubmit}
          className="flex items-center px-4 py-3 mt-4 rounded-lg hover:bg-blue-600 w-full"
        >
          <LogOut className="h-5 w-5 mr-3" /> Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
