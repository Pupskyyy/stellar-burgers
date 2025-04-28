import {
  userSlice,
  login,
  register,
  getUser,
  updateUser,
  logout
} from '../src/slices/userSlice';

const userReducer = userSlice.reducer;

describe('userSlice extraReducers', () => {
  const initialState = {
    isAuthChecked: false,
    isAuthenticated: false,
    userData: {
      email: '',
      name: ''
    },
    userError: null,
    userRequest: false
  };

  it('возвращает начальное состояние при инициализации', () => {
    const result = userReducer(undefined, { type: '@@INIT' });
    expect(result).toEqual(initialState);
  });

  describe('register async thunk', () => {
    it('обрабатывает pending', () => {
      const action = { type: register.pending.type };
      const result = userReducer(initialState, action);
      expect(result.userRequest).toBe(true);
      expect(result.userError).toBeNull();
      expect(result.isAuthenticated).toBe(false);
      expect(result.isAuthChecked).toBe(false);
    });

    it('обрабатывает fulfilled', () => {
      const mockPayload = { user: { email: 'test@test.com', name: 'Test' } };
      const action = { type: register.fulfilled.type, payload: mockPayload };
      const result = userReducer(initialState, action);
      expect(result.userRequest).toBe(false);
      expect(result.userError).toBeNull();
      expect(result.userData).toEqual(mockPayload.user);
      expect(result.isAuthenticated).toBe(true);
      expect(result.isAuthChecked).toBe(true);
    });

    it('обрабатывает rejected', () => {
      const action = {
        type: register.rejected.type,
        error: { message: 'Ошибка регистрации' }
      };
      const result = userReducer(initialState, action);
      expect(result.userRequest).toBe(false);
      expect(result.userError).toBe('Ошибка регистрации');
      expect(result.isAuthenticated).toBe(false);
      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('login async thunk', () => {
    it('обрабатывает pending', () => {
      const action = { type: login.pending.type };
      const result = userReducer(initialState, action);
      expect(result.userRequest).toBe(true);
    });

    it('обрабатывает fulfilled', () => {
      const mockPayload = { user: { email: 'test@test.com', name: 'Test' } };
      const action = { type: login.fulfilled.type, payload: mockPayload };
      const result = userReducer(initialState, action);
      expect(result.userData).toEqual(mockPayload.user);
      expect(result.isAuthenticated).toBe(true);
      expect(result.isAuthChecked).toBe(true);
    });

    it('обрабатывает rejected', () => {
      const action = {
        type: login.rejected.type,
        error: { message: 'Ошибка входа' }
      };
      const result = userReducer(initialState, action);
      expect(result.userError).toBe('Ошибка входа');
      expect(result.isAuthenticated).toBe(false);
      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('getUser async thunk', () => {
    it('обрабатывает fulfilled', () => {
      const mockPayload = { user: { email: 'test@test.com', name: 'Test' } };
      const action = { type: getUser.fulfilled.type, payload: mockPayload };
      const result = userReducer(initialState, action);
      expect(result.userData).toEqual(mockPayload.user);
      expect(result.isAuthenticated).toBe(true);
      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('updateUser async thunk', () => {
    it('обрабатывает fulfilled', () => {
      const mockPayload = {
        user: { email: 'update@test.com', name: 'Updated' }
      };
      const action = { type: updateUser.fulfilled.type, payload: mockPayload };
      const result = userReducer(initialState, action);
      expect(result.userData).toEqual(mockPayload.user);
      expect(result.isAuthenticated).toBe(true);
      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('logout async thunk', () => {
    it('обрабатывает fulfilled', () => {
      const action = { type: logout.fulfilled.type };
      const customState = {
        ...initialState,
        userData: { email: 'test@test.com', name: 'Test' },
        isAuthenticated: true
      };
      const result = userReducer(customState, action);
      expect(result.userData).toEqual({ email: '', name: '' });
      expect(result.isAuthenticated).toBe(false);
      expect(result.isAuthChecked).toBe(true);
    });
  });
});
