import {
  orderSlice,
  addConstructorIngredients,
  deleteConstructorIngredients,
  moveConstructorIngredients,
  resetOrderData,
  userOrders,
  orderBurger,
  getOrderByNumber
} from '../src/slices/orderSlice';

const orderReducer = orderSlice.reducer;

describe('orderSlice', () => {
  const initialState = {
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

  it('возвращает начальное состояние при инициализации', () => {
    expect(orderReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('reducers', () => {
    it('обрабатывает addConstructorIngredients для булки', () => {
      const bun = {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 0,
        image: '',
        image_large: '',
        image_mobile: '',
        id: 'some-id'
      };
      const action = addConstructorIngredients(bun);
      const state = orderReducer(initialState, action);
      const expectedBun = { ...state.constructorOrder.bun, id: 'some-id' };
      expect(expectedBun).toEqual(bun);
    });

    it('обрабатывает addConstructorIngredients для ингредиента', () => {
      const ingredient = {
        _id: '2',
        name: 'Котлета',
        type: 'main',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 0,
        image: '',
        image_large: '',
        image_mobile: '',
        id: 'some-id'
      };
      const action = addConstructorIngredients(ingredient);
      const state = orderReducer(initialState, action);
      expect(state.constructorOrder.ingredients.length).toBe(1);
      const expectedIngredients = {
        ...state.constructorOrder.ingredients[0],
        id: 'some-id'
      };
      expect(expectedIngredients).toEqual(ingredient);
    });

    it('обрабатывает deleteConstructorIngredients для булки', () => {
      const stateWithBun = {
        ...initialState,
        constructorOrder: {
          ...initialState.constructorOrder,
          bun: {
            _id: '1',
            name: 'Булка',
            type: 'bun',
            proteins: 0,
            fat: 0,
            carbohydrates: 0,
            calories: 0,
            price: 0,
            image: '',
            image_large: '',
            image_mobile: '',
            id: 'some-id'
          }
        }
      };
      const action = deleteConstructorIngredients(
        stateWithBun.constructorOrder.bun!
      );
      const state = orderReducer(stateWithBun, action);
      expect(state.constructorOrder.bun).toBeNull();
    });

    it('обрабатывает deleteConstructorIngredients для ингредиента', () => {
      const ingredient = {
        _id: '2',
        name: 'Котлета',
        type: 'main',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 0,
        image: '',
        image_large: '',
        image_mobile: '',
        id: 'some-id'
      };
      const stateWithIngredient = {
        ...initialState,
        constructorOrder: {
          ...initialState.constructorOrder,
          ingredients: [ingredient]
        }
      };
      const action = deleteConstructorIngredients(ingredient);
      const state = orderReducer(stateWithIngredient, action);
      expect(state.constructorOrder.ingredients.length).toBe(0);
    });

    it('обрабатывает resetOrderData', () => {
      const changedState = {
        ...initialState,
        constructorOrder: {
          bun: null,
          ingredients: [{ ...initialState.constructorOrder.bun!, id: '123' }]
        },
        orders: [{ _id: 'order1' } as any],
        error: 'some error',
        isLoadingOrder: true,
        orderModalData: { _id: 'modalOrder' } as any
      };
      const action = resetOrderData();
      const state = orderReducer(changedState, action);
      expect(state).toEqual(initialState);
    });

    it('обрабатывает moveConstructorIngredients', () => {
      const ingredients = [
        { id: '1', name: 'Котлета', type: 'main' } as any,
        { id: '2', name: 'Сыр', type: 'main' } as any
      ];
      const stateWithIngredients = {
        ...initialState,
        constructorOrder: {
          ...initialState.constructorOrder,
          ingredients
        }
      };
      const action = moveConstructorIngredients({ from: 0, to: 1 });
      const state = orderReducer(stateWithIngredients, action);
      expect(state.constructorOrder.ingredients[0].id).toBe('2');
      expect(state.constructorOrder.ingredients[1].id).toBe('1');
    });
  });

  describe('extraReducers', () => {
    describe('userOrders async thunk', () => {
      it('обрабатывает pending', () => {
        const action = { type: userOrders.pending.type };
        const state = orderReducer(initialState, action);
        expect(state.isLoadingOrder).toBe(true);
        expect(state.error).toBeNull();
      });

      it('обрабатывает fulfilled', () => {
        const mockOrders = [{ _id: 'order1' }, { _id: 'order2' }] as any;
        const action = { type: userOrders.fulfilled.type, payload: mockOrders };
        const state = orderReducer(initialState, action);
        expect(state.orders).toEqual(mockOrders);
        expect(state.isLoadingOrder).toBe(false);
        expect(state.error).toBeNull();
      });

      it('обрабатывает rejected', () => {
        const action = {
          type: userOrders.rejected.type,
          error: { message: 'Ошибка получения заказов' }
        };
        const state = orderReducer(initialState, action);
        expect(state.isLoadingOrder).toBe(false);
        expect(state.error).toBe('Ошибка получения заказов');
      });
    });

    describe('orderBurger async thunk', () => {
      it('обрабатывает pending', () => {
        const action = { type: orderBurger.pending.type };
        const state = orderReducer(initialState, action);
        expect(state.isLoadingOrder).toBe(true);
        expect(state.error).toBeNull();
        expect(state.orderModalData).toBeNull();
      });

      it('обрабатывает fulfilled', () => {
        const mockOrder = { order: { _id: 'order123' } };
        const action = { type: orderBurger.fulfilled.type, payload: mockOrder };
        const state = orderReducer(initialState, action);
        expect(state.orderModalData).toEqual(mockOrder.order);
        expect(state.isLoadingOrder).toBe(false);
        expect(state.error).toBeNull();
      });

      it('обрабатывает rejected', () => {
        const action = {
          type: orderBurger.rejected.type,
          error: { message: 'Ошибка оформления заказа' }
        };
        const state = orderReducer(initialState, action);
        expect(state.isLoadingOrder).toBe(false);
        expect(state.error).toBe('Ошибка оформления заказа');
        expect(state.orderModalData).toBeNull();
      });
    });

    describe('getOrderByNumber async thunk', () => {
      it('обрабатывает pending', () => {
        const action = { type: getOrderByNumber.pending.type };
        const state = orderReducer(initialState, action);
        expect(state.isLoadingOrder).toBe(true);
        expect(state.error).toBeNull();
      });

      it('обрабатывает fulfilled', () => {
        const mockPayload = {
          orders: [{ _id: 'order1' }, { _id: 'order2' }]
        };
        const action = {
          type: getOrderByNumber.fulfilled.type,
          payload: mockPayload
        };
        const state = orderReducer(initialState, action);
        expect(state.orders).toEqual(mockPayload.orders);
        expect(state.isLoadingOrder).toBe(false);
        expect(state.error).toBeNull();
      });

      it('обрабатывает rejected', () => {
        const action = {
          type: getOrderByNumber.rejected.type,
          error: { message: 'Ошибка поиска заказа' }
        };
        const state = orderReducer(initialState, action);
        expect(state.isLoadingOrder).toBe(false);
        expect(state.error).toBe('Ошибка поиска заказа');
      });
    });
  });
});
