import nodemailer from 'nodemailer';

export interface MailerClient {
    sendMail(mailerOptions: MailerOptions): Promise<void>
}

export interface EmailData<T = never> {
    to: string;
    data: T;
}

export type MailerOptions = nodemailer.SendEmailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
}

export type EmailConfig = {
    port: number;
    host?: string;
    user?: string;
    password?: string;
    defaultEmail?: string;
    defaultName?: string;
    ignoreTLS: boolean;
    secure: boolean;
    requireTLS: boolean;
};