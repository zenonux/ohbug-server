import { Module } from '@nestjs/common';
import { ConfigModule as ConfigBaseModule } from '@nestjs/config';
import path from 'path';

import { databaseConfig } from './database.config';
import { serviceConfig } from './service.config';
import { othersConfig } from './others.config';

@Module({
  imports: [
    ConfigBaseModule.forRoot({
      envFilePath: [path.resolve(__dirname, '../../.env')],
      load: [databaseConfig, serviceConfig, othersConfig],
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
