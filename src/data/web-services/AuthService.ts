import { HttpMethod } from '../../utils/network/HttpMethod';
import { ApiRequestConfigService } from '../../utils/network/NetworkResponse';

export class AuthService {
  static login(email: string, password: string): ApiRequestConfigService {
    return { method: HttpMethod.POST, url: 'auth/login', data: { email, password } };
  }

  static logout(): ApiRequestConfigService {
    return { method: HttpMethod.POST, url: 'auth/logout' };
  }
}
