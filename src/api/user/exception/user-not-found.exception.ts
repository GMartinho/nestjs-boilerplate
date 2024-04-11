import { NotFoundException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import * as user from '../../../translation/en_US/user.json';

export class UserNotFoundException extends NotFoundException {
  constructor(error?: string) {
    const i18n = I18nContext.current();
    const message = i18n?.t('user.exception.notFound') || user.exception.notFound;
    super(message, error || 'User Not Found');
  }
}
