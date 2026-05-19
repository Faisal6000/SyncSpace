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
  method: string;
  url: string;
  data?: object;
  params?: object;
  headers?: Record<string, string>;
}
