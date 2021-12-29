import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  status: 'idle',
  updateStatus: 'idle',
};

export const fetchItems = createAsyncThunk(
  'freezerItems/fetchItems',
  async (thunkAPI) => {
    const response = await fetch("/api/items", {
      method: "GET"
    });
    const json = await response.json();
    return json
  }
)

export const changeItemCount = createAsyncThunk(
  'freezerItems/changeItemCount',
  async (data, thunkAPI) => {
    const id = data.id
    const count = data.count
    const response = await fetch(`/api/items/${id}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({count})
    });
    const json = await response.json();
    return json
  }
)

// export const changeItemCount = async (id, count) => {
//   try {
//     const response = await fetch(`/api/items/${id}`, {
//       method: "POST",
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({count})
//     });
//     if(response.status !== 200) {
//       throw new Error("Invalid response back from server")
//     }
//   } catch (error) {
//     console.log("Error", error)
//   }
// }

export const freezerItemsSlicer = createSlice({
  name: 'freezerItems',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    add: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.items.push({
        ...action.payload,
      });
    },
    addMany: (state, action) => {
      state.items = state.items.concat(action.payload);
    },
    removeById: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload)
      if(index !== -1){
        state.items.splice(index,1)
      }
    },
    setCountById: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if(index !== -1){
        state.items[index].count = action.payload.count
      }
    },
    incrementById: (state, action) => {
      console.log("Increase")
      const index = state.items.findIndex((item) => item.id === action.payload)
      if(index !== -1){
        state.items[index].count += 1
      }
    },
    decrementById: (state, action) => {
      console.log("Decrease")
      const index = state.items.findIndex((item) => item.id === action.payload)
      if(index !== -1 && state.items[index].count > 0){
        state.items[index].count -= 1
      }
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.status = "idle"
      state.items = action.payload;
    })

    builder.addCase(fetchItems.pending, (state, action) => {
      state.status = 'pending'
    })

    builder.addCase(fetchItems.rejected, (state, action) => {
      state.status = "error"
    })

    builder.addCase(changeItemCount.fulfilled, (state, action) => {
      state.updateStatus = "idle"
    })

    builder.addCase(changeItemCount.pending, (state, action) => {
      state.updateStatus = 'pending'
    })

    builder.addCase(changeItemCount.rejected, (state, action) => {
      state.updateStatus = "error"
    })
  },
});

export const {
  add,
  addMany,
  removeById,
  incrementById,
  decrementById,
  setCountById,
} = freezerItemsSlicer.actions;



export default freezerItemsSlicer.reducer;
