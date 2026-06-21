export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface TokenResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}
