import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
  name: "authentication_user",
  initialState: {
    userid: null,
    username: null,
    useremail: null,
    isAuthenticated: false,
    user_role:null,
    user_access_token: null,
    user_refresh_token: null,
  },
  reducers: {
    login: (state, action) => {
      state.userid = action.payload.userid
      state.username = action.payload.username
      state.useremail = action.payload.useremail
      state.user_role = action.payload.user_role
      state.isAuthenticated = action.payload.isAuthenticated
      state.user_access_token = action.payload.user_access_token;
      state.user_refresh_token = action.payload.user_refresh_token;
    },
    logout: (state) => {
      ;(state.userid = null),
        (state.username = null),
        (state.useremail = null),
        (state.user_role = null),
        (state.isAuthenticated = false),
        (state.user_access_token = false),
        (state.user_refresh_token = false)
    },
  },
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer
