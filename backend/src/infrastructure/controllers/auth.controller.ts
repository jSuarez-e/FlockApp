import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { RsaService } from '../security/rsa.service';
import {
  AuthResponse,
  UserPayload,
} from '../../application/interfaces/auth-response.interface';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginDto } from '../dtos/login.dto';

/**
 * @class AuthController
 * @description Expone los servicios de autenticación y gestión de credenciales.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rsaService: RsaService,
  ) {}

  @Get('public-key')
  getPublicKey(): { publicKey: string } {
    return { publicKey: this.rsaService.getPublicKey() };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto): Promise<UserPayload> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return await this.authService.login(loginDto.identifier, loginDto.password);
  }

  /**
   * @method forgotPassword
   * @description Fase 1: Genera el código OTP y lo envía al usuario.
   * @param {string} email - Correo destino.
   * @returns {Promise<{ success: boolean }>} Confirmación de proceso iniciado.
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body('email') email: string,
  ): Promise<{ success: boolean }> {
    return await this.authService.forgotPassword(email);
  }

  /**
   * @method verifyOtp
   * @description Fase 2: Valida el código OTP y entrega un token de recuperación.
   * @param {string} email - Correo del solicitante.
   * @param {string} otp - Código de 6 dígitos.
   * @returns {Promise<{ recoveryToken: string }>} Token para autorizar el paso 3.
   */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ): Promise<{ recoveryToken: string }> {
    return await this.authService.verifyOtp(email, otp);
  }

  /**
   * @method resetPassword
   * @description Fase 3: Ejecuta el cambio de contraseña utilizando el token de recuperación.
   * @param {string} email - Correo asociado.
   * @param {string} password - Nueva credencial.
   * @param {string} recoveryToken - Token de autorización obtenido en fase 2.
   * @returns {Promise<{ message: string }>} Confirmación de éxito.
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('recoveryToken') recoveryToken: string,
  ): Promise<{ message: string }> {
    return await this.authService.resetPassword(email, password, recoveryToken);
  }
}
