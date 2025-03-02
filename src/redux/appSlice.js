import { createSlice } from "@reduxjs/toolkit";
import { User } from "../utils/list";

const loadState = () => {
  try {
    const savedState = localStorage.getItem("appState");
    return savedState ? JSON.parse(savedState) : undefined;
  } catch (error) {
    console.error("Error loading state:", error);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem("appState", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving state:", error);
  }
};

// ✅ Initial state, fallback if nothing is saved
const initialState = loadState() || {
  ownerName: "",
  ownerPhoneNumber: "",
  ownerAddress: "",
  googleMapsLink: "",
  list: [],
  errors: {
    isPhoneNumberValid: true, // Assume valid initially
    nameError: null,
    addressError: null,
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateName: (state, action) => {
      state.ownerName = action.payload;
      state.errors.nameError =
        action.payload.trim() === "" ? "Name is required" : null;
      saveState(state);
    },
    updatePhoneNumber: (state, action) => {
      state.ownerPhoneNumber = action.payload;
      state.errors.isPhoneNumberValid = User.validatePhoneNumber(
        action.payload
      );
      saveState(state);
    },
    updateAddress: (state, action) => {
      state.ownerAddress = action.payload;
      state.errors.addressError =
        action.payload.trim() === "" ? "Address is required" : null;
      saveState(state);
    },
    updateGoogleMapsLink: (state, action) => {
      state.googleMapsLink = action.payload;
      saveState(state);
    },
    addListItem: (state, action) => {
      state.list = [action.payload, ...state.list];
      saveState(state);
    },
    editListItem: (state, action) => {
      const { index, value } = action.payload;
      if (state.list[index] !== undefined) {
        state.list = state.list.map((item, i) => (i === index ? value : item));
        saveState(state);
      }
    },
    removeListItem: (state, action) => {
      state.list = state.list.filter((_, i) => i !== action.payload);
      saveState(state);
    },
  },
});

export const {
  updateName,
  updatePhoneNumber,
  updateGoogleMapsLink,
  updateAddress,
  addListItem,
  editListItem,
  removeListItem,
} = appSlice.actions;

export default appSlice.reducer;
