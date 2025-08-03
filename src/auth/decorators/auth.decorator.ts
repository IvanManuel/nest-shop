
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

// El modelo de la funcion está en la documentación oficial de NestJS
export function Auth(...roles: ValidRoles[]) {

  return applyDecorators(
    // Este se puede usar para definir roles específicos
    // SetMetadata('roles', roles),
    // Utilizaremos el custom decorator que reemplaza el SetMetadata
    RoleProtected( ...roles ),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
