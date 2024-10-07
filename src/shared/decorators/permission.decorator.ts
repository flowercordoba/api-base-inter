import { SetMetadata } from '@nestjs/common';

// Renombramos el decorador a SetPermissions
export const SetPermissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
