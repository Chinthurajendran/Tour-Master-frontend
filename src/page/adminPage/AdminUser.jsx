import React, { useState, useEffect } from "react"
import { Edit3, Trash2 } from "lucide-react"
// import axiosInstance from "../../Interceptors/AdminInterceptor"
// import gallery from "../../assets/gallery.png"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Swal from "sweetalert2"

function AdminUser() {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

//   const fetchbloge = async () => {
//     try {
//       const response = await axiosInstance.get(`user_list`)
//       if (response.status === 200) {
//         const users_list = response.data.users
//         setUsers(users_list)
//       }
//     } catch (error) {
//       console.error("Error fetching blogs:", error)
//     }
//   }

  useEffect(() => {
    // fetchbloge()
  }, [])


  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    })

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.put(`user_delete/${userId}`)
        if (res.status === 200) {
          Swal.fire("Deleted!", "The User has been deleted.", "success")
          fetchbloge()
        }
      } catch (error) {
        console.error("Delete failed:", error)
        toast.error("Failed to delete blog")
      }
    }
  }

  const handleEdit = (userId) => {
    navigate(`/AdminUserEdit`, { state: { userId: userId } })
  }

  const handleCreateUser = () => {
    navigate(`/AdminUserCreate`)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">User List</h2>
        <button
          onClick={handleCreateUser}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Create User
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-300">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Username</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Login Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <td className="px-6 py-4">
                  <img
                    src={user?.image || gallery}
                    alt="User"
                    className="w-14 h-14 object-cover rounded-full border border-gray-200"
                  />
                </td>
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.login_status
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.login_status ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 flex space-x-3">
                  <button
                    onClick={() => handleEdit(user.user_id)}
                    className="text-yellow-500 hover:text-yellow-600 transition duration-150"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.user_id)}
                    className="text-red-500 hover:text-red-600 transition duration-150"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUser

