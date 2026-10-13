import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../../application/services/auth.service';
import { RsaService } from '../security/rsa.service';
import {
  AuthResponse,
  UserPayload,
} from '../../application/interfaces/auth-response.interface';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginDto } from '../dtos/login.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

/**
 * @class AuthController
 * @description Expone los servicios de autenticación y gestión de credenciales con protección de tasa (Rate Limiting).
 */
@Controller('auth')
@Throttle({ default: { limit: 10, ttl: 60000 } })
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
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ success: boolean }> {
    return await this.authService.forgotPassword(dto.email);
  }

  /**
   * @method verifyOtp
   * @description Fase 2: Valida el código OTP y entrega un token de recuperación.
   * @param {VerifyOtpDto} dto - Correo del solicitante y código OTP de 6 dígitos.
   * @returns {Promise<{ recoveryToken: string }>} Token para autorizar el paso 3.
   */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
  ): Promise<{ recoveryToken: string }> {
    return await this.authService.verifyOtp(dto.email, dto.otp);
  }

  /**
   * @method resetPassword
   * @description Fase 3: Ejecuta el cambio de contraseña utilizando el token de recuperación.
   * @param {ResetPasswordDto} dto - Correo, nueva credencial y token firmado.
   * @returns {Promise<{ message: string }>} Confirmación de éxito.
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return await this.authService.resetPassword(
      dto.email,
      dto.password,
      dto.recoveryToken,
    );
  }
}
