import { getIsLoadingIngredientsSelector } from '../../slices/ingredientsSlice';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

import { useSelector } from '../../services/store';
import { getIsAuthCheckedSelector } from '../../slices/userSlice';

export const ConstructorPage: FC = () => {
  /** TODO: взять переменную из стора */
  const isIngredientsLoading = useSelector(getIsLoadingIngredientsSelector);
  const isAuthChecked = useSelector(getIsAuthCheckedSelector);

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
