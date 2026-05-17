/**
 * Global TypeScript declarations.
 */

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'react-native-config' {
  export interface NativeConfig {
    [name: string]: string | undefined;
  }

  export const Config: NativeConfig;
  export default Config;
}
