import { NetworkResponse } from '../../utils/network/NetworkResponse';
import { LoginData } from '../model/LoginData';

export interface AuthRepository {
  login(email: string, password: string): Promise<NetworkResponse<LoginData>>;
  logout(): Promise<NetworkResponse<void>>;
}
