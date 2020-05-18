import * as dotenv from 'dotenv';
import type { Config } from './index';

import { Organization } from '@/api/organization/organization.entity';
import { Project } from '@/api/project/project.entity';
import { User } from '@/api/user/user.entity';
import { Replay } from '@/api/replay/replay.entity';
import { SourceMap } from '@/api/sourceMap/sourceMap.entity';

dotenv.config();

const entities = [Organization, Project, User, Replay, SourceMap];

export const config: Config = {
  orm: {
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
    database: process.env.TYPEORM_DATABASE,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    synchronize: true,
    cache: {
      duration: 30000, // 30 seconds
    },
    entities,
    logging: false,
  },
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
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
  sms: {
    sending_interval: parseInt(process.env.SMS_SENDING_INTERVAL, 10),
    config: {
      accessKeyId: process.env.SMS_CONFIG_ACCESS_KEY_ID,
      accessKeySecret: process.env.SMS_CONFIG_ACCESS_KEY_SECRET,
      endpoint: process.env.SMS_CONFIG_ENDPOINT,
      apiVersion: process.env.SMS_CONFIG_API_VERSION,
    },
    params: {
      RegionId: process.env.SMS_PARAMS_REGION_ID,
      SignName: process.env.SMS_PARAMS_SIGN_NAME,
      TemplateCode: process.env.SMS_PARAMS_TEMPLATE_CODE,
    },
  },
};
