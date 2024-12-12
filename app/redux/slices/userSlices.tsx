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
      console.log(action.payload);
      return action.payload;
    },
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
