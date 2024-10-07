import { Controller } from '@nestjs/common';
import { RolesService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RolesService) {}
}
