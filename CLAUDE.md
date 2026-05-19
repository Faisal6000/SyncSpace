# SyncSpace — Coding Guidelines

> **Read this file before writing or modifying any code in this repository.**
> For project architecture, folder structure, DI setup, navigation, theming, and i18n patterns — read `ARCHITECTURE.md` first. This file covers **how to write code**, not how the project is structured.

---

## 1. Documentation & Comments (JSDoc)

Every exported function, method, class, interface, custom hook, use case, service, and utility **must** have a multiline JSDoc block. Never use a single-line `//` comment as a substitute for function documentation.

### Required tags
| Tag | When to include |
|---|---|
| `@param` | Every parameter, including its type and purpose |
| `@returns` | Any non-void return value |
| `@throws` | If the function can throw or reject |
| `@example` | Whenever usage is not immediately obvious |

### JSDoc examples

**Hook:**
```ts
/**
 * Returns the currently active language code from the Redux store.
 * Use this instead of importing useAppSelector directly in components.
 *
 * @returns {string} BCP-47 language code (e.g. "en", "ar")
 * @example
 * const lang = useLanguageChange(); // "en"
 */
export const useLanguageChange = (): string =>
  useAppSelector(state => state.language.currentLanguageCode);
```

**Service method:**
```ts
/**
 * Sends a POST request to the authentication endpoint and returns
 * the server response wrapped in a NetworkResponse.
 *
 * @param {LoginRequest} payload - User credentials (email + password)
 * @returns {Promise<NetworkResponse<LoginResponse>>} Resolved with token data on success
 * @throws {AxiosError} If the network request fails or the server returns 4xx/5xx
 * @example
 * const response = await authService.login({ email: 'a@b.com', password: 'secret' });
 */
async login(payload: LoginRequest): Promise<NetworkResponse<LoginResponse>> { ... }
```

**Utility function:**
```ts
/**
 * Formats a UTC ISO date string into a human-readable relative label
 * (e.g. "2 hours ago", "Yesterday").
 *
 * @param {string} isoDate - UTC date string in ISO 8601 format
 * @param {string} locale - BCP-47 locale string for localised output
 * @returns {string} Localised relative date label
 */
export function formatRelativeDate(isoDate: string, locale: string): string { ... }
```

**Class & interface:**
```ts
/**
 * Repository interface for authentication operations.
 * All implementations must be registered in the DI container.
 *
 * @interface IAuthRepository
 */
export interface IAuthRepository {
  /**
   * Authenticates a user and persists the session token.
   *
   * @param {LoginRequest} credentials - User login credentials
   * @returns {Promise<User>} The authenticated user entity
   */
  login(credentials: LoginRequest): Promise<User>;
}
```

**Rules:**
- Private/internal methods must also have JSDoc — they are documentation for future maintainers.
- Do not write comments that describe *what* the code does — write comments that explain *why* when non-obvious. JSDoc is the exception: always describe parameters and return values regardless.
- No multi-paragraph or wall-of-text JSDoc — be concise and factual.

---

## 2. Project Structure & Architecture

- Follow a **feature-based folder structure**. Each feature owns its components, hooks, styles, and constants. Shared logic lives in `src/utils/` or `src/domain/`.
- **Screens handle layout and orchestration only.** Business logic belongs in hooks, use cases (`src/domain/use-cases/`), or services (`src/data/web-services/`). No API calls, no data transformation, no complex conditionals inside a screen file.
- Anything used in **more than one feature** must be moved to a `shared/` or `common/` directory immediately. Duplication is not allowed.
- All navigation configuration must be centralised inside `src/presentation/navigation/`. Route definitions and navigator components are never defined inline inside screens.

---

## 3. Centralisation Rules

These rules are non-negotiable. Any value, component, hook, style, or utility that exists in more than one place must be extracted.

| What | Where |
|---|---|
| API base URL, endpoint paths, timeout, error codes | `src/domain/constants/ApiConstants.ts` |
| All colour, spacing, font, shadow, border values | `src/utils/theme/themes.ts` — consumed via `useAppTheme()` |
| Navigation route names | A single routes constants file — never raw strings |
| All user-facing text (labels, placeholders, headings) | `src/utils/strings/` (Proxy-based `Strings.*`) |
| Error messages, toast text, alert copy | Same as above — strings constants, not inline |
| Icon names, asset paths, image requires | A centralised assets constants file |
| Storage keys | `src/data/constants/StorageDataKeys.ts` |

