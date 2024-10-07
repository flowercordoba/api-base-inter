import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentProvider } from './entities/provider.entity';
import { CreateProviderDto } from './dtos/create-provider.dto';
import { UpdateProviderDto } from './dtos/update-provider.dto';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(PaymentProvider)
    private readonly providerRepository: Repository<PaymentProvider>,
  ) {}

  // Método para crear un proveedor
//   async createProvider(
//     createProviderDto: CreateProviderDto,
//   ): Promise<PaymentProvider> {
//     // Crear una instancia de Provider con los datos recibidos
//     const newProvider = this.providerRepository.create(createProviderDto);

//     // Guardar el proveedor en la base de datos
//     await this.providerRepository.save(newProvider);

//     // Retornar el proveedor creado
//     return newProvider;
//   }
  async createProvider(
    createProviderDto: CreateProviderDto,
    user: any, // Usuario que está creando el proveedor
  ): Promise<PaymentProvider> {
    // Crear una instancia de Provider con los datos recibidos
    const newProvider = this.providerRepository.create({
      ...createProviderDto,
      createdBy: user, // Asignar el usuario creador al proveedor
    });
  
    // Guardar el proveedor en la base de datos
    await this.providerRepository.save(newProvider);
  
    // Retornar el proveedor creado
    return newProvider;
  }
  

  // Método para obtener todos los proveedores (opcional)
  async getAllProviders(): Promise<Partial<PaymentProvider>[]> {
    const providers = await this.providerRepository.find();
  
    // Excluir las claves privadas de todos los proveedores
    return providers.map(({ privateKey, accessKey, ...safeProvider }) => safeProvider);
  }
  

  // Método para actualizar un proveedor
  async updateProvider(
    providerId: string,
    updateProviderDto: UpdateProviderDto,
  ): Promise<PaymentProvider> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    Object.assign(provider, updateProviderDto);
    return await this.providerRepository.save(provider);
  }

  // Obtener detalles de un proveedor
//   async getProviderById(providerId: string): Promise<PaymentProvider> {
//     const provider = await this.providerRepository.findOne({
//       where: { id: providerId },
//     });

//     if (!provider) {
//       throw new NotFoundException('Proveedor no encontrado');
//     }

//     return provider;
//   }

  async getProviderById(providerId: string): Promise<Partial<PaymentProvider>> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
    });
  
    if (!provider) {
      throw new NotFoundException('Proveedor no encontrado');
    }
  
    // Crear un objeto excluyendo las claves privadas
    const { privateKey, accessKey, ...safeProvider } = provider;
    return safeProvider;
  }

  async getProviderKeys(providerId: string, userId: string): Promise<Partial<PaymentProvider>> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
    });
  
    if (!provider) {
      throw new NotFoundException('Proveedor no encontrado');
    }
  
    // Verificar si el usuario es el creador del proveedor
    if (provider.createdBy.id !== userId) {
      throw new UnauthorizedException('No tienes permiso para ver las credenciales de este proveedor');
    }
  
    // Retornar solo las claves
    return {
      privateKey: provider.privateKey,
      accessKey: provider.accessKey,
    };
  }
  
  

  // Método para eliminar un proveedor
  async deleteProvider(providerId: string): Promise<void> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    await this.providerRepository.remove(provider);
  }
}
