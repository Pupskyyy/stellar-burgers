import { getIsLoadingIngredientsSelector } from '../../slices/ingredientsSlice';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredientsListSelector,
  getIngredients
} from '../../slices/ingredientsSlice';
import { getIsAuthCheckedSelector } from '../../slices/userSlice';

export const ConstructorPage: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const ingredients = useSelector(getIngredientsListSelector);
  const isIngredientsLoading = useSelector(getIsLoadingIngredientsSelector);
  const isAuthChecked = useSelector(getIsAuthCheckedSelector);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(getIngredients());
    }
  }, [ingredients.length]);
  return (
    <>
      {isIngredientsLoading || !isAuthChecked ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
