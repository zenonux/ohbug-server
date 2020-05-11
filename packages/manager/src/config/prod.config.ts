import * as dotenv from 'dotenv';

import { Issue } from '@/core/issue/issue.entity';

import type { Config } from './index';

dotenv.config();

const entities = [Issue];

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
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE,
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD,
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
};
