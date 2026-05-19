import { injectable } from 'inversify';
import { AuthRepository } from '../../domain/repository/AuthRepository';
import { NetworkResponse, NetworkResponseType } from '../../utils/network/NetworkResponse';
import { LoginData } from '../../domain/model/LoginData';

@injectable()
export class AuthRepositoryImpl implements AuthRepository {
  async login(email: string, _password: string): Promise<NetworkResponse<LoginData>> {
    // Mock: always succeeds
    await new Promise<void>(resolve => setTimeout(resolve, 800)); // Simulate latency
    return {
      responseType: NetworkResponseType.SUCCESS,
      response: {
        access_token: 'mock-token-abc123',
        expires_in: 3600,
        user_id: email,
      },
    };
  }

  async logout(): Promise<NetworkResponse<void>> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    return { responseType: NetworkResponseType.SUCCESS, response: undefined };
  }
}