**Never scatter these values inline.** A literal like `'#4F46E5'`, `30000`, `'HomeScreen'`, or `'Invalid credentials'` appearing directly in a component or hook is a guideline violation.

---

## 4. File & Component Size

- **Maximum 1000 lines per file.** If a file approaches this limit, split it before the PR is merged — not after.
- **Screen files should be under 300 lines.** Beyond 300 lines is a signal that logic must be extracted into hooks or sub-components.
- **One component, one responsibility.** If a component is handling both UI rendering and data fetching, split it into a container and a presentational component.

---

## 5. Performance Optimisation

- Wrap **all functions defined inside a component** with `useCallback`, especially those passed as props or used in `useEffect` dependencies.
- Wrap **expensive derived values** with `useMemo`. Do not recalculate on every render.
- Apply `React.memo` to **all pure/presentational components** that receive props. This is the default, not the exception.
- **Never define objects or arrays as inline props** (e.g. `style={{ marginTop: 10 }}`). Extract them outside the component or memoize them.
- Use `FlatList` or `FlashList` for **all data lists**. Never use `ScrollView` with `.map()` to render lists.
- Always provide a **stable `keyExtractor`** to list components. Never use the array index as a key.
- **Never use anonymous functions in `renderItem`** — extract and wrap with `useCallback`.
- Avoid deeply nested component trees. Flatten where possible to reduce reconciliation overhead.
- Use `InteractionManager.runAfterInteractions` for any heavy computation that must not block navigation animations.
- Lazy-load screens using dynamic imports where the navigation library supports it.

---

## 6. Hooks

- If the same `useState`/`useEffect` pattern appears in two components, extract it into a **custom hook immediately**.
- The following wrapper hooks already exist in `src/utils/hooks/` and **must** be used instead of importing the raw library directly anywhere in the codebase:
  - `useAppSelector` (wraps `useSelector`)
  - `useAppDispatch` (wraps `useDispatch`)
  - `useAppTheme` (wraps the theme context)
  - Custom navigation wrapper if defined — check before importing from `@react-navigation/native` directly
- Every `useEffect` must have a **clearly reasoned dependency array**. If the array is intentionally empty, add a comment explaining why (e.g. `// runs once on mount — subscribes to socket`).
- **Never perform side effects directly in the component body.** All side effects go inside `useEffect`.
- **Always clean up** subscriptions, event listeners, and timers in the `useEffect` return function. No exceptions.

```ts
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
  return () => subscription.remove(); // cleanup is mandatory
}, [handler]);
```

---

## 7. Styling

- **Every component and screen must have a dedicated `styles.ts` file.** Styles are never defined in the same file as the component. The pair is always:
  - `index.tsx` — component/screen logic and JSX
  - `styles.ts` — all `StyleSheet.create` definitions for that component/screen
- All styles must be defined using `StyleSheet.create`. **Inline style objects are not allowed** except for values that are genuinely runtime-dynamic and cannot be pre-computed.
- Dynamic style values (based on props or state) must be computed with `useMemo` inside the component and merged with the imported base style — not written as full inline objects on every render.
- **No magic numbers.** Spacing, font sizes, border radii, and colours must always reference the central theme accessed via `useAppTheme()`. The `styles.ts` file should accept the theme as a parameter or the component should merge dynamic theme-based styles at runtime.

**File structure:**
```
src/presentation/screens/Home/
├── index.tsx       ← component only
└── styles.ts       ← all StyleSheet.create definitions
```

**styles.ts:**
```ts
import { StyleSheet } from 'react-native';
import { CustomTheme } from '../../../utils/theme/CustomTheme';

export const createStyles = (theme: CustomTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 20,
      color: theme.colors.text,
    },
  });
```

**index.tsx:**
```ts
const theme = useAppTheme();
const styles = useMemo(() => createStyles(theme), [theme]);
```

**Wrong — never do this:**
```ts
// styles defined in the same file as the component
const styles = StyleSheet.create({ container: { flex: 1 } });

// or inline
return <View style={{ flex: 1, backgroundColor: '#0F172A' }} />;
```

---

## 8. State Management

- **Local UI state** (visibility toggles, input values, modal flags) stays in component-level `useState`.
- **Shared or cross-feature state** goes into the Redux store (`src/store/`). Do not prop-drill beyond one level.
- **Server state** (API data, loading, error) is managed via Redux slices with the existing slice pattern in `src/store/slices/` — not with ad-hoc `useState` pairs.
- Do **not** use manual `isLoading` / `isError` `useState` variables for API calls. Follow the existing slice pattern.
- **Never store derived data in the store.** Compute it via selectors or `useMemo` at the point of use.

