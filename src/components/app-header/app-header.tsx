import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserNameSelector } from '../../slices/userSlice';

export const AppHeader: FC = () => {
  const name = useSelector(getUserNameSelector);
  return <AppHeaderUI userName={name} />;
};
