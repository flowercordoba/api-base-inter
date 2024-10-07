import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyService } from 'src/features/api-key/api-key.service';

@Injectable()
export class AccessKeyGuard implements CanActivate {
  constructor(private readonly authService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    console.log('Authorization header:', authHeader); // Log para ver si el header Authorization existe

    if (!authHeader) {
      console.error('AccessKey missing'); // Log en caso de que falte el header Authorization
      throw new HttpException('AccessKey missing', HttpStatus.UNAUTHORIZED);
    }

    // El formato esperado es: Bearer <AccessKey>
    const accessKey = authHeader.split(' ')[1];
    console.log('Extracted AccessKey:', accessKey); // Log para ver si se está extrayendo bien el AccessKey

    const isValid = await this.authService.validateAccessKey(accessKey);

    console.log('Is AccessKey valid?:', isValid); // Log para verificar si la clave es válida o no

    if (!isValid) {
      console.error('Invalid AccessKey'); // Log en caso de que la clave sea inválida
      throw new HttpException('Invalid AccessKey', HttpStatus.UNAUTHORIZED);
    }

    return true; // Si la AccessKey es válida, permitimos el acceso
  }
}
