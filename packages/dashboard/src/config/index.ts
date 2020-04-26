import type { ConnectionOptions } from 'typeorm';
import type { JwtModuleOptions } from '@nestjs/jwt';

import { config as devConfig } from './dev.config';
import { config as prodConfig } from './prod.config';

export interface Config {
  orm: ConnectionOptions;
  oauth: {
    github: {
      client_id: string;
      client_secret: string;
      callback_url: string;
    };
  };
  jwt: JwtModuleOptions;
}

export const config =
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
