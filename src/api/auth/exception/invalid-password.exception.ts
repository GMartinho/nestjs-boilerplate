import { UnauthorizedException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import * as auth from '../../../translation/en_US/auth.json';

export class InvalidPasswordException extends UnauthorizedException {
  constructor(error?: string) {
    const i18n = I18nContext.current();
    const message = i18n?.t('auth.exception.invalidPassword') || auth.exception.invalidPassword;
    super(message, error || 'Invalid Password');
  }
}
