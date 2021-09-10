import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BullModule } from '@nestjs/bull'

export const RedisModule = BullModule.registerQueueAsync({
  name: 'event',
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    redis: configService.get('database.redis'),
  }),
  inject: [ConfigService],
})

@Global()
@Module({
  imports: [RedisModule],
})
export class DatabaseModule {}
