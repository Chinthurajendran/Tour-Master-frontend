import React, { useState, useEffect } from "react"
import { Edit3, Trash2, UserPlus, User } from "lucide-react"
import gallery from "../../assets/gallery.png"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Swal from "sweetalert2"
import axiosInstance from "../../utils/axiosInstance"

function AdminUser() {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

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

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete user",
    })

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.put(`user_delete/${userId}`)
        if (response.status === 200) {
          Swal.fire("Deleted!", "User has been removed.", "success")
          fetchUsers()
        }
      } catch (error) {
        console.error("Delete failed:", error)
        toast.error("Failed to delete user")
      }
    }
  }

  const handleEdit = (userId) => {
    navigate(`/AdminUserEdit`, { state: { userId } })
  }

  const handleCreateUser = () => {
    navigate(`/AdminUserCreate`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <User className="w-7 h-7 text-blue-600" />
            User Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage platform users and their access.
          </p>
        </div>
        <button
          onClick={handleCreateUser}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-5 h-5" />
          New User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Username</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
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
                  <td className="px-6 py-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
