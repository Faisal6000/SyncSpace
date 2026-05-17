export interface LoginData {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  user_id: string;
}
