import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';
import { getFeedsApi } from '../utils/burger-api';
import { RootState } from '../services/store';

export const getFeeds = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);

type TFeedsState = {
  feeds: Array<TOrder>;
  isLoadingFeed: boolean;
  error: string | null;
  totalFeeds: number;
  totalTodayFeeds: number;
};

const initialState: TFeedsState = {
  feeds: [],
  isLoadingFeed: false,
  error: null,
  totalFeeds: 0,
  totalTodayFeeds: 0
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoadingFeed = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoadingFeed = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoadingFeed = false;
        state.feeds = action.payload.orders;
        state.totalFeeds = action.payload.total;
        state.totalTodayFeeds = action.payload.totalToday;
      });
  }
});

export const getFeedsSelector = (state: RootState) => state.feeds;

export const getIsLoadingFeedSelector = createSelector(
  getFeedsSelector,
  (feedsState) => feedsState.isLoadingFeed
);

export const getFeedsListSelector = createSelector(
  getFeedsSelector,
  (feedsState) => feedsState.feeds
);

export const getTotalFeedsSelector = createSelector(
  getFeedsSelector,
  (feedsState) => feedsState.totalFeeds
);

export const getTotalTodayFeedsSelector = createSelector(
  getFeedsSelector,
  (feedsState) => feedsState.totalTodayFeeds
);

export const getFeedSelectorByNumber = (number: string) =>
  createSelector(getFeedsListSelector, (feeds) =>
    feeds.find((feed) => feed.number === Number(number))
  );
