import { feedsSlice, getFeeds } from '../src/slices/feedsSlice';

const feedsReducer = feedsSlice.reducer;

describe('feedsSlice extraReducers', () => {
  const initialState = {
    feeds: [],
    isLoadingFeed: false,
    error: null,
    totalFeeds: 0,
    totalTodayFeeds: 0
  };

  it('возвращает начальное состояние при инициализации', () => {
    const result = feedsReducer(undefined, { type: '@@INIT' });
    expect(result).toEqual(initialState);
  });

  describe('getFeeds async thunk', () => {
    it('обрабатывает pending', () => {
      const action = { type: getFeeds.pending.type };
      const result = feedsReducer(initialState, action);
      expect(result.isLoadingFeed).toBe(true);
      expect(result.error).toBeNull();
    });

    it('обрабатывает fulfilled', () => {
      const mockPayload = {
        orders: [
          {
            number: 1,
            ingredients: [],
            status: 'done',
            name: '',
            createdAt: '',
            updatedAt: '',
            _id: ''
          }
        ],
        total: 100,
        totalToday: 10
      };
      const action = { type: getFeeds.fulfilled.type, payload: mockPayload };
      const result = feedsReducer(initialState, action);
      expect(result.isLoadingFeed).toBe(false);
      expect(result.feeds).toEqual(mockPayload.orders);
      expect(result.totalFeeds).toBe(100);
      expect(result.totalTodayFeeds).toBe(10);
    });

    it('обрабатывает rejected', () => {
      const action = {
        type: getFeeds.rejected.type,
        error: { message: 'Ошибка загрузки ленты' }
      };
      const result = feedsReducer(initialState, action);
      expect(result.isLoadingFeed).toBe(false);
      expect(result.error).toBe('Ошибка загрузки ленты');
    });
  });
});
