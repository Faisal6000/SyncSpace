export enum NavigationScreen {
  Splash = 'Splash',
  Login = 'Login',
  Register = 'Register',
  Home = 'Home',
}

export type RootStackParamList = {
  [NavigationScreen.Splash]: undefined;
  [NavigationScreen.Login]: undefined;
  [NavigationScreen.Register]: undefined;
  [NavigationScreen.Home]: undefined;
};
