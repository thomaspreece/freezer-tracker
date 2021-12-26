import { configureStore } from '@reduxjs/toolkit';
import freezerItemsReducer from './freezer_items';
import filtersReducer from './filters';

export const store = configureStore({
  reducer: {
    freezerItems: freezerItemsReducer,
    filters: filtersReducer
  },
});
