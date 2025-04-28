import {
  ingredientsSlice,
  getIngredients
} from '../src/slices/ingredientsSlice';

const ingredientsReducer = ingredientsSlice.reducer;

describe('ingredientsSlice extraReducers', () => {
  const initialState = {
    ingredients: [],
    isLoadingIngredients: false,
    error: null
  };

  it('возвращает начальное состояние при инициализации', () => {
    const result = ingredientsReducer(undefined, { type: '@@INIT' });
    expect(result).toEqual(initialState);
  });
  describe('getIngredients async thunk', () => {
    it('обрабатывает pending', () => {
      const action = { type: getIngredients.pending.type };
      const result = ingredientsReducer(initialState, action);

      expect(result.isLoadingIngredients).toBe(true);
      expect(result.error).toBeNull();
      expect(result.ingredients).toEqual([]);
    });

    it('обрабатывает fulfilled', () => {
      const mockData = [
        {
          _id: '1',
          name: 'Булка',
          type: 'bun',
          proteins: 10,
          fat: 20,
          carbohydrates: 30,
          calories: 400,
          price: 100,
          image: '',
          image_mobile: '',
          image_large: '',
          __v: 0
        }
      ];

      const action = { type: getIngredients.fulfilled.type, payload: mockData };
      const result = ingredientsReducer(initialState, action);

      expect(result.isLoadingIngredients).toBe(false);
      expect(result.error).toBeNull();
      expect(result.ingredients).toEqual(mockData);
    });

    it('обрабатывает rejected', () => {
      const action = {
        type: getIngredients.rejected.type,
        error: { message: 'Ошибка загрузки' }
      };
      const result = ingredientsReducer(initialState, action);

      expect(result.isLoadingIngredients).toBe(false);
      expect(result.error).toBe('Ошибка загрузки');
      expect(result.ingredients).toEqual([]);
    });
  });
});
