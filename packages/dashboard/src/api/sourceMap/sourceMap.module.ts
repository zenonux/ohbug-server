import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { BullModule } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'

import { ConfigModule } from '@ohbug-server/common'
import { ProjectModule } from '../project/project.module'
import { SourceMapController } from './sourceMap.controller'
import { SourceMapService } from './sourceMap.service'
import { SourceMap } from './sourceMap.entity'
import { SourceMapConsumer } from './sourceMap.processor'

@Module({
  imports: [
    TypeOrmModule.forFeature([SourceMap]),
    MulterModule.register({
      dest: process.env.UPLOAD_SOURCEMAP_FILE_PATH,
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
