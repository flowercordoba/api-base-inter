import { Injectable } from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiKey } from './entities/api-key.entity';
import { Repository } from 'typeorm';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApiKeyService {

  constructor(
    @InjectRepository(ApiKey)
    private readonly clientKeyRepository: Repository<ApiKey>,
  ) {}

  // generar key
  async generatedKey(dto:CreateApiKeyDto):Promise<ApiKey>{

    const accessKey = uuidv4()
    const privateKey  = uuidv4()

    const clientKey = this.clientKeyRepository.create({
      clientName: dto.clientName,
      accessKey,
      privateKey,
    })

    return this.clientKeyRepository.save(clientKey);

  }
  async validateKeys(accessKey: string, privateKey: string): Promise<boolean> {
    console.log('AccessKey enviada:', accessKey.trim());
    console.log('PrivateKey enviada:', privateKey.trim());
  
    // Intentar encontrar una clave que coincida
    const clientKey = await this.clientKeyRepository.findOne({
      where: { accessKey: accessKey.trim(), privateKey: privateKey.trim() }
    });
  
    if (!clientKey) {
      console.error('No se encontraron claves que coincidan. AccessKey:', accessKey.trim(), 'PrivateKey:', privateKey.trim());
    } else {
      console.log('Claves válidas encontradas:', clientKey);
    }
  
    const isValid = !!clientKey;
    console.log('Resultado de la validación:', isValid); // Log adicional
    return isValid;
  }
  
  
  

  async validateAccessKey(accessKey: string): Promise<boolean> {
    console.log('Validating AccessKey:', accessKey); // Log para ver la clave que se está validando
    const client = await this.clientKeyRepository.findOne({ where: { accessKey } });

    if (!client) {
      console.error('AccessKey not found:', accessKey); // Log si no se encuentra la clave
    } else {
      console.log('AccessKey found:', client); // Log si se encuentra la clave
    }

    return !!client; // Retorna true si la AccessKey es válida
  }
  async getAllApiKeys(): Promise<ApiKey[]> {
    return this.clientKeyRepository.find();
  }

  async findApiKeyByKeys(accessKey: string, privateKey: string): Promise<ApiKey> {
    const apiKey = await this.clientKeyRepository.findOne({
      where: { accessKey: accessKey.trim(), privateKey: privateKey.trim() },
    });

    if (!apiKey) {
      console.error('ApiKey no encontrada para AccessKey:', accessKey, 'y PrivateKey:', privateKey);
      return null;
    }

    return apiKey;
  }
  

}
