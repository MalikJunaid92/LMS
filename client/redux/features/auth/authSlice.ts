import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the user object
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    public_id?: string;
    url?: string;
  };
  courses?: Array<{ _id: string }>;
}

// Define the Auth state
interface AuthState {
  token: string;
  user: User | null;
}

// Initial state
const initialState: AuthState = {
  token: "",
  user: null,
};

// Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegisteration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string; user: User }>
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = null;
    },
  },
});

export const { userRegisteration, userLoggedIn, userLoggedOut } =
  authSlice.actions;

export default authSlice.reducer;
