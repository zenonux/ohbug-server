import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from '@/config';

export const ESModule = ElasticsearchModule.register(config.elasticsearch);

export const TOModule = TypeOrmModule.forRoot(config.orm);

export const redisModule = BullModule.registerQueue({
  name: 'event',
  redis: config.redis,
});

export const databaseModules = [TOModule, redisModule];
