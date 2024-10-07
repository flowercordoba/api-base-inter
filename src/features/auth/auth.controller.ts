import { Body, Controller, Get, Post, UseGuards,Req, HttpException, HttpStatus, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/register.auth.dto';
import { AuthLoginDto } from './dto/login.auth.dto';
import { JwtGuard } from './guards/auth.guard';
import { Request } from 'express';
import { UserRole } from 'src/shared/enum/roles.enum';
import { RoleGuard } from './guards/role.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('register')
  async handleRegister(@Body() registerBody: AuthRegisterDto) {
    try {
      console.log('Petición de registro recibida:', registerBody); 
      const user = await this.authService.registerUser(registerBody);
      return {
        message: 'Usuario registrado con éxito',
        user,
      };
    } catch (error) {
      console.error('Error durante el registro de usuario:', error);
      throw new HttpException('Error al registrar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  @UseGuards(JwtGuard, RoleGuard)
  @SetMetadata('roles', 'admin') 
  @Post('register-provider')
  async handleRegisterProvider(@Body() registerBody: AuthRegisterDto) {
    try {
      console.log('Petición de registro recibida:', registerBody); 
      const user = await this.authService.registerUserProvider(registerBody);
      return {
        message: 'provider registrado con éxito',
        user,
      };
    } catch (error) {
      console.error('Error durante el registro de provider:', error);
      throw new HttpException('Error al registrar provider', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
    
  @Post('login')
  async handleLogin(@Body() loginBody: AuthLoginDto) {
    try {
      console.log('Petición de loginBody recibida:', loginBody);
      const data = await this.authService.loginUser(loginBody);
      return {
        message: 'Inicio de sesión exitoso',
        data,
      };
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.message);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: error.message || 'Error al iniciar sesión',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  
  
  @UseGuards(JwtGuard, RoleGuard)
  @SetMetadata('roles', 'manager')  // <======== Solo los manager pueden registrar proveedores
  @Post('register-admin')
  async registerAdmin(@Req() req: Request, @Body() registerBody: AuthRegisterDto) {
    const currentUser = await this.userRepository.findOne({ where: { id: req.user.id }, relations: ['roles'] });  // Cargar el usuario completo desde la base de datos
  // console.log('=========>>>> pasandoi',currentUser.roles)
    if (!currentUser) {
      throw new HttpException('Usuario no encontrado', HttpStatus.UNAUTHORIZED);
    }
    
    try {
      // Registrar el nuevo proveedor, creado por el admin autenticado
      const provider = await this.authService.registerUserWithRole(registerBody, UserRole.ADMIN, currentUser);
      return {
        message: 'Proveedor registrado con éxito',
        provider,
      };
    } catch (error) {
      console.error('Error durante el registro del proveedor:', error);
      throw new HttpException('Error al registrar proveedor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
@UseGuards(JwtGuard)
@Get('current-user')
async currentUser(@Req() req: Request) {
  const user = req.user; 
  // console.log('Request', user);
  // console.log('Request user.roles', user.roles);

  if (!user) {
    return { message: 'Usuario no autenticado' };
  }

  // Llamada al servicio para obtener los detalles del usuario
  const userDetails = await this.authService.currentUser(user.id);
  if (!userDetails) {
    return { message: 'Usuario no encontrado' };
  }

  // Retornar los detalles del usuario, incluyendo accessKey y privateKey
  return {
    ...userDetails,
    accessKey: userDetails.accessKey,
    privateKey: userDetails.privateKey, // Retorna las claves
  };
}

@Post('logout')
@UseGuards(JwtGuard)  
async logout(@Req() req: Request) {
  try {
    console.log(`User ${req.user.id} ha cerrado sesión.`);

    return { message: 'Sesión cerrada con éxito' };
  } catch (error) {
    console.error('Error en el cierre de sesión:', error);
    throw new HttpException('Error al cerrar sesión', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

}
