import { BadRequestException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import * as auth from '../../../translation/en_US/auth.json';

export class InvalidTokenException extends BadRequestException {
  constructor(error?: string) {
    const i18n = I18nContext.current();
    const message = i18n?.t('auth.exception.invalidToken') || auth.exception.invalidToken;
    super(message, error || 'Invalid Token');
  }
}
