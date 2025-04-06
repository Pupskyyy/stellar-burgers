import { FC, useMemo, useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import {
  getIngredientsListSelector,
  getIngredients
} from '../../slices/ingredientsSlice';
import { getFeedSelectorByNumber, getFeeds } from '../../slices/feedsSlice';
import {
  getUserOrderByNumberSelector,
  getOrderByNumber
} from '../../slices/orderSlice';

export const OrderInfo: FC = () => {
  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;
  const dispatch = useDispatch();
  /** TODO: взять переменные orderData и ingredients из стора */
  const orderData = useSelector(
    profileMatch
      ? getUserOrderByNumberSelector(orderNumber!)
      : getFeedSelectorByNumber(orderNumber!)
  );

  const ingredients: TIngredient[] = useSelector(getIngredientsListSelector);

  useEffect(() => {
    if (!orderNumber) return;

    if (!orderData || !ingredients) {
      dispatch(getIngredients());

      if (profileMatch) {
        dispatch(getOrderByNumber(Number(orderNumber))); // например, загрузка заказов пользователя
      } else if (feedMatch) {
        dispatch(getFeeds()); // загрузка публичного фида
      }
    }
  }, []);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
