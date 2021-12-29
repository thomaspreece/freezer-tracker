import { createSlice } from '@reduxjs/toolkit';


export const STATUSES = {
  CONNECTED: "connected",
  DISCONNECTED: "disconnected"
}

const initialState = {
  status: STATUSES.DISCONNECTED,
};


export const websocketSlicer = createSlice({
  name: 'websockets',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setStatus: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.status = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {},
});

export const {
  setStatus
} = websocketSlicer.actions;

export default websocketSlicer.reducer;
