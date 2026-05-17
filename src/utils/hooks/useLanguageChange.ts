import { useAppSelector } from '../../store/hooks';

export const useLanguageChange = (): string =>
  useAppSelector(state => state.language.currentLanguageCode);
