import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { ProjectModule } from '@/api/project/project.module';

import { SourceMapController } from './sourceMap.controller';
import { SourceMapService } from './sourceMap.service';
import { SourceMap } from './sourceMap.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SourceMap]),
    MulterModule.register({
      dest: process.env.UPLOAD_SOURCEMAP_FILE_PATH,
    }),
    ProjectModule,
  ],
  controllers: [SourceMapController],
  providers: [SourceMapService],
  exports: [SourceMapService],
})
export class SourceMapModule {}
