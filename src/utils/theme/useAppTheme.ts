import { useColorScheme } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { resolveTheme } from './themes';
import { CustomTheme } from './CustomTheme';

export const useAppTheme = (): CustomTheme => {
  const preference = useAppSelector(state => state.theme.preference);
  const systemDark = useColorScheme() === 'dark';
  return resolveTheme(preference, systemDark);
};
