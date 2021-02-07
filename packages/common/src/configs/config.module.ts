import { Module } from '@nestjs/common'
import { ConfigModule as ConfigBaseModule } from '@nestjs/config'

import { databaseConfig } from './database.config'
import { serviceConfig } from './service.config'
import { businessConfig } from './business.config'
import { securityConfig } from './security.config'

@Module({
  imports: [
    ConfigBaseModule.forRoot({
      load: [databaseConfig, serviceConfig, businessConfig, securityConfig],
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
