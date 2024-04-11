import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NodemailerClient } from './client/nodemailer.client';

@Module({
  providers: [
    EmailService,
    {
      provide: 'MAILER_CLIENT',
      useClass: NodemailerClient,
    },
  ],
  exports: [EmailService],
})
export class MailModule {}
