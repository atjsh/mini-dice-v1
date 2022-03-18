import { Controller, Get, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('')
export class AppTestControlelr {
  @Get('')
  toHello(@Res() res: FastifyReply) {
    console.log(res.redirect('/haha'));
  }
}
