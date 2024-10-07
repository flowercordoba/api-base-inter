import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProviderDto {
  @IsNotEmpty()
  @IsString()
  name: string;  // Nombre del proveedor

  
  @ApiProperty({ description: 'Email del cliente', example: 'cliente@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;  // Email del cliente


  @IsNotEmpty()
  @IsString()
  type: string;  // Tipo de proveedor ('bank', 'person', 'company')

  @IsNotEmpty()
  @IsString()
  accountNumber: string;  // Número de cuenta del proveedor

  @IsString()
  accessKey: string;  // Access Key para autenticar al proveedor

  @IsString()
  webhookUrl: string;  // URL para recibir notificaciones del proveedor
}
