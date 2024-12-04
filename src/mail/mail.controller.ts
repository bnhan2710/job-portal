import { Controller, Get, Res } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from '../decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,
  ) {}


  @Get()
  @Public()
  @ResponseMessage('Mail sent')
  async sendMail(@Res() res) {
    await this.mailerService.sendMail({
      to: 'duyto3636@gmail.com',
      from: '"Support Team" <hehe@support.com>',
      subject: 'Testing Nest MailerModule ✔',
      template: 'job'
    });
  } 
}
