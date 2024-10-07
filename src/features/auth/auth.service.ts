import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { v4 as uuidv4 } from 'uuid';

import { User } from '../user/entities/user.entity';
import { AuthRegisterDto } from './dto/register.auth.dto';
import { generateHash, compareHash } from 'src/shared/utils/handleBycrip';
import { Role } from '../role/entities/roles.entity';
import { AuthLoginDto } from './dto/login.auth.dto';
import { UserRole } from 'src/shared/enum/roles.enum';
import { RevokedToken } from '../user/entities/revokedToken.entity';
import { PaymentProvider } from '../provider/entities/provider.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RevokedToken)
    private readonly refreshTokenRepository: Repository<RevokedToken>,

    @InjectRepository(PaymentProvider)
    private readonly providerRepository: Repository<PaymentProvider>,


    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    // 
    private readonly jwtService: JwtService,

  ) { }

  public async registerUser(userBody: AuthRegisterDto): Promise<User> {
    console.log('Registro de usuario - Datos recibidos:', userBody);

    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({ where: { email: userBody.email } });
    if (existingUser) {
      // console.log('Email ya registrado:', userBody.email);
      throw new BadRequestException('El email ya está en uso.');
    }

    try {
      // Encriptar la contraseña
      const hashedPassword = await generateHash(userBody.password);
      // console.log('Contraseña encriptada:', hashedPassword);

      // Verifica si el rol "user" existe, si no, lo crea
      let role = await this.roleRepository.findOne({ where: { name: UserRole.USER } });
      if (!role) {
        console.log('Rol user no encontrado, creando uno nuevo.');
        role = this.roleRepository.create({ name: UserRole.USER });
        await this.roleRepository.save(role);
      }

      // Crear nuevo usuario con la contraseña encriptada y asignar el rol de 'user'
      const newUser = this.userRepository.create({
        ...userBody,
        password: hashedPassword,
        roles: [role],
      });

      const savedUser = await this.userRepository.save(newUser);
      // console.log('Usuario guardado en la base de datos:', savedUser);

      return savedUser;
    } catch (error) {
      console.error('Error en registerUser:', error);
      throw new HttpException('Error al registrar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  public async registerUserProvider(userBody: AuthRegisterDto): Promise<{ message: string, provider: User }> {
    // console.log('Registro de proveedor - Datos recibidos:', userBody);

    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({ where: { email: userBody.email } });
    if (existingUser) {
      // console.log('Email ya registrado:', userBody.email);
      throw new BadRequestException('El email ya está en uso.');
    }

    let privateKey = null;
    let accessKey = null;

    try {
      // Encriptar la contraseña
      const hashedPassword = await generateHash(userBody.password);
      // console.log('Contraseña encriptada:', hashedPassword);

      // Verificar si el rol "provider" existe, si no, lo crea
      let role = await this.roleRepository.findOne({ where: { name: UserRole.PROVIDER } });
      if (!role) {
        // console.log('Rol provider no encontrado, creando uno nuevo.');
        role = this.roleRepository.create({ name: UserRole.PROVIDER });
        await this.roleRepository.save(role);
      }

      // Generar las claves privateKey y accessKey para el proveedor
      privateKey = uuidv4();
      accessKey = uuidv4();

      // Crear nuevo usuario con la contraseña encriptada y asignar el rol de 'provider'
      const newUser = this.userRepository.create({
        ...userBody,
        password: hashedPassword,
        roles: [role],
        privateKey,  // Asignar la privateKey generada
        accessKey,   // Asignar la accessKey generada
      });

      const savedUser = await this.userRepository.save(newUser);
      // console.log('Proveedor guardado en la base de datos:', savedUser);

      // Ahora crear un registro en la entidad 
      const newProvider = this.providerRepository.create({
        name: userBody.name,
        accountNumber: null, // Inicializarlo o generar un número de cuenta si es necesario
        status: 'active', // Estado inicial del proveedor
        type: 'person', // Aquí puedes definir el tipo o ajustarlo según el DTO
        privateKey: savedUser.privateKey, // Usar la misma privateKey generada para el user
        accessKey: savedUser.accessKey, // Usar la misma accessKey generada para el user
        createdBy: savedUser, // Asignar el mismo usuario creado,

      });

      await this.providerRepository.save(newProvider);
      // console.log('Registro del proveedor guardado en la entidad FundingProvider.');

      return { message: 'Proveedor registrado con éxito', provider: savedUser };
    } catch (error) {
      console.error('Error en registerUserProvider:', error);
      throw new HttpException('Error al registrar proveedor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async registerUserWithRole(
    userBody: AuthRegisterDto,
    roleName: UserRole,
    createdBy: { id: string; name: string; email: string; roles: any }
  ): Promise<User> {
    console.log('Registro de usuario - Datos recibidos:', userBody);
  
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({ where: { email: userBody.email } });
    if (existingUser) {
      console.log('Email ya registrado:', userBody.email);
      throw new BadRequestException('El email ya está en uso.');
    }
  
    try {
      // Encriptar la contraseña
      const hashedPassword = await generateHash(userBody.password);
      console.log('Contraseña encriptada:', hashedPassword);
  
      // Verifica si el rol existe, si no, lo crea
      let role = await this.roleRepository.findOne({ where: { name: roleName } });
      if (!role) {
        console.log(`Rol ${roleName} no encontrado, creando uno nuevo.`);
        role = this.roleRepository.create({ name: roleName });
        await this.roleRepository.save(role);
      }
  
      // Generar las claves privateKey y accessKey solo para los roles relevantes
      let privateKey = null;
      let accessKey = null;
      if ([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.PROVIDER].includes(roleName)) {
        privateKey = uuidv4();
        accessKey = uuidv4();
      }
  
      // Crear nuevo usuario con la contraseña encriptada, asignar el rol y las claves
      const newUser = this.userRepository.create({
        ...userBody,
        password: hashedPassword,
        roles: [role],
        createdBy: { id: createdBy.id, name: createdBy.name, email: createdBy.email },
        privateKey,  
        accessKey,   
      });
  
      const savedUser = await this.userRepository.save(newUser);
      console.log('Usuario guardado en la base de datos:', savedUser);
  
      // Excluir las claves de la respuesta si no deseas enviarlas al cliente
      // delete savedUser.privateKey;
      // delete savedUser.accessKey;
  
      return savedUser;
    } catch (error) {
      console.error('Error en registerUserWithRole:', error);
      throw new HttpException('Error al registrar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }




  }


  async loginUser(userLoginBody: AuthLoginDto) {
    try {
      const { password, email } = userLoginBody;
      console.log('Datos recibidos en loginUser:', userLoginBody);

      // Buscar el usuario por email, incluyendo los roles y permisos
      const userExist = await this.userRepository.findOne({
        where: { email },
        relations: ['roles', 'roles.permissions'],
      });

      if (!userExist) {
        console.log('Usuario no encontrado para el email:', email);
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      console.log('Usuario encontrado:', userExist);

      // Verificar la contraseña
      const isCheck = await compareHash(password, userExist.password);
      if (!isCheck) {
        console.log('Contraseña incorrecta para el usuario:', email);
        throw new HttpException('Contraseña incorrecta', HttpStatus.FORBIDDEN);
      }

      console.log('Contraseña verificada correctamente.');

      // Preparar el payload para el token
      const payload = { id: userExist.id, name: userExist.name };
      const token = this.jwtService.sign(payload);

      console.log('JWT generado:', token);

      const data = {
        token,
        id: userExist.id,
        email: userExist.email,
        roles: userExist.roles.map(role => ({
          name: role.name,
          permissions: role.permissions.map(permission => permission.name),
        })),
      };

      console.log('Datos devueltos en el login:', data);

      return data;

    } catch (error) {
      console.error('Error en loginUser:', error.message);
      throw new HttpException(
        error.message || 'Error en el servidor al iniciar sesión',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async currentUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }


  async logout(userId: string): Promise<{ message: string }> {
    try {
      await this.refreshTokenRepository.delete({ userId });
      return { message: 'Sesión cerrada con éxito' };
    } catch (error) {
      throw new HttpException('Error al cerrar sesión', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

