import { Module } from '@nestjs/common';
import { FileStorageModule } from './file-storage/file-storage.module';
import { UserModule } from './api/user/user.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AuthModule } from './api/auth/auth.module';
import * as path from 'path';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { Environment } from './env/environment';
import { EnvironmentModule } from './env/environment.module';
import { AuthGoogleModule } from './api/auth-google/auth-google.module';
import { FileStorageProvider } from './app.shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    I18nModule.forRootAsync({
      useFactory: (env: Environment) => ({
        fallbackLanguage: env.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: !env.isProduction,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      imports: [EnvironmentModule],
      inject: [Environment],
    }),
    AuthModule,
    AuthGoogleModule,
    FileStorageModule,
    DatabaseModule,
    UserModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
