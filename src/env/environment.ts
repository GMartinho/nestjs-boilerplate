import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Environment {
  constructor(private configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' environment variable is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replaceAll('\\n', '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE');
  }

  get bucket() {
    return {
      region: this.getString('AWS_S3_BUCKET_REGION'),
      apiVersion: this.getString('AWS_S3_API_VERSION'),
      name: this.getString('AWS_S3_BUCKET_NAME'),
    };
  }

  get bucketProvider() {
    return this.getString('BUCKET_PROVIDER');
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get authConfig() {
    return {
      confirmEmailSecret: this.getString('CONFIRM_EMAIL_SECRET'),
      confirmEmailExpiresIn: this.getNumber('CONFIRM_EMAIL_EXPIRES'),
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get app() {
    return {
      name: this.getString('APP_NAME'),
      port: this.getString('APP_PORT'),
      frontendDomain: this.getString('APP_FRONTEND_DOMAIN'),
      workingDirectory: this.getString('APP_WORKING_DIRECTORY'),
    };
  }

  get jwtSecret(): string {
    return this.getString('JWT_SECRET');
  }

  get google() {
    return {
      clientId: this.getString('GOOGLE_CLIENT_ID'),
      clientSecret: this.getString('GOOGLE_CLIENT_SECRET'),
    };
  }

  get emailConfig() {
    return {
      host: this.getString('EMAIL_CONFIG_HOST'),
      port: this.getNumber('EMAIL_CONFIG_PORT'),
      secure: this.getString('EMAIL_CONFIG_SECURE'),
      ignoreTLS: this.getString('EMAIL_CONFIG_IGNORE_TLS'),
      requireTLS: this.getString('EMAIL_CONFIG_REQUIRE_TLS'),
      auth: {
        user: this.getString('EMAIL_CONFIG_AUTH_USER'),
        pass: this.getString('EMAIL_CONFIG_AUTH_PASS'),
      },
      defaultName: this.getString('EMAIL_CONFIG_DEFAULT_NAME'),
      defaultEmail: this.getString('EMAIL_CONFIG_DEFAULT_EMAIL'),
    };
  }
}
