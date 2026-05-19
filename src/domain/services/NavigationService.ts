import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import { RootStackParamList, NavigationScreen } from '../../presentation/navigation/routes';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(screen: NavigationScreen, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.navigate({
        name: screen,
        params,
      }),
    );
  }
}
