import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { EventListener, ToastData } from '../../../domain/services/EventListener';
import { useAppTheme } from '../../theme/useAppTheme';

export function ToastView() {
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const theme = useAppTheme();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = (data: ToastData | null) => {
      if (data) {
        setToastData(data);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start(() => setToastData(null));
        }, data.duration);
      }
    };
    EventListener.globalToastLD.subscribe(observer);
    return () => {
      EventListener.globalToastLD.unsubscribe(observer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [opacity]);

  if (!toastData) return null;

  const bgColor =
    toastData.type === 'success'
      ? theme.colors.success
      : toastData.type === 'error'
        ? theme.colors.error
        : toastData.type === 'warning'
          ? theme.colors.warning
          : theme.colors.info;

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor: bgColor }]}>
      <Text style={styles.text}>{toastData.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 24,
    right: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
