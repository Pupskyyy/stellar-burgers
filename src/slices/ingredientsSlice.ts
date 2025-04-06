import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { TIngredient } from '../utils/types';
import { getIngredientsApi } from '../utils/burger-api';
import { RootState } from '../services/store';

export const getIngredients = createAsyncThunk<Array<TIngredient>, void>(
  'ingredients/getAll',
  async () => getIngredientsApi()
);

type TIngredientsState = {
  ingredients: Array<TIngredient>;
  isLoadingIngredients: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoadingIngredients: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoadingIngredients = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoadingIngredients = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoadingIngredients = false;
        state.ingredients = action.payload;
      });
  }
});

export const getIngredientsSelector = (state: RootState) => state.ingredients;

export const getIsLoadingIngredientsSelector = createSelector(
  getIngredientsSelector,
  (ingredientsState) => ingredientsState.isLoadingIngredients
);

export const getIngredientsListSelector = createSelector(
  getIngredientsSelector,
  (ingredientsState) => ingredientsState.ingredients
);

export const getIngredientByIdSelector = (id: string) =>
  createSelector(getIngredientsListSelector, (ingredients) =>
    ingredients.find((item) => item._id === id)
  );
