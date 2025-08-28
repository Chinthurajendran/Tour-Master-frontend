import React, { useState, useEffect } from "react"
import { User } from "lucide-react"
import gallery from "../../assets/gallery.png"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Swal from "sweetalert2"
import axiosInstance from "../../utils/axiosInstance"

function AdminUser() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("fetch-users")
      if (response.status === 200) {
        setUsers(response.data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
    }
  }

  return (
    <div className="flex flex-col bg-gradient-to-br text-white">
      {/* Header */}

      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg p-6 mb-7 shadow-md border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
              <User className="w-9 h-9 text-blue-600" />
              User Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage platform users and their access.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200 ">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Username</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-4">
                    <img
                      src={user?.image || gallery}
                      alt="User"
                      className="w-14 h-14 object-cover rounded-full border border-gray-200 shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                        user.login_status
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {user.login_status ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-gray-500 italic"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUser
