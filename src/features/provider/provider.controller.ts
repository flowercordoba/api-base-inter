import { Body, Controller, Delete, Get, Param, Patch, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateProviderDto } from './dtos/create-provider.dto';
import { PaymentProvider } from './entities/provider.entity';
import { JwtGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UpdateProviderDto } from './dtos/update-provider.dto';


@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @SetMetadata('roles', ['admin','manager','superAdmin'])
  @Post('create')
  async createProvider(@Body() createProviderDto: CreateProviderDto, @Req() req: any): Promise<PaymentProvider> {
    const user = req.user; 
    return this.providerService.createProvider(createProviderDto, user);
  }
  // Ruta para obtener todos los proveedores (opcional)

  @Get('all')
  async getAllProviders(): Promise<Partial<PaymentProvider>[]> {
    return this.providerService.getAllProviders();  
  }


  @UseGuards(JwtGuard)
  @Get(':providerId')
  async getProviderById(@Param('providerId') providerId: string): Promise<Partial<PaymentProvider>> {
    return this.providerService.getProviderById(providerId);  
  }

  @UseGuards(JwtGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'manager', 'superAdmin'])
  @Patch('update/:providerId')
  async updateProvider(
    @Param('providerId') providerId: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ): Promise<PaymentProvider> {
    return this.providerService.updateProvider(providerId, updateProviderDto);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'superAdmin']) // Tal vez quieras limitar la eliminación solo a ciertos roles
  @Delete('delete/:providerId')
  async deleteProvider(@Param('providerId') providerId: string): Promise<void> {
    return this.providerService.deleteProvider(providerId);
  }


  @UseGuards(JwtGuard)
  @Get(':providerId/keys')
  async getProviderKeys(@Param('providerId') providerId: string, @Req() req: any): Promise<any> {
    const userId = req.user.id; // Usuario autenticado
    return this.providerService.getProviderKeys(providerId, userId);
  }

}
