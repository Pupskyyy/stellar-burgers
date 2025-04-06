import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import { TOrder, TIngredient, TConstructorIngredient } from '../utils/types';
import {
  getOrderByNumberApi,
  orderBurgerApi,
  getOrdersApi
} from '../utils/burger-api';
import { RootState } from '../services/store';

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (orderData: string[]) => orderBurgerApi(orderData)
);

export const userOrders = createAsyncThunk('order/userOrders', async () => {
  const userOrders = await getOrdersApi();
  return userOrders;
});

type TOrderState = {
  constructorOrder: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orders: TOrder[];
  error: string | null;
  isLoadingOrder: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrderState = {
  constructorOrder: {
    bun: {
      _id: '',
      name: '',
      type: '',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 0,
      image: '',
      image_large: '',
      image_mobile: '',
      id: ''
    },
    ingredients: []
  },
  orders: [],
  error: '',
  isLoadingOrder: false,
  orderModalData: null
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addConstructorIngredients: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorOrder.bun = action.payload;
        } else {
          state.constructorOrder.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    deleteConstructorIngredients: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      if (action.payload.type === 'bun') {
        state.constructorOrder.bun = null;
      } else {
        state.constructorOrder.ingredients =
          state.constructorOrder.ingredients.filter(
            (item) => item.id !== action.payload.id
          );
      }
    },
    resetOrderData: (state) => {
      state.constructorOrder = initialState.constructorOrder;
      state.orders = initialState.orders;
      state.error = initialState.error;
      state.isLoadingOrder = initialState.isLoadingOrder;
      state.orderModalData = initialState.orderModalData;
    },
    moveConstructorIngredients: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const item = state.constructorOrder.ingredients[from];
      state.constructorOrder.ingredients.splice(from, 1);
      state.constructorOrder.ingredients.splice(to, 0, item);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userOrders.pending, (state) => {
        state.isLoadingOrder = true;
        state.error = null;
      })
      .addCase(userOrders.rejected, (state, action) => {
        state.isLoadingOrder = false;
        state.error = action.error.message ?? null;
      })
      .addCase(userOrders.fulfilled, (state, action) => {
        state.isLoadingOrder = false;
        state.error = null;
        state.orders = action.payload;
      })

      .addCase(orderBurger.pending, (state) => {
        state.isLoadingOrder = true;
        state.error = null;
        state.orderModalData = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.isLoadingOrder = false;
        state.error = action.error.message ?? null;
        state.orderModalData = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.isLoadingOrder = false;
        state.error = null;
        state.orderModalData = action.payload.order;
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoadingOrder = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoadingOrder = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoadingOrder = false;
        state.error = null;
        state.orders.push(...action.payload.orders);
      });
  }
});

export const {
  addConstructorIngredients,
  deleteConstructorIngredients,
  moveConstructorIngredients,
  resetOrderData
} = orderSlice.actions;

export const getOrderSelector = (state: RootState) => state.orders;

export const getConstructorOrderSelector = createSelector(
  getOrderSelector,
  (orderState) => orderState.constructorOrder
);

export const getIsLoadingOrderSelector = createSelector(
  getOrderSelector,
  (orderState) => orderState.isLoadingOrder
);

export const getOrderModalDataSelector = createSelector(
  getOrderSelector,
  (orderState) => orderState.orderModalData
);

export const getUserOrdersDataSelector = createSelector(
  getOrderSelector,
  (orderState) => orderState.orders
);

export const getUserOrderByNumberSelector = (number: string) =>
  createSelector(getOrderSelector, (order) =>
    order.orders.find((order) => order.number === Number(number))
  );
