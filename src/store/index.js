import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
});

const tabSlice = createSlice({
  name: "tab",
  initialState: { activeTab: "" },
  reducers: {
    home(state) {
      state.activeTab = "Home";
    },
    login(state) {
      state.activeTab = "Login";
    },
    logout(state) {
      state.activeTab = "Logout";
    },
    register(state) {
      state.activeTab = "Register";
    },
    welcome(state) {
      state.activeTab = "Welcome";
    },
  },
});

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState: { isOpen: false },
  reducers: {
    openDropdown(state) {
      state.isOpen = true;
    },
    closeDropdown(state) {
      state.isOpen = false;
    },
  },
});

const profilePictureSlice = createSlice({
  name: "profilePicture",
  initialState: { key: 0 },
  reducers: {
    updateProfilePictureKey(state) {
      state.key += 1;
    },
  },
});

// New adminSlice
const adminSlice = createSlice({
  name: "admin",
  initialState: { isAdmin: false },
  reducers: {
    setAdminStatus(state, action) {
      state.isAdmin = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export const tabActions = tabSlice.actions;
export const dropdownActions = dropdownSlice.actions;
export const profilePictureActions = profilePictureSlice.actions;
export const adminActions = adminSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    tab: tabSlice.reducer,
    dropdown: dropdownSlice.reducer,
    profilePicture: profilePictureSlice.reducer,
    admin: adminSlice.reducer, // Include the admin slice in the Redux store
  },
});
