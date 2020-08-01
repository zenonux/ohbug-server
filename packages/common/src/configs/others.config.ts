import { registerAs } from '@nestjs/config';

export const othersConfig = registerAs('others', () => ({
  oauth: {
    github: {
      client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
      client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
      callback_url: process.env.OAUTH_GITHUB_CALLBACK_URL,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  },
  expiredData: {
    interval: process.env.TIME_INTERVAL_FOR_CLEANING_UP_EXPIRED_DATA,
  },
  sourceMap: {
    max: 10,
  },
}));
