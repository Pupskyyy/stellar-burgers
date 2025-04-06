import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '../../components/ui';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  userOrders,
  getUserOrdersDataSelector,
  getIsLoadingOrderSelector
} from '../../slices/orderSlice';
import {
  getIngredientsListSelector,
  getIngredients
} from '../../slices/ingredientsSlice';

export const ProfileOrders: FC = () => {
  const ingredients = useSelector(getIngredientsListSelector);
  const isLoadingOrders = useSelector(getIsLoadingOrderSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userOrders());
    if (!ingredients.length) {
      dispatch(getIngredients());
    }
  }, []);
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getUserOrdersDataSelector);

  return (
    <>{isLoadingOrders ? <Preloader /> : <ProfileOrdersUI orders={orders} />}</>
  );
};
