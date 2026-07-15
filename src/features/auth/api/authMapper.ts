import type { AuthUser, UserRole } from '@/entities/user';

import type { AuthUserDto, AuthUserRoleDto } from './auth.dto';

function mapAuthUserRoleDtoToUserRole(role: AuthUserRoleDto): UserRole {
  return role === 'ADMIN' ? 'admin' : 'member';
}

// provider는 /auth/me 응답에 없어, 로그인 콜백 시점에 알고 있던 값을 인자로 함께 받는다.
export function mapAuthUserDtoToAuthUser(dto: AuthUserDto, provider?: string): AuthUser {
  return {
    id: String(dto.id),
    name: dto.nickname,
    email: dto.email,
    provider,
    role: mapAuthUserRoleDtoToUserRole(dto.role),
  };
}
