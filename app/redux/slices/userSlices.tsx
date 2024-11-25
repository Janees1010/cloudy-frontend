import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  _id: string;
  username: string;
  email: string;
  password: string;
};

const initialState: UserState = {
  _id: "",
  username: "",
  email: "",
  password: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserState>) => {
      state._id = action.payload._id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    // Example: Adding a clear user action
    clearUser: (state) => {
      state._id = "";
      state.username = "";
      state.email = "";
      state.password = "";
    },
  },
});

export const { addUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
