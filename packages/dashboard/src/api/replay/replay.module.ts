import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReplayController } from './replay.controller';
import { ReplayService } from './replay.service';
import { Replay } from './replay.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Replay])],
  controllers: [ReplayController],
  providers: [ReplayService],
  exports: [ReplayService],
})
export class ReplayModule {}
