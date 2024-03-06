export interface JwtPayload {
  email?: string;
  id: string;
  type: 'token' | 'refresh';
}
