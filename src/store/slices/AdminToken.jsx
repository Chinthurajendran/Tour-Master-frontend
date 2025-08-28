import { createSlice } from "@reduxjs/toolkit"
import { act } from "react"

export const adminTokenSlice = createSlice({
  name: "authentication_admin",
  initialState: {
    admin_access_token: null,
    admin_refresh_token: null,
  },
  reducers: {
    setAdminTokens: (state, action) => {
      state.admin_access_token = action.payload.admin_access_token
      state.admin_refresh_token = action.payload.admin_refresh_token
    },
    clearAdminTokens: (state) => {
      state.admin_access_token = null
      state.admin_refresh_token = null
    },
  },
})

export const { setAdminTokens, clearAdminTokens } = adminTokenSlice.actions
export default adminTokenSlice.reducer
