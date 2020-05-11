import { Module } from '@nestjs/common';

import { databaseModules } from './database';

@Module({
  imports: [...databaseModules],
})
export class SharedModule {}
