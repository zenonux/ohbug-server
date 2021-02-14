import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BullModule } from '@nestjs/bull'

export const OrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) =>
    configService.get('database.orm')!,
  inject: [ConfigService],
})

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
  imports: [OrmModule, RedisModule],
})
export class DatabaseModule {}
