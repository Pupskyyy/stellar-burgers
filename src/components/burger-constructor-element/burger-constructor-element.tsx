import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

import {
  deleteConstructorIngredients,
  moveConstructorIngredients
} from '../../slices/orderSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(moveConstructorIngredients({ from: index, to: index + 1 }));
    };

    const handleMoveUp = () => {
      dispatch(moveConstructorIngredients({ from: index, to: index - 1 }));
    };

    const handleClose = () => {
      dispatch(deleteConstructorIngredients(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
