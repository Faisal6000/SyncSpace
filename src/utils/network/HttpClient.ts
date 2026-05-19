import axios, { AxiosInstance } from 'axios';
import { NetworkResponse, NetworkResponseType, ApiRequestConfigService } from './NetworkResponse';
import { ApiConstants } from '../../domain/constants/ApiConstants';
import Application from '../../domain/application';

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: ApiConstants.BASE_URL,
      timeout: ApiConstants.API_TIMEOUT,
    });
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
