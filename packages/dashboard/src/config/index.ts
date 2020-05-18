import type { ConnectionOptions } from 'typeorm';
import type { JwtModuleOptions } from '@nestjs/jwt';
import type { RedisModuleOptions } from 'nestjs-redis';

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
  redis: RedisModuleOptions;
  sms: {
    sending_interval: number;
    config: {
      accessKeyId: string;
      accessKeySecret: string;
      endpoint: string;
      apiVersion: string;
    };
    params: {
      RegionId: string;
      SignName: string;
      TemplateCode: string;
    };
  };
}

export const config =
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
