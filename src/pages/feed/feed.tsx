import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredients,
  getIngredientsListSelector
} from '../../slices/ingredientsSlice';
import {
  getFeedsListSelector,
  getFeeds,
  getIsLoadingFeedSelector
} from '../../slices/feedsSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoadingFeedSelector);
  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };
  const orders: TOrder[] = useSelector(getFeedsListSelector);

  useEffect(() => {
    dispatch(getFeeds());
  }, []);

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
