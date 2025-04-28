import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  getConstructorOrderSelector,
  getIsLoadingOrderSelector,
  getOrderModalDataSelector,
  orderBurger,
  resetOrderData
} from '../../slices/orderSlice';
import { getIsAuthenticatedSelector } from '../../slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const dispatch = useDispatch();

  const constructorItems = useSelector(getConstructorOrderSelector);

  const orderRequest = useSelector(getIsLoadingOrderSelector);

  const orderModalData = useSelector(getOrderModalDataSelector);

  const isAuthenticated = useSelector(getIsAuthenticatedSelector);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    // Собираем массив id ингредиентов для заказа
    const ingredientsIds = [
      constructorItems.bun._id, // Булки нужно передать дважды (верх и низ)
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    // Диспатчим экшен для создания заказа
    dispatch(orderBurger(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(resetOrderData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
