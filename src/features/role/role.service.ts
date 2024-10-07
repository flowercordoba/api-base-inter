export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
  MANAGER = 'manager',
  PROVIDER = 'provider',
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  // Inicializa los roles y permisos
  async initializeRolesAndPermissions() {
    console.log('Inicializando roles y permisos...');

    const permissionNames = [
      'create_user',
      'edit_user',
      'view_user',
      'view_payment',
      'manage_payment_methods',
      'view_integrations',
      'view_dashboard',
      'initiate_payment',
      'refund_payment',
      'manage_roles',
      'manage_permissions',
      'configure_integrations',
      'view_reports',

      // Nuevos permisos para proveedores de fondos
      'create_funding_provider',
      'view_funding_provider',
      'manage_funding_provider',

      // Permisos para API Keys
      'create_api_key',
      'view_api_key',
      'revoke_api_key',
      'rotate_api_key',

      // Permisos para Créditos
      'request_credit',
      'approve_credit',
      'reject_credit',
      'view_credit',
      'generate_credit_plan',
      'manage_credit',

      // Permisos para Retiros
      'create_withdrawal',
      'view_withdrawal',
      'confirm_withdrawal',
      'manage_withdrawal',

      // Permisos para Facturas (Invoices)
      'create_invoice',
      'view_invoice',
      'pay_invoice',
      'manage_invoice',

      // Nuevos permisos específicos del proveedor
      'view_provider_transactions',
      'confirm_payment',
      'view_provider_balance',
      'manage_provider_payments',
      'view_provider_invoices',
      'generate_invoice',
      'pay_invoice',
      'configure_webhook',
      'view_webhook_logs',
      'manage_provider_integrations',
      'view_provider_audit_logs',
    ];

    // Crea permisos si no existen
    for (const permissionName of permissionNames) {
      let permission = await this.permissionRepository.findOne({ where: { name: permissionName } });
      if (!permission) {
        permission = this.permissionRepository.create({ name: permissionName });
        await this.permissionRepository.save(permission);
      }
    }

    // Asigna permisos al rol "superadmin"
    await this.createRole(UserRole.SUPER_ADMIN, permissionNames);

    // Asigna permisos al rol "manager"
    await this.createRole(UserRole.MANAGER, permissionNames);

    // Asigna permisos al rol "admin"
    const adminPermissions = [
      'create_user',
      'edit_user',
      'view_user',
      'view_payment',
      'manage_payment_methods',
      'view_integrations',
      'view_dashboard',

      'create_funding_provider',
      'view_funding_provider',
      'create_api_key',
      'view_api_key',
      'request_credit',
      'view_credit',
      'create_invoice',
      'view_invoice',
    ];
    await this.createRole(UserRole.ADMIN, adminPermissions);

    // Asigna permisos al rol "user"
    const userPermissions = [
      'initiate_payment',
      'view_payment',
      'initiate_payment',
      'view_payment',
      'request_credit',
      'create_withdrawal',
      'view_invoice',
    ];
    await this.createRole(UserRole.USER, userPermissions);

    // Asigna permisos al rol "provider"
    const providerPermissions = [
      'view_provider_transactions',
      'confirm_payment',
      'view_provider_balance',
      'manage_provider_payments',
      'view_provider_invoices',
      'generate_invoice',
      'pay_invoice',
      'configure_webhook',
      'view_webhook_logs',
      'manage_provider_integrations',
      'view_provider_audit_logs',
    ];
    await this.createRole(UserRole.PROVIDER, providerPermissions);
  }

  // Crear un rol con permisos
  async createRole(roleName: string, permissionNames: string[]): Promise<Role> {
    let role = await this.roleRepository.findOne({ where: { name: roleName }, relations: ['permissions'] });
    if (!role) {
      role = this.roleRepository.create({ name: roleName });
    }

    const permissions = await this.permissionRepository.find({
      where: { name: In(permissionNames) },
    });

    role.permissions = permissions;
    return this.roleRepository.save(role);
  }

  async assignRole(userId: string, roleName: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['roles'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Verificar si el usuario ya tiene el rol asignado
    if (user.roles.some(existingRole => existingRole.id === role.id)) {
      throw new BadRequestException('User already has this role');
    }

    user.roles.push(role);
    await this.userRepository.save(user);
  }

  // Revocar un rol de un usuario
  async revokeRole(userId: string, roleName: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['roles'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Verificar si el usuario tiene el rol asignado
    const roleIndex = user.roles.findIndex(existingRole => existingRole.id === role.id);
    if (roleIndex === -1) {
      throw new BadRequestException('User does not have this role');
    }

    user.roles.splice(roleIndex, 1);
    await this.userRepository.save(user);
  }

  async updateRolePermissions(roleName: string, newPermissions: string[]): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { name: roleName }, relations: ['permissions'] });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissions = await this.permissionRepository.find({
      where: { name: In(newPermissions) },
    });

    role.permissions = permissions;
    return this.roleRepository.save(role);
  }

  async listAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async listAllRoles(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ['permissions'] });
  }
}
