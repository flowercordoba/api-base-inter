import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@Controller('seed')
@ApiTags('Seed') 
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('run')
  @ApiOperation({ summary: 'Generar registros de seed en la base de datos' }) // Descripción de la operación
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          description: 'Cantidad de registros a generar',
          example: 50,
        },
      },
    },
  }) // Descripción del cuerpo de la solicitud
  @ApiResponse({ status: 201, description: 'Seeding de registros completado con éxito' })
  @ApiResponse({ status: 500, description: 'Error al ejecutar el seed' })
  async runSeed(@Body('quantity') quantity: number) {
    try {
      await this.seedService.runSeed(quantity);
      return { message: `Seeding ${quantity} records complete!` };
    } catch (error) {
      console.error(error); // Imprime el error en la consola para más detalles
      throw new HttpException('Error al ejecutar el seed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
