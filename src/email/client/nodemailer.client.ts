import { Injectable } from '@nestjs/common';
import { Environment } from 'src/env/environment';
import * as nodemailer from 'nodemailer';
import { MailerClient, MailerOptions } from '../email.shared';

@Injectable()
export class NodemailerClient implements MailerClient {
  private transporter: nodemailer.Transporter;

  constructor(private readonly env: Environment) {
    this.transporter = nodemailer.createTransport({
      host: env.emailConfig.host,
      port: env.emailConfig.port,
      secure: env.emailConfig.secure,
      ignoreTLS: env.emailConfig.ignoreTLS,
      requireTLS: env.emailConfig.requireTLS,
      auth: {
        user: env.emailConfig.auth.user,
        pass: env.emailConfig.auth.pass,
      },
    });
  }

  async sendMail(mailerOptions: MailerOptions): Promise<void> {
    let html: string | undefined;

    await this.transporter.sendMail({
      ...mailerOptions,
      from: mailerOptions.from ? mailerOptions.from : `"${this.env.emailConfig.defaultName}" <${this.env.emailConfig.defaultEmail}>`,
      html: mailerOptions.html ?? html,
    });
  }
}
