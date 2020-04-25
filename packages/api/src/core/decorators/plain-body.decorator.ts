import rawbody from 'raw-body';
import {
  createParamDecorator,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

// https://stackoverflow.com/questions/52283713/how-do-i-pass-plain-text-as-my-request-body-using-nestjs
export const PlainBody = createParamDecorator(async (_: unknown, req) => {
  if (req.readable) {
    return (await rawbody(req)).toString().trim();
  }
  throw new HttpException(
    'Body aint text/plain',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
});
