import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles permitidos desde los metadatos
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    // console.log('____getRoleMeta_______', requiredRoles);

    if (!requiredRoles) {
      return true; // Si no se requiere ningún rol, permitir acceso
    }

    const req = context.switchToHttp().getRequest();
    const { roles } = req.user;
     // Asegurarse de que req.user existe y tiene los roles
    // console.log('_____ROLES___DATA', req.user);
    // console.log('_____ROLES___', roles);

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasRole = roles.some(role => requiredRoles.includes(role.name));
    
    if (!hasRole) {
      // console.log('El usuario no tiene el rol requerido');
      throw new ForbiddenException('Forbidden resource'); // Denegar acceso
    }

    return true; // Permitir acceso si al menos uno de los roles coincide
  }
}
