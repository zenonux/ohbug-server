import { Module } from '@nestjs/common';

import { ConfigModule } from '@ohbug-server/common';

import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule, DatabaseModule],
})
export class SharedModule {}
