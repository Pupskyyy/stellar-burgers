import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  forgotPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi,
  getUserApi,
  logoutApi
} from '../utils/burger-api';
import { RootState } from '../services/store';
import { TUser, TOrder } from '../utils/types';
import { act } from 'react-dom/test-utils';
import { setCookie } from '../utils/cookie';

export const getUser = createAsyncThunk('user/getUser', async () => {
  const dataUser = getUserApi();
  return dataUser;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (newUserData: Partial<TRegisterData>) => {
    const dataUser = updateUserApi(newUserData);
    return dataUser;
  }
);

export const register = createAsyncThunk(
  'user/register',
  async ({ email, name, password }: TRegisterData) => {
    const data = await registerUserApi({ email, name, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData) => {
    const data = await loginUserApi({ email, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const forgotPassword = createAsyncThunk(
  'user/password-reset',
  async ({ email }: Omit<TLoginData, 'password'>) =>
    await forgotPasswordApi({ email })
);

export const logout = createAsyncThunk('user/logout', async () => {
  logoutApi();
  setCookie('accessToken', '');
  localStorage.setItem('refreshToken', '');
});

type TUserState = {
  isAuthChecked: boolean; // флаг для статуса проверки токена пользователя
  isAuthenticated: boolean;
  userData: TUser;
  userError: string | null;
  userRequest: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  userData: {
    email: '',
    name: ''
  },
  userError: null,
  userRequest: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.userRequest = true;
        state.userError = null;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.userRequest = false;
        state.userError = action.error.message ?? null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.userRequest = false;
        state.userError = null;
        // Записываем в `state.data` только нужные поля, исключая `success`
        state.userData = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      .addCase(login.pending, (state) => {
        state.userRequest = true;
        state.userError = null;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.userRequest = false;
        state.userError = action.error.message ?? null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userRequest = false;
        state.userError = null;
        // Записываем в `state.data` только нужные поля, исключая `success`
        state.userData = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      .addCase(getUser.pending, (state) => {
        state.userRequest = true;
        state.userError = null;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.userRequest = false;
        state.userError = action.error.message ?? null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userRequest = false;
        state.userError = null;
        state.userData = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.userRequest = true;
        state.userError = null;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userRequest = false;
        state.userError = action.error.message ?? null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userRequest = false;
        state.userError = null;
        state.userData = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      .addCase(logout.pending, (state) => {
        state.userRequest = true;
        state.userError = null;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.userRequest = false;
        state.userError = action.error.message ?? null;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.userRequest = false;
        state.userError = null;
        state.userData = {
          email: '',
          name: ''
        };
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      });
  }
});

export const getUserSelector = (state: RootState) => state.user;

export const getIsAuthenticatedSelector = createSelector(
  getUserSelector,
  (userState) => userState.isAuthenticated
);

export const getIsAuthCheckedSelector = createSelector(
  getUserSelector,
  (userState) => userState.isAuthChecked
);

export const getUserErrorSelector = createSelector(
  getUserSelector,
  (userState) => userState.userError
);

export const getUserDataSelector = createSelector(
  getUserSelector,
  (userState) => userState.userData
);

export const getUserNameSelector = createSelector(
  getUserSelector,
  (userState) => userState.userData.name
);
