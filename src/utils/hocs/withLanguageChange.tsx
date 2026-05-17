import React from 'react';
import { useLanguageChange } from '../hooks/useLanguageChange';

export const withLanguageChange = <P extends object>(
  WrappedComponent: React.ComponentType<P & { currentAppLang: string }>,
) => {
  return function WithLanguageChange(props: P) {
    const currentAppLang = useLanguageChange();
    return <WrappedComponent {...props} currentAppLang={currentAppLang} />;
  };
};
