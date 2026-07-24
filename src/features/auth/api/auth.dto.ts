export type OAuthProviderId = 'kakao' | 'naver' | 'google';

export interface OAuthAuthorizationUrlDto {
  authorizationUrl: string;
}

export interface AccessTokenDto {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export type AuthUserRoleDto = 'USER' | 'ADMIN';

export interface AuthUserDto {
  id: number;
  email: string;
  nickname: string;
  role: AuthUserRoleDto;
}
