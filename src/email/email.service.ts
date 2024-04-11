import { Inject, Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import path from 'path';
import { Environment } from 'src/env/environment';
import { EmailData, MailerClient } from './email.shared';
import { MaybeType } from 'src/app.shared';

@Injectable()
export class EmailService {
  constructor(
    @Inject('MAILER_CLIENT') private mailer: MailerClient,
    private readonly env: Environment,
  ) {}

  set mailerClient(mailer: MailerClient) {
    this.mailer = mailer;
  }

  async userSignUp(mailData: EmailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let emailConfirmTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle, text1, text2, text3] = await Promise.all([
        i18n.t('common.confirmEmail'),
        i18n.t('confirm-email.text1'),
        i18n.t('confirm-email.text2'),
        i18n.t('confirm-email.text3'),
      ]);
    }

    const url = new URL(`${this.env.app.frontendDomain}/confirm-email`);
    url.searchParams.set('hash', mailData.data.hash);

    await this.mailer.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${url.toString()} ${emailConfirmTitle}`,
      templatePath: path.join(this.env.app.workingDirectory, 'src', 'mail', 'mail-templates', 'activation.hbs'),
      context: {
        title: emailConfirmTitle,
        url: url.toString(),
        actionTitle: emailConfirmTitle,
        app_name: this.env.app.name,
        text1,
        text2,
        text3,
      },
    });
  }

  async forgotPassword(mailData: EmailData<{ hash: string; tokenExpires: number }>): Promise<void> {
    const i18n = I18nContext.current();
    let resetPasswordTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    let text4: MaybeType<string>;

    if (i18n) {
      [resetPasswordTitle, text1, text2, text3, text4] = await Promise.all([
        i18n.t('common.resetPassword'),
        i18n.t('reset-password.text1'),
        i18n.t('reset-password.text2'),
        i18n.t('reset-password.text3'),
        i18n.t('reset-password.text4'),
      ]);
    }

    const url = new URL(`${this.env.app.frontendDomain}/password-change`);
    url.searchParams.set('hash', mailData.data.hash);
    url.searchParams.set('expires', mailData.data.tokenExpires.toString());

    await this.mailer.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      text: `${url.toString()} ${resetPasswordTitle}`,
      templatePath: path.join(this.env.app.workingDirectory, 'src', 'mail', 'mail-templates', 'reset-password.hbs'),
      context: {
        title: resetPasswordTitle,
        url: url.toString(),
        actionTitle: resetPasswordTitle,
        app_name: this.env.app.name,
        text1,
        text2,
        text3,
        text4,
      },
    });
  }
}
