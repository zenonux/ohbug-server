import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from '@/config';

export const ESModule = ElasticsearchModule.register(config.elasticsearch);

export const databaseModules = [TypeOrmModule.forRoot(config.orm)];
