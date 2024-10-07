import { Injectable } from '@nestjs/common';
import { RolesService } from './features/role/role.service';

@Injectable()
export class AppService {
    constructor(private readonly rolesService: RolesService) {}

    async onModuleInit() {
        const roles = await this.rolesService.listAllRoles();
  
        // validacion si no existe los roles y permisos en la db, los crea y si no pues no para que?
        if (roles.length === 0) {
          await this.rolesService.initializeRolesAndPermissions();
          console.log('Roles and Permissions initialized');
        } else {
          console.log('Roles and Permissions already initialized');
        }
      }
}
