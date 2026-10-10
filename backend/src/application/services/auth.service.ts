import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

// Entidades e Interfaces
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { PasswordResetEntity } from '../../infrastructure/entities/password-reset.entity';
import { RegisterUserDto } from '../../infrastructure/dtos/register-user.dto';
import {
  AuthResponse,
  UserPayload,
} from '../interfaces/auth-response.interface';

/**
 * @class AuthService
 * @description Servicio core de FlockApp para la gestión de identidad, cifrado y recuperación de cuentas.
 * Centraliza la lógica de autenticación permitiendo el acceso mediante múltiples identificadores.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  /**
   * @constructor
   * @param userRepository Persistencia de perfiles de usuario.
   * @param passwordResetRepository Almacén de seguridad efímero para OTP y tokens.
   * @param jwtService Generador de tokens de sesión y recuperación.
   * @param mailerService Motor de notificaciones salientes.
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PasswordResetEntity)
    private readonly passwordResetRepository: Repository<PasswordResetEntity>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * @method register
   * @description Crea un nuevo usuario tras validar unicidad de email/username y cifrar credenciales.
   * @param {RegisterUserDto} registerDto Datos de registro validados por el controlador.
   * @returns {Promise<UserPayload>} Perfil de usuario filtrado sin información sensible.
   * @throws {BadRequestException} Si el correo o el nombre de usuario ya están en uso.
   */
  async register(registerDto: RegisterUserDto): Promise<UserPayload> {
    const { email, username, password } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new BadRequestException(
        'El correo o el nombre de usuario ya existen.',
      );
    }

    this.logger.debug(`Registering user: ${email}`);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      id: savedUser.id,
      email: savedUser.email,
      firstName: savedUser.firstName || '',
      lastName: savedUser.lastName || '',
      username: savedUser.username,
      role: savedUser.role,
      avatarUrl: savedUser.avatarUrl || undefined,
      coverUrl: savedUser.coverUrl || undefined,
      department: savedUser.department || undefined,
      municipality: savedUser.municipality || undefined,
    };
  }

  /**
   * @method login
   * @description Autentica usuarios validando el identificador contra los campos email y username.
   * @param {string} identifier Nombre de usuario o correo electrónico proporcionado.
   * @param {string} pass Contraseña en texto plano para comparar con el hash almacenado.
   * @returns {Promise<AuthResponse>} Objeto que contiene el token JWT y los datos del perfil.
   * @throws {UnauthorizedException} Si el usuario no existe o la contraseña es incorrecta.
   */
  async login(identifier: string, pass: string): Promise<AuthResponse> {
    // Búsqueda dual: Intentamos encontrar al usuario por email O por username
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
      select: [
        'id',
        'password',
        'role',
        'firstName',
        'lastName',
        'email',
        'username',
        'avatarUrl',
        'coverUrl',
        'department',
        'municipality',
      ],
    });

    this.logger.debug(`Login attempt for identifier: ${identifier}`);
    this.logger.debug(`User found: ${user ? user.email : 'NOT FOUND'}`);
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);
      this.logger.debug(`Bcrypt match result: ${isMatch}`);
      if (!isMatch) {
        throw new UnauthorizedException('Credenciales inválidas.');
      }
    } else {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl || undefined,
        coverUrl: user.coverUrl || undefined,
        department: user.department || undefined,
        municipality: user.municipality || undefined,
      },
    };
  }

  /**
   * @method forgotPassword
   * @description Fase 1: Genera y persiste un OTP de 6 dígitos con validez de 15 minutos.
   * @param {string} email Correo electrónico donde se enviará el código de recuperación.
   * @returns {Promise<{ success: boolean }>} Confirmación de que el proceso se inició correctamente.
   */
  async forgotPassword(email: string): Promise<{ success: boolean }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return { success: true };

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await this.passwordResetRepository.delete({ email });
    const resetRequest = this.passwordResetRepository.create({
      email,
      otp,
      expiresAt,
    });
    await this.passwordResetRepository.save(resetRequest);

    await this.sendOtpEmail(email, otp);
    return { success: true };
  }

  /**
   * @method verifyOtp
   * @description Fase 2: Valida la integridad del código OTP y emite un token de recuperación temporal.
   * @param {string} email Correo del solicitante.
   * @param {string} otp Código de 6 dígitos ingresado por el usuario.
   * @returns {Promise<{ recoveryToken: string }>} Token firmado que autoriza el cambio de clave.
   * @throws {UnauthorizedException} Si el código es incorrecto o ya ha expirado.
   */
  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ recoveryToken: string }> {
    const resetEntry = await this.passwordResetRepository.findOne({
      where: { email, otp, isUsed: false },
    });

    if (!resetEntry || new Date() > resetEntry.expiresAt) {
      throw new UnauthorizedException('Código inválido o expirado.');
    }

    const recoveryToken = this.jwtService.sign(
      { email, purpose: 'recovery' },
      { expiresIn: '10m' },
    );

    resetEntry.recoveryToken = recoveryToken;
    await this.passwordResetRepository.save(resetEntry);

    return { recoveryToken };
  }

  /**
   * @method resetPassword
   * @description Fase 3: Valida el token de recuperación y actualiza la contraseña del usuario de forma definitiva.
   * @param {string} email Correo asociado a la cuenta.
   * @param {string} password Nueva contraseña a establecer.
   * @param {string} recoveryToken Token de autorización obtenido en la fase anterior.
   * @returns {Promise<{ message: string }>} Confirmación del éxito de la operación.
   * @throws {UnauthorizedException} Si el token es inválido, manipulado o ya utilizado.
   */
  async resetPassword(
    email: string,
    password: string,
    recoveryToken: string,
  ): Promise<{ message: string }> {
    try {
      this.jwtService.verify(recoveryToken);
    } catch {
      throw new UnauthorizedException(
        'Token de recuperación inválido o expirado.',
      );
    }

    const resetEntry = await this.passwordResetRepository.findOne({
      where: { email, recoveryToken, isUsed: false },
    });

    if (!resetEntry) throw new UnauthorizedException('Acceso no autorizado.');

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    user.password = await bcrypt.hash(password, 10);
    await this.userRepository.save(user);

    resetEntry.isUsed = true;
    await this.passwordResetRepository.save(resetEntry);

    return { message: 'Contraseña actualizada con éxito.' };
  }

  /**
   * @method sendOtpEmail
   * @description Genera el contenido HTML y utiliza el MailerService para enviar el OTP.
   * @param {string} email Dirección de destino.
   * @param {string} otp Código generado.
   * @returns {Promise<void>}
   * @private
   */
  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Código de Recuperación - FlockApp',
      html: `
        <div style="font-family: sans-serif; text-align: center; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
          <h2 style="color: #108346;">FlockApp: Plumas y Cantos de Colombia</h2>
          <p>Tu código de seguridad para restablecer tu cuenta es:</p>
          <div style="font-size: 36px; font-weight: 800; color: #108346; letter-spacing: 6px; margin: 25px 0;">
            ${otp}
          </div>
          <p style="font-size: 13px; color: #666;">Este código expira en 15 minutos. No compartas este número con nadie.</p>
        </div>
      `,
    });
  }
}
