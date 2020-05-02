import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from '@/config';

export const DatabaseModule = [
  ElasticsearchModule.register(config.elasticsearch),
  TypeOrmModule.forRoot(config.orm),
];
