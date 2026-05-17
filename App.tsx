import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { store, persistor } from './src/store';
import { AppModule } from './src/presentation/context/AppModule';
import { ThemeWrapper } from './src/utils/theme/ThemeWrapper';
import { ContextProvider } from './src/presentation/context/AppContext';
import AppNavigator from './src/presentation/navigation/AppNavigator';
import { AppLoader } from './src/utils/components/loader/AppLoader';
import { ToastView } from './src/utils/components/toast-view/ToastView';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppModule>
          <SafeAreaProvider>
            <ThemeWrapper>
              {/* ThemeWrapper renders NavigationContainer internally */}
              <ContextProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <BottomSheetModalProvider>
                    <AppNavigator />
                    <AppLoader />
                    <ToastView />
                  </BottomSheetModalProvider>
                </GestureHandlerRootView>
              </ContextProvider>
            </ThemeWrapper>
          </SafeAreaProvider>
        </AppModule>
      </PersistGate>
    </Provider>
  );
}