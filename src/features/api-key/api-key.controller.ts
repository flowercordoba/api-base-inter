import { Controller, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiKey } from './entities/api-key.entity';

@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  // generate
  @Post('generate-keys')
  @ApiOperation({ summary: 'Generar AccessKey y PrivateKey para un cliente' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        clientName: {
          type: 'string',
          description: 'Nombre del cliente para el que se generarán las claves',
          example: 'Client XYZ',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Claves generadas con éxito' })
  @ApiResponse({ status: 500, description: 'Error al generar las claves' })
  async generateKeys(@Body() generateAccessKeyDto: CreateApiKeyDto): Promise<ApiKey> {
    try {
      const keys = await this.apiKeyService.generatedKey(generateAccessKeyDto);
      return keys;
    } catch (error) {
      throw new HttpException('Error al generar las claves', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las API Keys' })
  @ApiResponse({ status: 200, description: 'Lista de todas las API Keys' })
  async getAllApiKeys(): Promise<ApiKey[]> {
    try {
      return await this.apiKeyService.getAllApiKeys();
    } catch (error) {
      throw new HttpException('Error al obtener las API Keys', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



}
