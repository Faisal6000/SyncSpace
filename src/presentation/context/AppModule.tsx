import React, { useEffect } from 'react';

/**
 * AppModule provider — sets up FCM foreground event subscriptions.
 * Currently a placeholder. When @react-native-firebase/messaging is installed,
 * add foreground message handling here:
 *
 * ```
 * useEffect(() => {
 *   const unsubscribe = messaging().onMessage(async remoteMessage => {
 *     // Handle foreground FCM message
 *   });
 *   return unsubscribe;
 * }, []);
 * ```
 */
export function AppModule({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // TODO: Subscribe to FCM foreground events when Firebase is configured
  }, []);

  return <>{children}</>;
}
