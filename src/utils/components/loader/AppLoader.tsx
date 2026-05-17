import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { LoaderService } from '../../../domain/services/EventListener';
import { useAppTheme } from '../../theme/useAppTheme';

export function AppLoader() {
  const [visible, setVisible] = useState(false);
  const theme = useAppTheme();

  useEffect(() => {
    const observer = (isVisible: boolean) => {
      setVisible(isVisible);
    };
    LoaderService.subscribe(observer);
    return () => {
      LoaderService.unsubscribe(observer);
    };
  }, []);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.loaderContainer,
            { backgroundColor: theme.colors.card },
          ]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
});
