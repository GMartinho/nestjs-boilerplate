import { Module } from '@nestjs/common';
import { FileStorageModule } from './file-storage/file-storage.module';
import { UserModule } from './api/user/user.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AppConfig } from './app.config';
import * as path from 'path';

@Module({
  imports: [
    FileStorageModule,
    UserModule,
    I18nModule.forRootAsync({
      useFactory: (appConfig: AppConfig) => ({
        fallbackLanguage: appConfig.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [AppConfig],
    })
  ],
  controllers: [],
  providers: [],

})
export class AppModule {}
