import { UnauthorizedException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import * as auth from '../../../translation/en_US/auth.json';

export class InvalidIdTokenException extends UnauthorizedException {
  constructor(error?: string) {
    const i18n = I18nContext.current();
    const message = i18n?.t('auth-google.exception.invalidIdToken');
    super(message, error || 'Invalid Id Token from Google');
  }
}
