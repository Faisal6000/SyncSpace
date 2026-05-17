export const ApiConstants = {
  BASE_URL: 'https://api.example.com/v1/',
  API_TIMEOUT: 30000,
  ERROR_CODES: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },
} as const;
