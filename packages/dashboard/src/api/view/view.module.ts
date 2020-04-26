import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '@/api/project/project.module';

import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import { View } from './view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([View]), ProjectModule],
  controllers: [ViewController],
  providers: [ViewService],
  exports: [ViewService],
})
export class ViewModule {}
