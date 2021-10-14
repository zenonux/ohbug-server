import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { BullModule } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'

import { ConfigModule, SourceMap } from '@ohbug-server/common'

import { ProjectModule } from '../project/project.module'
import { SourceMapController } from './sourceMap.controller'
import { SourceMapService } from './sourceMap.service'
import { SourceMapConsumer } from './sourceMap.processor'

@Module({
  imports: [
    TypeOrmModule.forFeature([SourceMap]),
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        dest: configService.get('business.uploadSourcemapFilePath'),
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'sourceMap',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: configService.get('database.redis'),
      }),
      inject: [ConfigService],
    }),
    ProjectModule,
  ],
  controllers: [SourceMapController],
  providers: [SourceMapService, SourceMapConsumer],
  exports: [SourceMapService],
})
export class SourceMapModule {}
