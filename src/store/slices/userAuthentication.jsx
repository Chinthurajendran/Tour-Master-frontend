import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
  name: "authentication_user",
  initialState: {
    userid: null,
    username: null,
    useremail: null,
    isAuthenticated: false,
    user_role:null,
  },
  reducers: {
    login: (state, action) => {
      state.userid = action.payload.userid
      state.username = action.payload.username
      state.useremail = action.payload.useremail
      state.user_role = action.payload.user_role
      state.isAuthenticated = action.payload.isAuthenticated
    },
    logout: (state) => {
      ;(state.userid = null),
        (state.username = null),
        (state.useremail = null),
        (state.user_role = null),
        (state.isAuthenticated = false)
    },
  },
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer
