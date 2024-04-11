import { ConflictException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import * as auth from '../../../translation/en_US/auth.json';

export class EmailAlreadyConfirmedException extends ConflictException {
  constructor(error?: string) {
    const i18n = I18nContext.current();
    const message = i18n?.t('auth.exception.emailAlreadyConfirmed') || auth.exception.emailAlreadyConfirmed;
    super(message, error || 'Email already confirmed');
  }
}
