import { createSlice } from "@reduxjs/toolkit"
import { act } from "react"

export const adminSlice = createSlice({
  name: "authentication_admin",
  initialState: {
    admin_role:null,
    admin_username: null,
    isAuthenticated_admin: false,
  },
  reducers: {
    admin_login: (state, action) => {
      state.admin_role = action.payload.admin_role
      state.admin_username = action.payload.admin_username
      state.isAuthenticated_admin = true
    },
    admin_logout: (state) => {
      state.admin_role = null
      state.admin_username = null
      state.isAuthenticated_admin = false
    },
  },
})

export const { admin_login, admin_logout } = adminSlice.actions
export default adminSlice.reducer
