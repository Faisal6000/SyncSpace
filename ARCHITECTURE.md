# Architecture Documentation

> **Single source of truth** for understanding and replicating the architecture of this React Native project.
> Any AI reading only this file should be able to set up an identical new project.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Folder & File Structure](#folder--file-structure)
3. [Naming Conventions](#naming-conventions)
4. [App Entry Point & Bootstrap](#app-entry-point--bootstrap)
5. [Navigation Architecture](#navigation-architecture)
6. [Dependency Injection](#dependency-injection)
7. [API Layer (3-Layer Pattern)](#api-layer-3-layer-pattern)
8. [Local Storage](#local-storage)
9. [State Management](#state-management)
10. [String Localization (i18n)](#string-localization-i18n)
11. [Color Scheme & Theming](#color-scheme--theming)
12. [Reusable Patterns & Base Classes](#reusable-patterns--base-classes)
13. [TypeScript Conventions](#typescript-conventions)
14. [Testing](#testing)
15. [Cross-Cutting Concerns](#cross-cutting-concerns)
16. [Layer Communication Map](#layer-communication-map)

---

## Tech Stack

| Concern                  | Library / Tool                                         |
|--------------------------|--------------------------------------------------------|
| Framework                | React Native 0.79, React 19                            |
| Language                 | TypeScript 4.8 (strict mode + decorators)              |
| Navigation               | `@react-navigation/native` + stack + bottom-tabs       |
| State Management         | `@reduxjs/toolkit` + `react-redux` + `redux-persist`   |
| Dependency Injection     | `inversify` v6 + `reflect-metadata`                    |
| HTTP Client              | `axios` v1.4                                           |
| WebSocket                | `socket.io-client` v4                                  |
| Persistence (KV)         | `@react-native-async-storage/async-storage`            |
| Persistence (Relational) | `react-native-sqlite-storage`                          |
| Push Notifications       | `@react-native-firebase/messaging` + `@notifee/react-native` |
| Theming                  | Redux `themeSlice` + `useAppTheme()` hook (light/dark/system) |
| i18n                     | Custom Proxy-based implementation with CDN + bundled fallback |
| UI Kit                   | `react-native-paper` + `react-native-vector-icons`     |
| Bottom Sheet             | `@gorhom/bottom-sheet`                                 |
| Gestures                 | `react-native-gesture-handler`                         |
| Charts                   | `victory-native`                                       |
| Media                    | `react-native-image-picker`, `react-native-fs`, `react-native-vision-camera` |
| Testing                  | `jest` + `@testing-library/react-native`               |
| Linting / Formatting     | `eslint` + `prettier`                                  |
| Config (env vars)        | `react-native-config`                                  |

---

## Folder & File Structure

```
src/
├── acl/                             # Access Control Layer
│   ├── Acl.tsx                      # Declarative ACL gate component
│   ├── permissions.ts               # Permission check functions
│   ├── policies.ts                  # ACL policy definitions
│   ├── useAcl.ts                    # Hook for ACL checks
│   ├── index.ts                     # Barrel export
│   └── __tests__/
│
├── assets/                          # Static assets (images, SVGs, JSON data)
│
├── data/                            # DATA LAYER
│   ├── constants/
│   │   └── StorageDataKeys.ts       # AsyncStorage / SQLite key constants
│   ├── repository/                  # Concrete repository implementations
│   │   ├── AuthRepositoryImpl.ts
│   │   ├── AppRepositoryImpl.ts
│   │   ├── InboxRepositoryImpl.ts
│   │   └── ...                      # One file per domain area
│   └── web-services/                # API endpoint builders (static config factories)
│       ├── InboxService.ts
│       ├── AuthService.ts
│       ├── AutomationService.ts
│       └── ...                      # One file per domain area
│
├── di/                              # DEPENDENCY INJECTION
│   ├── inversify.config.ts          # Container setup, all bindings
│   └── types.ts                     # TYPES symbol map
│
├── store/                           # REDUX STORE
│   ├── index.ts                     # configureStore, RootState, AppDispatch, persistor
│   ├── hooks.ts                     # Typed useAppDispatch + useAppSelector
│   └── slices/
│       ├── authSlice.ts             # isAuthenticated, loginData, profileData
│       ├── themeSlice.ts            # preference: 'light' | 'dark' | 'system'
│       └── languageSlice.ts         # currentLanguageCode: string
│
├── domain/                          # DOMAIN LAYER
│   ├── application/
│   │   └── index.ts                 # Thin singleton: localizedStrings cache + store accessors
│   ├── constants/
│   │   ├── ApiConstants.ts          # Base URLs, timeouts, error codes
│   │   └── AttachmentTypes.ts
│   ├── model/                       # TypeScript interfaces / data models
│   │   ├── LoginData.ts
│   │   ├── ProfileData.ts
│   │   └── ...                      # One file per model
│   ├── repository/                  # Abstract repository interfaces
│   │   ├── AuthRepository.ts
│   │   ├── InboxRepository.ts
│   │   └── ...
│   ├── services/
│   │   ├── EventListener.ts         # Global event bus (LiveData instances)
│   │   └── NavigationService.ts     # Imperative navigation helpers
│   └── use-cases/                   # Business logic interactors
│       ├── GetChats.ts
│       ├── GetDashboardCounts.ts
│       └── ...
│
├── presentation/                    # PRESENTATION LAYER
│   ├── constants/
│   │   ├── AppConstants.ts          # Flavor constants, feature flags
│   │   └── UIConfiguration.ts       # Layout constants
│   ├── context/                     # React Context providers (minimal — most state is in Redux)
│   │   ├── AppContext.tsx           # Keyboard height listener only
│   │   └── AppModule.tsx            # FCM foreground event handlers
│   ├── dialogs/
│   │   └── index.tsx                # Portal for global modal/dialog rendering
│   ├── navigation/
│   │   ├── AppNavigator.tsx         # ROOT: auth-gate, selects Auth or Main navigator
│   │   ├── AuthNavigator.tsx        # Unauthenticated screens (Login, Register, etc.)
│   │   ├── MainNavigator.tsx        # Authenticated screens (all app features)
│   │   ├── NavigationContainer.tsx  # Navigation container wrapper with ref
│   │   └── routes.ts                # NavigationScreen enum (all route name constants)
│   └── screens/                     # Feature screen folders
│       ├── splash/
│       ├── login/
│       ├── home/
│       ├── inbox/
│       └── ...                      # One folder per feature
│
├── types/                           # Global TypeScript declarations (*.d.ts)
│
└── utils/                           # CROSS-CUTTING UTILITIES
    ├── animations/
    │   ├── SlideLeftRightTransition.ts
    │   └── SlideRightLeftTransition.ts
    ├── components/                  # Reusable UI components
    │   ├── alert/
    │   ├── button/
    │   ├── loader/
    │   ├── toast-view/
    │   └── ...                      # One folder per shared component
    ├── custom-classes/
    │   ├── LiveData.ts              # Observable<T> subclass with current-value
    │   └── Event.ts                 # Single-consumption event wrapper
    ├── extensions/                  # Pure utility functions
    │   ├── DateTimeFormatting.ts
    │   ├── StringFormatting.ts
    │   ├── StringValidations.ts
    │   └── NotificationUtils.ts
    ├── hocs/
    │   └── withLanguageChange.tsx   # HOC: injects currentAppLang prop
    ├── hooks/
    │   └── useLanguageChange.ts     # Hook: subscribes to language LiveData
    ├── network/
    │   ├── HttpClient.ts            # Axios wrapper (the single HTTP entry point)
    │   ├── NetworkResponse.ts       # NetworkResponse<T> type + NetworkResponseType enum
    │   ├── HttpMethod.ts            # GET | POST | PUT | PATCH | DELETE enum
    │   ├── ErrorMessageHandler.ts   # Maps technical errors → user-friendly messages
    │   └── socket/                  # Socket.io wrapper
    ├── storage/
    │   ├── LocalStorageService.ts   # AsyncStorage singleton + change listeners
    │   ├── SqliteDatabase.ts        # SQLite singleton with CRUD helpers
    │   └── StorageChangeListener.ts # Listener type definition
    ├── strings/                     # i18n
    │   ├── localizedStrings.ts      # Proxy-based string accessor (main export)
    │   ├── LanguageManager.ts       # Language set/get + storage persistence
    │   ├── PossibleLanguages.ts     # Enum of supported language codes
    │   ├── LocaleUtils.ts           # Device locale → app language mapping
    │   └── locales/
    │       └── en.json              # Bundled English fallback
    ├── theme/
    │   ├── ThemeWrapper.tsx         # Reads themeSlice from Redux, provides resolved theme
    │   ├── useAppTheme.ts           # Hook: useSelector → resolves CustomTheme object
    │   ├── CustomTheme.ts           # Extended Theme type definition
    │   ├── themes.ts                # lightTheme and darkTheme objects
    │   └── interpolateTheme.ts      # Animated value interpolation for theme transitions
    └── values/                      # App-wide constants (colors, sizes, etc.)
```

---

## Naming Conventions

| Entity                        | Convention       | Example                              |
|-------------------------------|------------------|--------------------------------------|
| React components / screens    | PascalCase       | `LoginScreen.tsx`, `ToastView.tsx`   |
| Hooks                         | camelCase + `use` prefix | `useLanguageChange.ts`       |
| Utility / extension files     | PascalCase       | `DateTimeFormatting.ts`              |
| HOC files                     | camelCase + `with` prefix | `withLanguageChange.tsx`    |
| Folders (non-component)       | kebab-case       | `web-services/`, `custom-classes/`   |
| Folders (component / screen)  | kebab-case       | `toast-view/`, `login/`              |
| Interfaces                    | PascalCase, no `I` prefix | `InboxRepository`, `LoginData` |
| Enums                         | PascalCase       | `NavigationScreen`, `HttpMethod`     |
| Constants (primitive values)  | UPPER_SNAKE_CASE | `API_TIMEOUT`, `STORAGE_KEY_TOKEN`   |
| DI type symbols               | camelCase key in `TYPES` object | `TYPES.AuthRepository`  |
| Model files                   | PascalCase + `Model` suffix when wrapping API shapes | `MessageUsersModel.ts` |

---

## App Entry Point & Bootstrap

### `index.js`
Registers the root component and initializes FCM background/quit-state message handlers **before** any React component mounts.

```js
// index.js
import 'reflect-metadata';              // Must be first — required by inversify decorators
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Handle background FCM messages here (before UI loads)
});

AppRegistry.registerComponent(appName, () => App);
```

> `reflect-metadata` **must** be imported before any inversify decorators are evaluated.

### `App.tsx`
Composes all providers in the correct order and renders the root navigator.

```tsx
// App.tsx
export default function App() {
  return (
    <Provider store={store}>            {/* Redux store — must be outermost */}
      <PersistGate loading={null} persistor={persistor}>  {/* Wait for store rehydration */}
        <AppModule>                     {/* FCM foreground event listeners */}
          <SafeAreaProvider>
            <ThemeWrapper>              {/* Reads themeSlice, resolves CustomTheme */}
              <ContextProvider>         {/* Keyboard height listener */}
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <BottomSheetModalProvider>
                    <NavigationContainerWrapper>
                      <AppNavigator />
                      <AppLoader />     {/* Global loader overlay */}
                      <ToastView />     {/* Global toast notifications */}
                    </NavigationContainerWrapper>
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
```

**Provider responsibility summary:**

| Provider                   | Responsibility                                                        |
|----------------------------|-----------------------------------------------------------------------|
| `Provider`                 | Makes Redux store available to all components                         |
| `PersistGate`              | Delays rendering until persisted Redux state is rehydrated            |
| `AppModule`                | Subscribes to FCM foreground messages, routes alerts                  |
| `SafeAreaProvider`         | Insets for notch / home-bar safe areas                                |
| `ThemeWrapper`             | Reads `themeSlice` preference from Redux, resolves `CustomTheme`      |
| `ContextProvider`          | Keyboard height listener (the only remaining Context)                 |
| `GestureHandlerRootView`   | Required root for gesture-handler library                             |
| `BottomSheetModalProvider` | Portal target for `@gorhom/bottom-sheet` modals                       |
| `NavigationContainerWrapper` | React Navigation root with navigation ref                           |

> **Why `PersistGate loading={null}`?** `AppNavigator` uses `useSelector` to read `isAuthenticated`. If the store hasn't rehydrated yet, the selector returns `false` (the slice's initial value), causing an incorrect flash of the Auth navigator. `PersistGate` prevents rendering until the persisted slice values are loaded — `AppNavigator` then sees the correct auth state immediately.

---

## Navigation Architecture

### 3-Navigator Structure

```
AppNavigator  (Root)
│   Reads auth state from Application singleton on mount.
│   Shows either AuthNavigator or MainNavigator reactively.
│
├── AuthNavigator   (Stack)
│   Shown when user is NOT authenticated.
│   Screens: Splash → Login → Register → ForgotPassword → ResetPassword
│
└── MainNavigator   (Stack + Tabs + nested Stacks)
    Shown when user IS authenticated.
    ├── HomeScreen (Bottom Tab Navigator)
    │   ├── DashboardTab
    │   ├── MessagesTab
    │   └── ContactsTab
    └── Feature stacks pushed on top of tabs:
        ├── Chat stack
        ├── Profile stack
        ├── Teams stack
        ├── Analytics stack
        ├── Automation stacks (WhatsApp, Facebook, Instagram, Telegram)
        ├── Settings stack
        └── ... (one stack per feature area)
```

### Auth-Gate Logic in `AppNavigator`

`AppNavigator` reads auth state directly from Redux. No `useEffect`, no subscriptions, no loading state — `PersistGate` ensures the store is rehydrated before this component renders.

```tsx
// src/presentation/navigation/AppNavigator.tsx
export default function AppNavigator() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
}
```

When the user logs in, the screen dispatches `loginSuccess(data)` to the Redux store. `isAuthenticated` becomes `true`, `AppNavigator` re-renders, and `MainNavigator` is shown — no manual event emitting required.

### Route Name Constants

All screen names live in a single enum to prevent magic strings:

```ts
// src/presentation/navigation/routes.ts
export enum NavigationScreen {
  Login = 'Login',
  Register = 'Register',
  ForgotPassword = 'ForgotPassword',
  Home = 'Home',
  Chat = 'Chat',
  // ... one entry per screen
}
```

### Screen Param Types

```ts
// src/presentation/navigation/routes.ts (continued)
export type RootStackParamList = {
  [NavigationScreen.Login]: undefined;
  [NavigationScreen.Chat]: { conversationId: string };
  // ... one entry per screen
};
```

### Custom Transitions

```ts
// src/utils/animations/SlideLeftRightTransition.ts
export const SlideLeftRightTransition: TransitionPreset = { /* ... */ };

// Usage in navigator:
<Stack.Screen
  name={NavigationScreen.Chat}
  component={ChatScreen}
  options={SlideLeftRightTransition}
/>
```

### Imperative Navigation (outside React tree)

```ts
// src/domain/services/NavigationService.ts
import { createNavigationContainerRef } from '@react-navigation/native';
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(screen: NavigationScreen, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(screen as never, params as never);
  }
}
```

---

## Dependency Injection

**Library:** `inversify` v6 + `reflect-metadata`

### Type Symbols

```ts
// src/di/types.ts
export const TYPES = {
  AuthRepository:          Symbol.for('AuthRepository'),
  InboxRepository:         Symbol.for('InboxRepository'),
  AppRepository:           Symbol.for('AppRepository'),
  UserRepository:          Symbol.for('UserRepository'),
  AutomationRepository:    Symbol.for('AutomationRepository'),
  AnalyticsRepository:     Symbol.for('AnalyticsRepository'),
  AgentRepository:         Symbol.for('AgentRepository'),
  NetworkRepository:       Symbol.for('NetworkRepository'),
  // use cases
  GetChats:                Symbol.for('GetChats'),
  GetDashboardCounts:      Symbol.for('GetDashboardCounts'),
  // ... one symbol per injectable
};
```

### Container Configuration

```ts
// src/di/inversify.config.ts
import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

const container = new Container();

// Repository bindings: abstract interface → concrete implementation
container.bind<AuthRepository>(TYPES.AuthRepository)
  .to(AuthRepositoryImpl).inSingletonScope();

container.bind<InboxRepository>(TYPES.InboxRepository)
  .to(InboxRepositoryImpl).inSingletonScope();

// Use case bindings
container.bind<GetChats>(TYPES.GetChats)
  .to(GetChats).inSingletonScope();

export { container };
```

### Consuming Dependencies

```ts
// In any class:
import { container } from '../../di/inversify.config';
import { TYPES } from '../../di/types';

@injectable()
export class InboxRepositoryImpl implements InboxRepository {
  private userRepository = container.get<UserRepository>(TYPES.UserRepository);
  // ...
}
```

> All bindings are **Singleton scope** — one shared instance per container lifetime.

---

## API Layer (3-Layer Pattern)

The API layer is split into three distinct responsibilities:

```
Component / UseCase
      │
      ▼
[Layer 3] Repository Interface  (domain/repository/)
      │  Abstract contract — no HTTP knowledge
      ▼
[Layer 2] Repository Implementation  (data/repository/)
      │  Delegates to web-service config factories
      ▼
[Layer 1] Web Service (Static Config Factory)  (data/web-services/)
      │  Returns ApiRequestConfigService — no HTTP calls here
      ▼
HttpClient  (utils/network/HttpClient.ts)
      │  Single Axios instance — executes requests, handles auth headers
      ▼
Backend API
```

### Layer 1 — Web Service (Config Factory)

Returns a plain config object; performs **no HTTP call**.

```ts
// src/data/web-services/InboxService.ts
import { HttpMethod } from '../../utils/network/HttpMethod';
import { ApiRequestConfigService } from '../../utils/network/NetworkResponse';

export class InboxService {
  static getMessageUsers(
    data: object,
    atlasSearch = false,
  ): ApiRequestConfigService {
    return {
      method: HttpMethod.POST,
      url: atlasSearch ? 'inbox/users/atlas-search' : 'inbox/users',
      data,
    };
  }

  static getConversationMessages(
    conversationId: string,
    page: number,
  ): ApiRequestConfigService {
    return {
      method: HttpMethod.GET,
      url: `inbox/conversations/${conversationId}/messages`,
      params: { page, limit: 50 },
    };
  }
}
```

### Layer 2 — Repository Implementation

Bridges domain interface ↔ HTTP client.

```ts
// src/data/repository/InboxRepositoryImpl.ts
import { injectable } from 'inversify';
import { httpClient } from '../../utils/network/HttpClient';
import { InboxService } from '../web-services/InboxService';
import { InboxRepository } from '../../domain/repository/InboxRepository';
import { NetworkResponse } from '../../utils/network/NetworkResponse';
import { MessageUsersModel } from '../../domain/model/MessageUsersModel';

@injectable()
export class InboxRepositoryImpl implements InboxRepository {
  async getMessageUsers(data: object): Promise<NetworkResponse<MessageUsersModel>> {
    return httpClient.apiRequest<MessageUsersModel>(
      InboxService.getMessageUsers(data),
    );
  }
}
```

### Layer 3 — Repository Interface

```ts
// src/domain/repository/InboxRepository.ts
import { NetworkResponse } from '../../utils/network/NetworkResponse';
import { MessageUsersModel } from '../model/MessageUsersModel';

export interface InboxRepository {
  getMessageUsers(data: object): Promise<NetworkResponse<MessageUsersModel>>;
  // ... all methods for this domain area
}
```

### HttpClient

```ts
// src/utils/network/HttpClient.ts
import axios, { AxiosInstance } from 'axios';
import { NetworkResponse, NetworkResponseType, ApiRequestConfigService } from './NetworkResponse';
import { Application } from '../../domain/application';

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({ baseURL: ApiConstants.BASE_URL, timeout: API_TIMEOUT });
  }

  async apiRequest<T>(config: ApiRequestConfigService): Promise<NetworkResponse<T>> {
    try {
      const response = await this.client.request({
        method: config.method,
        url: config.url,
        data: config.data,
        params: config.params,
        headers: {
          Authorization: `Bearer ${Application.getAccessToken()}`,
          'Content-Type': 'application/json',
          ...config.headers,
        },
      });
      return { responseType: NetworkResponseType.SUCCESS, response: response.data };
    } catch (error: any) {
      const isApiError = error.response !== undefined;
      return {
        responseType: isApiError
          ? NetworkResponseType.API_ERROR
          : NetworkResponseType.UNKNOWN_ERROR,
        response: error.response?.data ?? error,
      };
    }
  }
}

export const httpClient = new HttpClient();
```

### Network Response Types

```ts
// src/utils/network/NetworkResponse.ts
export enum NetworkResponseType {
  SUCCESS = 'SUCCESS',
  API_ERROR = 'API_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface NetworkResponse<T> {
  responseType: NetworkResponseType;
  response: T;
}

export interface ApiRequestConfigService {
  method: HttpMethod;
  url: string;
  data?: object;
  params?: object;
  headers?: Record<string, string>;
}
```

### Use Cases (Optional Interactor Layer)

For complex operations involving multiple repositories or business rules:

```ts
// src/domain/use-cases/GetChats.ts
import { injectable } from 'inversify';
import { container } from '../../di/inversify.config';
import { TYPES } from '../../di/types';

@injectable()
export class GetChats {
  private inboxRepository = container.get<InboxRepository>(TYPES.InboxRepository);

  async execute(filters: ChatFilters, page = 1): Promise<NetworkResponse<ChatsDataModel>> {
    return this.inboxRepository.getChats({ ...filters, page, limit: 50 });
  }
}
```

---

## Local Storage

Two persistence mechanisms exist for different use cases.

### AsyncStorage — Key-Value Store

```ts
// src/utils/storage/LocalStorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageChangeListener } from './StorageChangeListener';

class LocalStorageService {
  private static instance: LocalStorageService;
  private listeners: Set<StorageChangeListener<any>> = new Set();

  static getInstance(): LocalStorageService {
    if (!this.instance) this.instance = new LocalStorageService();
    return this.instance;
  }

  async setData<T>(key: string, data: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    this.listeners.forEach(cb => cb(key, data));
  }

  async getData<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  subscribeToChanges<T>(callback: StorageChangeListener<T>): void {
    this.listeners.add(callback);
  }

  unsubscribeFromChanges<T>(callback: StorageChangeListener<T>): void {
    this.listeners.delete(callback);
  }
}

export const localStorageService = LocalStorageService.getInstance();
```

**Storage Keys** are defined in one place:

```ts
// src/data/constants/StorageDataKeys.ts
export const StorageDataKeys = {
  AUTH_TOKEN:       '@auth_token',
  USER_PROFILE:     '@user_profile',
  LANGUAGE_CODE:    '@language_code',
  THEME_PREFERENCE: '@app_theme',
} as const;
```

### SQLite — Relational / Offline Cache

```ts
// src/utils/storage/SqliteDatabase.ts
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

class SqliteDatabaseService {
  private static instance: SqliteDatabaseService;
  private db: SQLiteDatabase | null = null;
  private listeners: Set<(tableName: string) => void> = new Set();

  static getInstance(): SqliteDatabaseService {
    if (!this.instance) this.instance = new SqliteDatabaseService();
    return this.instance;
  }

  async init(): Promise<void> {
    this.db = await SQLite.openDatabase({ name: 'app.db', location: 'default' });
  }

  async createTable(tableName: string): Promise<void> { /* ... */ }
  async insert(tableName: string, data: object): Promise<void> { /* ... */ }
  async query<T>(tableName: string, where?: object): Promise<T[]> { /* ... */ }
  async delete(tableName: string, where: object): Promise<void> { /* ... */ }
}

export const sqliteDb = SqliteDatabaseService.getInstance();
```

---

## State Management

The app uses a **3-tier state system**:

| Tier | Tool | What it holds |
|------|------|---------------|
| 1 | **Redux Toolkit** | Persistent global state (auth, theme preference, language) |
| 2 | **EventListener / LiveData** | One-shot events (toasts, socket triggers) that are not state |
| 3 | **Application Singleton** | CDN-fetched localized strings cache; thin store accessor |

React Context is no longer used for language or theme — those are Redux slices. The only remaining Context is `AppContext` for keyboard height.

---

### Tier 1 — Redux Toolkit (Global State)

#### Store Setup

```ts
// src/store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authReducer } from './slices/authSlice';
import { themeReducer } from './slices/themeSlice';
import { languageReducer } from './slices/languageSlice';

const rootReducer = combineReducers({
  auth:     authReducer,
  theme:    themeReducer,
  language: languageReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'theme', 'language'],  // All three slices are persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
```

#### Typed Hooks

```ts
// src/store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

#### Auth Slice

```ts
// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginData } from '../../domain/model/LoginData';
import { ProfileData } from '../../domain/model/ProfileData';

interface AuthState {
  isAuthenticated: boolean;
  loginData: LoginData | null;
  profileData: ProfileData | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loginData: null,
  profileData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<LoginData>) {
      state.isAuthenticated = true;
      state.loginData = action.payload;
    },
    setProfileData(state, action: PayloadAction<ProfileData>) {
      state.profileData = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.loginData = null;
      state.profileData = null;
    },
  },
});

export const { loginSuccess, setProfileData, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
```

#### Theme Slice

```ts
// src/store/slices/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemePreference } from '../../utils/theme/CustomTheme';

interface ThemeState {
  preference: ThemePreference;
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { preference: 'system' } as ThemeState,
  reducers: {
    setThemePreference(state, action: PayloadAction<ThemePreference>) {
      state.preference = action.payload;
    },
  },
});

export const { setThemePreference } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
```

#### Language Slice

```ts
// src/store/slices/languageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  currentLanguageCode: string;
}

const languageSlice = createSlice({
  name: 'language',
  initialState: { currentLanguageCode: 'en' } as LanguageState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.currentLanguageCode = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const languageReducer = languageSlice.reducer;
```

#### Usage in Screens

```tsx
// Login screen — dispatching after successful auth
const dispatch = useAppDispatch();

const handleLogin = async () => {
  LoaderService.show();
  const result = await authRepository.login(email, password);
  LoaderService.dismiss();

  if (result.responseType === NetworkResponseType.SUCCESS) {
    dispatch(loginSuccess(result.response));  // → isAuthenticated = true → AppNavigator switches
  } else {
    EventListener.showErrorToast(ErrorMessageHandler.getDisplayMessage());
  }
};

// Home screen — dispatching logout
const dispatch = useAppDispatch();
const handleLogout = () => dispatch(logout());   // → isAuthenticated = false → AuthNavigator shown

// Any component — reading state
const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
const langCode        = useAppSelector(state => state.language.currentLanguageCode);
```

---

### Tier 2 — EventListener (One-Shot Event Bus)

`EventListener` holds `LiveData` instances **only for events that are not persistent state** — things that fire and are consumed, not things that have a lasting value. If something needs to survive re-renders or app restarts, it belongs in Redux, not here.

```ts
// src/domain/services/EventListener.ts
export class EventListener {
  // Events — not state
  static readonly globalToastLD     = new LiveData<ToastData | null>(null);
  static readonly navigateToChatLD  = new LiveData<Event<string>>(new Event(''));
  static readonly reloadInboxLD     = new LiveData<Event<boolean>>(new Event(false));

  static showSuccessToast(message: string, duration = 3000): void {
    this.globalToastLD.setValue({ message, type: 'success', duration });
  }

  static showErrorToast(message: string, duration = 3000): void {
    this.globalToastLD.setValue({ message, type: 'error', duration });
  }
}
```

> **What moved to Redux vs. what stayed in EventListener:**
> - Auth state, theme preference, language code → **Redux** (persistent, selector-driven)
> - Toast notifications, in-flight navigation triggers, socket events → **EventListener** (fire-and-forget)

The `LiveData` and `Event<T>` classes remain unchanged:

```ts
// src/utils/custom-classes/LiveData.ts
export class Observable<T> {
  protected observers: ((value: T) => void)[] = [];
  subscribe(observer: (value: T) => void): void { this.observers.push(observer); }
  unsubscribe(observer: (value: T) => void): void {
    this.observers = this.observers.filter(o => o !== observer);
  }
  protected notify(value: T): void { this.observers.forEach(o => o(value)); }
}

export class LiveData<T> extends Observable<T> {
  constructor(private value: T) { super(); }
  getValue(): T { return this.value; }
  setValue(newValue: T): void { this.value = newValue; this.notify(newValue); }
  override subscribe(observer: (value: T) => void): void {
    super.subscribe(observer);
    observer(this.value);  // Emit current value immediately on subscribe
  }
}

// src/utils/custom-classes/Event.ts
export class Event<T> {
  private consumed = false;
  constructor(private readonly content: T) {}
  getContentIfNotHandled(): T | null {
    if (this.consumed) return null;
    this.consumed = true;
    return this.content;
  }
}
```

---

### Tier 3 — Application Singleton (Thin Accessor)

The singleton is now much lighter. Auth and language state live in Redux. The singleton's only job is:
1. Holding the CDN-fetched localized strings map (too large for Redux).
2. Providing a synchronous `getAccessToken()` for non-React code (e.g., `HttpClient`).

```ts
// src/domain/application/index.ts
import { store } from '../../store';

export default class Application {
  private static instance: Application;
  private localizedStrings: LocalizedStringsMap = {};

  static getInstance(): Application {
    if (!this.instance) this.instance = new Application();
    return this.instance;
  }

  // Reads synchronously from Redux store — safe in non-React code
  static getAccessToken(): string {
    return store.getState().auth.loginData?.access_token ?? '';
  }

  // Used by the localizedStrings Proxy — reads from Redux store synchronously
  static getCurrentLanguageCode(): string {
    return store.getState().language.currentLanguageCode;
  }

  static getLocalizedStrings(): LocalizedStringsMap {
    return this.getInstance().localizedStrings;
  }

  static setLocalizedStrings(strings: LocalizedStringsMap): void {
    this.getInstance().localizedStrings = strings;
  }
}
```

---

### State Flow Diagram

```
User action (e.g. login, language change, theme toggle)
        │
        ▼
dispatch(actionCreator(payload))    ← Redux action
        │
        ▼
Slice reducer updates store state   ← Immer-based immutable update
        │
        ▼
redux-persist serializes to AsyncStorage  (async, background)
        │
        ▼
useAppSelector subscribers re-render ← Only components that select changed state
```

**For events (toast, navigation trigger):**
```
Non-React code (repository, use case)
        │
        ▼
EventListener.showErrorToast()      ← Sets globalToastLD value
        │
        ▼
ToastView component (subscriber) re-renders
```

---

## String Localization (i18n)

### Architecture

Strings come from two sources, resolved in priority order:
1. **CDN** — remote JSON files per language code, fetched on launch and cached.
2. **Bundled** — `src/utils/strings/locales/en.json`, always available as fallback.

Access pattern uses a **JavaScript Proxy** so consumers call `Strings.some_key` — the proxy intercepts the property access and resolves the correct language at call time (no re-imports needed when language changes).

### Proxy Implementation

```ts
// src/utils/strings/localizedStrings.ts
import { Application } from '../../domain/application';
import en from './locales/en.json';

type LocalizedStrings = typeof en;
type LocalizedStringsMap = Record<string, LocalizedStrings>;

const Strings = new Proxy({} as LocalizedStrings, {
  get(_target, prop: string) {
    const lang = Application.getCurrentLanguageCode();
    const allStrings = Application.getLocalizedStrings() as LocalizedStringsMap;

    const strings =
      allStrings?.[lang] ??
      allStrings?.['en'] ??
      (en as LocalizedStrings);          // Bundled fallback

    return strings?.[prop as keyof LocalizedStrings] ?? (en as LocalizedStrings)[prop as keyof LocalizedStrings];
  },
});

export default Strings;
```

### Usage in Components

```tsx
import Strings from '../../../utils/strings/localizedStrings';

// Direct property access — proxy handles language resolution at runtime
<Text>{Strings.welcome_message}</Text>
<Button title={Strings.login_button} />
```

### Language Change Flow

```
User selects language "fr"
  → dispatch(setLanguage('fr'))               // Redux action
  → languageSlice updates store + redux-persist serializes to AsyncStorage
  → useAppSelector(state => state.language.currentLanguageCode) re-renders consumers
  → Next Strings.* access → Proxy calls Application.getCurrentLanguageCode()
                           → reads store.getState().language.currentLanguageCode → 'fr'
                           → returns French string
```

### Supported Languages

```ts
// src/utils/strings/PossibleLanguages.ts
export enum PossibleLanguages {
  English  = 'en',
  Spanish  = 'es',
  French   = 'fr',
  Arabic   = 'ar',
  // ... add as needed
}
```

---

## Color Scheme & Theming

### Theme Preference

Supports three modes: `'light'`, `'dark'`, `'system'` (follows device setting).

### Theme Type

```ts
// src/utils/theme/CustomTheme.ts
import { Theme } from '@react-navigation/native';

export type ThemePreference = 'light' | 'dark' | 'system';

export type CustomTheme = Theme & {
  isDark: boolean;
  preference: ThemePreference;
  colors: Theme['colors'] & {
    // Surfaces
    background: string;
    backgroundSecondary: string;
    card: string;
    // Text
    text: string;
    textSecondary: string;
    textHint: string;
    textInverse: string;
    // UI elements
    primary: string;
    primaryLight: string;
    divider: string;
    border: string;
    // Input
    inputBackground: string;
    inputBorder: string;
    inputText: string;
    placeholder: string;
    // Status
    success: string;
    error: string;
    warning: string;
    info: string;
    // Chat bubbles
    bubbleSent: string;
    bubbleReceived: string;
    bubbleSentText: string;
    bubbleReceivedText: string;
    // Navigation
    tabBarBackground: string;
    tabBarActive: string;
    tabBarInactive: string;
  };
};
```

### Theme Values

```ts
// src/utils/theme/themes.ts

export const commonColors = {
  primary:    '#4F46E5',   // Indigo 600
  primaryLight:'#818CF8',  // Indigo 400
  success:    '#10B981',   // Emerald 500
  error:      '#EF4444',   // Red 500
  warning:    '#F59E0B',   // Amber 500
  info:       '#3B82F6',   // Blue 500
};

export const lightTheme: CustomTheme = {
  dark: false,
  isDark: false,
  preference: 'light',
  colors: {
    ...commonColors,
    background:          '#F9FAFB',
    backgroundSecondary: '#F3F4F6',
    card:                '#FFFFFF',
    text:                '#111827',
    textSecondary:       '#374151',
    textHint:            '#9CA3AF',
    textInverse:         '#FFFFFF',
    divider:             '#E5E7EB',
    border:              '#D1D5DB',
    inputBackground:     '#FFFFFF',
    inputBorder:         '#D1D5DB',
    inputText:           '#111827',
    placeholder:         '#9CA3AF',
    bubbleSent:          '#4F46E5',
    bubbleReceived:      '#F3F4F6',
    bubbleSentText:      '#FFFFFF',
    bubbleReceivedText:  '#111827',
    tabBarBackground:    '#FFFFFF',
    tabBarActive:        '#4F46E5',
    tabBarInactive:      '#9CA3AF',
    // React Navigation required
    primary:   '#4F46E5',
    notification: '#EF4444',
  },
};

export const darkTheme: CustomTheme = {
  dark: true,
  isDark: true,
  preference: 'dark',
  colors: {
    ...commonColors,
    background:          '#0F172A',
    backgroundSecondary: '#1E293B',
    card:                '#1E293B',
    text:                '#F1F5F9',
    textSecondary:       '#CBD5E1',
    textHint:            '#64748B',
    textInverse:         '#0F172A',
    divider:             '#334155',
    border:              '#475569',
    inputBackground:     '#1E293B',
    inputBorder:         '#334155',
    inputText:           '#F1F5F9',
    placeholder:         '#64748B',
    bubbleSent:          '#4F46E5',
    bubbleReceived:      '#1E293B',
    bubbleSentText:      '#FFFFFF',
    bubbleReceivedText:  '#F1F5F9',
    tabBarBackground:    '#1E293B',
    tabBarActive:        '#818CF8',
    tabBarInactive:      '#64748B',
    primary:   '#4F46E5',
    notification: '#EF4444',
  },
};
```

### ThemeWrapper & Hook

Theme preference is stored in `themeSlice` (Redux). `ThemeWrapper` reads it, resolves the `CustomTheme` object, and passes it to `NavigationContainer` via its `theme` prop. No React Context needed.

```tsx
// src/utils/theme/ThemeWrapper.tsx
export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const preference = useAppSelector(state => state.theme.preference);
  const systemDark = useColorScheme() === 'dark';
  const resolvedTheme = resolveTheme(preference, systemDark);  // returns lightTheme or darkTheme

  return (
    // Pass resolved theme to NavigationContainer so nav elements (headers, tabs) auto-theme
    <NavigationContainer theme={resolvedTheme} ref={navigationRef}>
      {children}
    </NavigationContainer>
  );
}
```

```ts
// src/utils/theme/useAppTheme.ts
import { useColorScheme } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { resolveTheme } from './themes';

export const useAppTheme = (): CustomTheme => {
  const preference = useAppSelector(state => state.theme.preference);
  const systemDark = useColorScheme() === 'dark';
  return resolveTheme(preference, systemDark);
};
```

Dispatching a theme change:
```ts
dispatch(setThemePreference('dark'));  // redux-persist handles storage automatically
```

### Consuming Theme in Components

```tsx
const MyComponent = () => {
  const theme = useAppTheme();   // Re-renders only when themeSlice changes
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Hello</Text>
    </View>
  );
};
```

---

## Reusable Patterns & Base Classes

### Custom Hook — Language Change

Now a thin `useAppSelector` wrapper. No `useEffect`, no manual subscription.

```ts
// src/utils/hooks/useLanguageChange.ts
import { useAppSelector } from '../../store/hooks';

export const useLanguageChange = (): string =>
  useAppSelector(state => state.language.currentLanguageCode);
```

### HOC — Language Change

Unchanged in usage. Internally now uses the Redux-backed hook.

```tsx
// src/utils/hocs/withLanguageChange.tsx
export const withLanguageChange = <P extends object>(
  WrappedComponent: React.ComponentType<P & { currentAppLang: string }>,
) => {
  return function WithLanguageChange(props: P) {
    const currentAppLang = useLanguageChange();   // reads from Redux via selector
    return <WrappedComponent {...props} currentAppLang={currentAppLang} />;
  };
};
```

### ACL Gate Component

```tsx
// src/acl/Acl.tsx
interface AclProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Acl = ({ permission, children, fallback = null }: AclProps) => {
  const { hasPermission } = useAcl();
  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
};

// Usage:
<Acl permission="inbox:delete">
  <DeleteButton />
</Acl>
```

### Service Locator Pattern (UI Services)

Global UI services that can be triggered from anywhere (including non-React code).

```ts
// Pattern: static class with internal EventEmitter or LiveData
export class LoaderService {
  private static visibleLD = new LiveData<boolean>(false);

  static show(): void { this.visibleLD.setValue(true); }
  static dismiss(): void { this.visibleLD.setValue(false); }
  static subscribe(cb: (visible: boolean) => void) { this.visibleLD.subscribe(cb); }
  static unsubscribe(cb: (visible: boolean) => void) { this.visibleLD.unsubscribe(cb); }
}
```

### Error Message Handler

```ts
// src/utils/network/ErrorMessageHandler.ts
export class ErrorMessageHandler {
  static getDisplayMessage(errorMessage?: string): string {
    if (!errorMessage) return Strings.generic_error;
    if (this.isDnsResolutionError(errorMessage)) return Strings.no_internet_connection;
    if (this.isSlowInternetError(errorMessage)) return Strings.slow_internet;
    return errorMessage;
  }

  static isDnsResolutionError(msg: string): boolean {
    return msg.toLowerCase().includes('network error') ||
           msg.toLowerCase().includes('enotfound');
  }
}
```

---

## TypeScript Conventions

### Strict Mode

`tsconfig.json` enables: `strict`, `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `noImplicitOverride`, `experimentalDecorators`, `emitDecoratorMetadata`.

### Model Files

Each domain entity gets its own file in `src/domain/model/`:

```ts
// src/domain/model/LoginData.ts
export interface LoginData {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  user_id: string;
}
```

### Repository Interface Convention

```ts
// src/domain/repository/AuthRepository.ts
import { NetworkResponse } from '../../utils/network/NetworkResponse';
import { LoginData } from '../model/LoginData';

export interface AuthRepository {
  login(email: string, password: string): Promise<NetworkResponse<LoginData>>;
  logout(): Promise<NetworkResponse<void>>;
  refreshToken(): Promise<NetworkResponse<LoginData>>;
}
```

### BaseModel

All API response objects extend `BaseModel` for safe indexing:

```ts
// src/domain/model/BaseModel.ts
export interface BaseModel {
  [key: string]: any;
}
```

---

## Testing

- **Framework:** Jest + `@testing-library/react-native`
- **Location:** `__tests__/` folders co-located with source files
- **Unit tests:** For repositories, use cases, utilities (mock `httpClient`)
- **DI tests:** `src/di/__tests__/` — verify container bindings resolve correctly

---

## Cross-Cutting Concerns

### Global Toast

```ts
EventListener.showSuccessToast('Saved successfully');
EventListener.showErrorToast('Something went wrong');
```

`ToastView` component (in the root provider tree) subscribes to `EventListener.globalToastLD` and renders accordingly.

### Global Loader

```ts
LoaderService.show();    // Show fullscreen spinner
LoaderService.dismiss(); // Hide spinner
```

### Navigation from Non-Component Code

```ts
import { navigate } from '../../domain/services/NavigationService';
navigate(NavigationScreen.Chat, { conversationId: '123' });
```

---

## Layer Communication Map

```
┌──────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                           │
│                                                                   │
│  Screens                                                          │
│    ├── useAppSelector(state => state.auth.*)  ← reads Redux      │
│    ├── dispatch(loginSuccess / logout / etc.) ← writes Redux     │
│    ├── useAppTheme()                          ← reads themeSlice  │
│    ├── useLanguageChange()                    ← reads langSlice   │
│    └── EventListener.show*Toast()            ← fire-and-forget   │
└───────────────────────┬──────────────────────────────────────────┘
                        │ calls repositories / use cases
┌───────────────────────▼──────────────────────────────────────────┐
│                       DOMAIN LAYER                                │
│                                                                   │
│  UseCases → Repository Interfaces                                 │
│  Application.getAccessToken() → store.getState().auth            │
│  Application.getCurrentLanguageCode() → store.getState().language│
│  EventListener.globalToastLD.setValue() ← event notification     │
└───────────────────────┬──────────────────────────────────────────┘
                        │ implements / delegates to
┌───────────────────────▼──────────────────────────────────────────┐
│                       DATA LAYER                                  │
│                                                                   │
│  RepositoryImpl → WebService → HttpClient → Axios                │
│  RepositoryImpl → LocalStorageService / SqliteDb                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       REDUX STORE                                 │
│  authSlice · themeSlice · languageSlice                          │
│  Persisted to AsyncStorage via redux-persist                     │
│  Read by any layer via store.getState() (outside React)          │
│  Read by components via useAppSelector (inside React)            │
└──────────────────────────────────────────────────────────────────┘
```

**Rule:** Dependencies only flow **downward** (Presentation → Domain → Data). The Redux store is a shared data bus — any layer may read from it but only Presentation components dispatch actions.
