import { rootReducer } from '../src/services/store'; // Импортируем rootReducer, а не store

describe('rootReducer', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const initialState = {
      ingredients: {
        ingredients: [],
        isLoadingIngredients: false,
        error: null
      },
      feeds: {
        feeds: [],
        isLoadingFeed: false,
        error: null,
        totalFeeds: 0,
        totalTodayFeeds: 0
      },
      user: {
        isAuthChecked: false,
        isAuthenticated: false,
        userData: {
          email: '',
          name: ''
        },
        userError: null,
        userRequest: false
      },
      orders: {
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
      }
    };

    const result = rootReducer(initialState, action);

    expect(result).toEqual(initialState);
  });
});
