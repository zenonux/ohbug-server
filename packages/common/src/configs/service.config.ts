import { registerAs } from '@nestjs/config';

export const serviceConfig = registerAs('service', () => ({
  email: {
    user: process.env.EMAIL_NOTICE_USER,
    pass: process.env.EMAIL_NOTICE_PASS,
  },
  webpush: {
    publicKey: process.env.WEBPUSH_PUBLIC_KEY,
    privateKey: process.env.WEBPUSH_PRIVATE_KEY,
  },
}));
