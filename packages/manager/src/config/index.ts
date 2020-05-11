import type { ConnectionOptions } from 'typeorm';
import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch';
import type { QueueOptions } from 'bull';

import { config as devConfig } from './dev.config';
import { config as prodConfig } from './prod.config';

export interface Config {
  orm: ConnectionOptions;
  elasticsearch: ElasticsearchModuleOptions;
  redis: QueueOptions['redis'];
}

export const config =
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