---

## 9. API & Data Layer

- All API calls must go through `HttpClient` (`src/utils/network/HttpClient.ts`) via Web Service classes in `src/data/web-services/`. **No direct `fetch` or `axios` calls inside components or hooks.**
- Every API call must explicitly handle loading, success, and error states.
- All response types must be defined as TypeScript interfaces. **No `any` for API responses.**
- Retry logic, timeout configuration, and auth token injection are handled at the `HttpClient` level. **Never handle these per-call.**

```ts
// Correct — call through a web service
const response = await this.authService.login(credentials);

// Wrong — never call axios directly in a component or hook
const response = await axios.post('/auth/login', credentials);
```

---

## 10. TypeScript

- **Strict mode is enabled.** No `any`, no `as any`, no `@ts-ignore` without a written justification comment explaining why it cannot be avoided.
- All component props must have an explicitly defined `interface` or `type`.
- All function parameters and return types must be explicitly typed. Do not rely on implicit `any` from untyped parameters.
- Fields with a fixed set of possible values must use an `enum` or a `const` object with `as const`.

```ts
// Correct
export const ThemePreference = { LIGHT: 'light', DARK: 'dark', SYSTEM: 'system' } as const;
export type ThemePreference = typeof ThemePreference[keyof typeof ThemePreference];

// Wrong
const preference = 'light'; // raw string with no type constraint
```

---

## 11. Naming Conventions

These supplement the conventions in `ARCHITECTURE.md`.

| Entity | Convention | Example |
|---|---|---|
| Components | `PascalCase` | `UserProfileCard` |
| Hooks | `camelCase` prefixed with `use` | `useUserProfile` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| Files | Match primary export name exactly | `UserProfileCard.tsx` |
| Boolean props/vars | Prefix `is`, `has`, or `should` | `isLoading`, `hasError`, `shouldShowModal` |
| Interfaces | Prefix with `I` for DI-registered types | `IAuthRepository` |
| Types | `PascalCase`, no `I` prefix | `LoginRequest`, `NetworkResponse` |

---

## 12. Error Handling

- All screens must be wrapped in an **Error Boundary** at the navigator level — not per-screen.
- Every async operation must have a `try/catch` or `.catch()`. **Silent failures are not acceptable.**
- User-facing errors must always produce **visible feedback** — a toast, an inline error message, or a modal. Never fail silently.
- Errors in production builds must be logged to a crash reporting service (e.g. Sentry). Local `console.error` is acceptable in development only.

```ts
try {
  await repository.login(credentials);
} catch (error) {
  // Log to crash reporter in production
  dispatch(setAuthError(Strings.errors.loginFailed));
}
```

---

## 13. Navigation

- **Never use `navigation.navigate` with a raw string.** Always use route name constants defined in the centralised routes file.
- Navigation params must contain **serialisable data only** — no functions, no class instances, no component references.
- Deep link configuration must be defined centrally in `src/presentation/navigation/` — never per-screen.

```ts
// Correct
navigation.navigate(Routes.HOME);

// Wrong
navigation.navigate('HomeScreen');
```

---

## 14. Testing

- Every utility function and custom hook must have a **unit test**.
- Critical user flows (login, registration, primary actions) must have **integration or E2E test coverage**.
- Component tests must test **behaviour**, not implementation details. Do not test internal state directly — test what the user sees and interacts with.

---

## 15. Code Quality & Review Checklist

Before submitting or merging any PR, verify:

- [ ] ESLint and Prettier pass with zero errors (enforced via pre-commit hooks)
- [ ] No commented-out code
- [ ] No inline magic numbers, raw colour values, or hardcoded strings
- [ ] No raw strings used for navigation route names
- [ ] All new functions/hooks/methods have JSDoc
- [ ] All async paths handle errors explicitly
- [ ] No `any` types introduced
- [ ] No new `useState` pairs for API loading/error state — use the slice pattern
- [ ] Styles are in a dedicated `styles.ts` file — not defined in the component file
- [ ] `StyleSheet.create` used for all styles
- [ ] `useCallback` applied to all functions passed as props
- [ ] `React.memo` applied to all new pure components
- [ ] File does not exceed 1000 lines; screen does not exceed 300 lines
- [ ] Every `useEffect` has a dependency array with a comment if empty
- [ ] All new user-facing strings are in the strings constants file

---

> Violations of these guidelines must be fixed before a PR is merged — not treated as follow-up work.
