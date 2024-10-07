import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  invoiceReference: string;  // Referencia de la factura

  @IsNotEmpty()
  @IsString()
  customerReference: string;  // Referencia del cliente

  @IsNotEmpty()
  @IsNumber()
  amount: number;  // Monto del pago


  @IsNotEmpty()
  @IsUUID()
  providerId: string;  // ID del proveedor seleccionado
}
