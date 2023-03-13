import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'your-username',
        pass: 'your-password',
      },
    });
  }

  async sendEmail(to: string, subject: string, message: string) {
    await this.transporter.sendMail({
      from: 'your-email@example.com',
      to,
      subject,
      text: message,
    });
  }
}
