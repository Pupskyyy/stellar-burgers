import { configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { feedsSlice } from '../slices/feedsSlice';
import { userSlice } from '../slices/userSlice';
import { orderSlice } from '../slices/orderSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = {
  ingredients: ingredientsSlice.reducer,
  feeds: feedsSlice.reducer,
  user: userSlice.reducer,
  orders: orderSlice.reducer
  // Здесь можно добавить другие редьюсеры
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
