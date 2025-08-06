import { createSlice } from "@reduxjs/toolkit"
import { act } from "react"

export const adminSlice = createSlice({
  name: "authentication_admin",
  initialState: {
    admin_username: null,
    admin_access_token: null,
    admin_refresh_token: null,
    isAuthenticated_admin: false,
  },
  reducers: {
    admin_login: (state, action) => {
      state.admin_username = action.payload.admin_username
      state.admin_access_token = action.payload.admin_access_token
      state.admin_refresh_token = action.payload.admin_refresh_token
      state.isAuthenticated_admin = true
    },
    admin_logout: (state) => {
      state.admin_username = null
      state.admin_access_token = null
      state.admin_refresh_token = null
      state.isAuthenticated_admin = false
    },
  },
})

export const { admin_login, admin_logout } = adminSlice.actions
export default adminSlice.reducer
