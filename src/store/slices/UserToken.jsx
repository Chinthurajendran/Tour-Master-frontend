import { createSlice } from "@reduxjs/toolkit"

export const userTokenSlice = createSlice({
  name: "user_token",
  initialState: {
    user_access_token: null,
    user_refresh_token: null,
  },
  reducers: {
    setUserTokens: (state, action) => {
      state.user_access_token = action.payload.user_access_token;
      state.user_refresh_token = action.payload.user_refresh_token;
    },
    clearUserTokens: (state) => {
        (state.user_access_token = false),
        (state.user_refresh_token = false)
    },
  },
})

export const { setUserTokens, clearUserTokens } = userTokenSlice.actions

export default userTokenSlice.reducer
